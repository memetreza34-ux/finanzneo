#!/usr/bin/env node
// FinanzNeo data fetcher.
// Remote data is fetched BEFORE rendering and stored as local snapshots in public/data/.
// Productive Remotion compositions must never depend on remote APIs at render time.

import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'data');
mkdirSync(OUT, {recursive: true});

const USER_AGENT = {'User-Agent': 'FinanzNeo/1.0 data-snapshot-fetcher'};
const today = new Date().toISOString().slice(0, 10);

async function getJson(url, headers = {}) {
  const response = await fetch(url, {headers: {...USER_AGENT, ...headers}});
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${url}`);
  return response.json();
}

async function getText(url, headers = {}) {
  const response = await fetch(url, {headers: {...USER_AGENT, ...headers}});
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${url}`);
  return response.text();
}

function downsample(values, maxPoints = 120) {
  if (values.length <= maxPoints) return values;
  const step = (values.length - 1) / (maxPoints - 1);
  return Array.from({length: maxPoints}, (_, index) => values[Math.round(index * step)]);
}

function saveJson(name, payload) {
  const file = join(OUT, `${name}.json`);
  writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
  const chart = Array.isArray(payload.chart) ? payload.chart : [];
  const last = chart.at(-1);
  const suffix = last ? `, zuletzt ${last.x} = ${last.y}` : '';
  console.log(`✓ ${name}.json (${chart.length} Punkte${suffix})`);
}

function parseCsvRow(line, delimiter) {
  const cells = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      cells.push(value);
      value = '';
    } else {
      value += char;
    }
  }

  cells.push(value);
  return cells.map((cell) => cell.trim());
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length < 2) throw new Error('CSV enthält keine Datenzeilen.');

  const commaCount = (lines[0].match(/,/g) ?? []).length;
  const semicolonCount = (lines[0].match(/;/g) ?? []).length;
  const delimiter = semicolonCount > commaCount ? ';' : ',';
  const headers = parseCsvRow(lines[0], delimiter);

  return lines.slice(1).map((line) => {
    const cells = parseCsvRow(line, delimiter);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
  });
}

function firstColumn(row, candidates) {
  for (const key of candidates) {
    if (Object.hasOwn(row, key) && row[key] !== '') return row[key];
  }
  return undefined;
}

function parseObservationNumber(raw) {
  if (raw == null || raw === '') return null;
  const normalized = String(raw).replace(/\s/g, '').replace(',', '.');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function csvToChart(text) {
  const rows = parseCsv(text);
  const chart = [];

  for (const row of rows) {
    const x = firstColumn(row, ['TIME_PERIOD', 'time_period', 'TIME', 'Time', 'date', 'DATE']);
    const rawY = firstColumn(row, ['OBS_VALUE', 'obs_value', 'VALUE', 'Value', 'value']);
    const y = parseObservationNumber(rawY);
    if (x != null && y != null) chart.push({x, y});
  }

  if (chart.length === 0) {
    throw new Error('Keine TIME_PERIOD/OBS_VALUE-Spalten im CSV gefunden. Serienstruktur prüfen.');
  }

  return downsample(chart);
}

function withRange(url, startPeriod, endPeriod) {
  const parsed = new URL(url);
  if (startPeriod) parsed.searchParams.set('startPeriod', startPeriod);
  if (endPeriod) parsed.searchParams.set('endPeriod', endPeriod);
  return parsed.toString();
}

function classifyMarketSymbol(symbol) {
  if (symbol.startsWith('^')) return 'index';
  if (symbol === 'URTH') return 'etf';
  return 'stock-or-fund';
}

async function stock(symbol, range = '10y', name = symbol) {
  if (!symbol) throw new Error('stock benötigt ein Symbol.');
  const sourceUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=1mo`;
  const json = await getJson(sourceUrl);
  const result = json.chart?.result?.[0];
  if (!result) throw new Error(`Yahoo Finance lieferte keine Serie für ${symbol}.`);

  const timestamps = result.timestamp ?? [];
  const close = result.indicators?.quote?.[0]?.close ?? [];
  const chart = timestamps
    .map((timestamp, index) => ({timestamp, close: close[index]}))
    .filter((point) => point.close != null)
    .map((point) => ({
      x: new Date(point.timestamp * 1000).toISOString().slice(0, 7),
      y: Math.round(point.close * 100) / 100,
    }));

  saveJson(name, {
    schemaVersion: 2,
    kind: 'timeseries',
    source: 'Yahoo Finance',
    provider: 'Yahoo Finance',
    seriesId: symbol,
    sourceUrl,
    fetchedAt: today,
    frequency: 'monthly-snapshot',
    unit: result.meta?.currency ?? null,
    instrumentType: classifyMarketSymbol(symbol),
    proxyFor: symbol === 'URTH' ? 'MSCI World exposure (ETF proxy; not original MSCI World Index)' : null,
    range,
    chart: downsample(chart),
  });
}

async function crypto(id = 'bitcoin', days = 365, name = id, vs = 'eur') {
  const sourceUrl = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=${encodeURIComponent(vs)}&days=${days}&interval=daily`;
  const json = await getJson(sourceUrl);
  const chart = (json.prices ?? []).map(([timestamp, price]) => ({
    x: new Date(timestamp).toISOString().slice(0, 10),
    y: Math.round(price * 100) / 100,
  }));

  saveJson(name, {
    schemaVersion: 2,
    kind: 'timeseries',
    source: 'CoinGecko',
    provider: 'CoinGecko',
    seriesId: id,
    sourceUrl,
    fetchedAt: today,
    frequency: 'daily',
    unit: vs.toUpperCase(),
    instrumentType: 'cryptoasset',
    proxyFor: null,
    chart: downsample(chart),
  });
}

async function fx(base = 'EUR') {
  const sourceUrl = `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;
  const json = await getJson(sourceUrl);
  const wanted = ['USD', 'GBP', 'CHF', 'JPY', json.rates?.BTC != null ? 'BTC' : 'CNY'];
  const rates = Object.fromEntries(wanted.filter((code) => json.rates?.[code] != null).map((code) => [code, json.rates[code]]));

  saveJson(`fx-${base.toLowerCase()}`, {
    schemaVersion: 2,
    kind: 'fx-snapshot',
    source: 'ExchangeRate-API',
    provider: 'ExchangeRate-API',
    seriesId: base,
    sourceUrl,
    fetchedAt: today,
    updated: json.time_last_update_utc ?? null,
    base,
    rates,
  });
}

async function ecb(flowRef, key, name, startPeriod, endPeriod) {
  if (!flowRef || !key || !name) {
    throw new Error('ecb benötigt: <flowRef> <key> <name> [startPeriod] [endPeriod]');
  }

  const baseUrl = `https://data-api.ecb.europa.eu/service/data/${encodeURIComponent(flowRef)}/${key}`;
  const ranged = withRange(baseUrl, startPeriod, endPeriod);
  const url = new URL(ranged);
  url.searchParams.set('format', 'csvdata');
  const sourceUrl = url.toString();
  const csv = await getText(sourceUrl, {Accept: 'text/csv'});

  saveJson(name, {
    schemaVersion: 2,
    kind: 'timeseries',
    source: 'European Central Bank',
    provider: 'ECB',
    seriesId: `${flowRef}/${key}`,
    sourceUrl,
    fetchedAt: today,
    frequency: key.split('.')[0] || null,
    unit: null,
    instrumentType: 'official-statistic',
    proxyFor: null,
    chart: csvToChart(csv),
  });
}

async function bundesbank(flowRef, key, name, startPeriod, endPeriod) {
  if (!flowRef || !key || !name) {
    throw new Error('bundesbank benötigt: <flowRef> <key> <name> [startPeriod] [endPeriod]');
  }

  const baseUrl = `https://api.statistiken.bundesbank.de/rest/data/${encodeURIComponent(flowRef)}/${key}`;
  const ranged = withRange(baseUrl, startPeriod, endPeriod);
  const url = new URL(ranged);
  url.searchParams.set('format', 'sdmx_csv');
  url.searchParams.set('lang', 'en');
  const sourceUrl = url.toString();
  const csv = await getText(sourceUrl, {Accept: 'text/csv'});

  saveJson(name, {
    schemaVersion: 2,
    kind: 'timeseries',
    source: 'Deutsche Bundesbank',
    provider: 'Bundesbank',
    seriesId: `${flowRef}/${key}`,
    sourceUrl,
    fetchedAt: today,
    frequency: key.split('.')[0] || null,
    unit: null,
    instrumentType: 'official-statistic',
    proxyFor: null,
    chart: csvToChart(csv),
  });
}

async function standardSets() {
  console.log('Hole FinanzNeo-Standarddatensätze …');
  await stock('URTH', '10y', 'msci-world-10y');
  await stock('^GSPC', '10y', 'sp500-10y');
  await stock('^GDAXI', '10y', 'dax-10y');
  await crypto('bitcoin', 365, 'bitcoin-1y');
  await crypto('ethereum', 365, 'ethereum-1y');
  await fx('EUR');
  console.log('\nFertig → public/data/');
  console.log('Hinweis: URTH ist im Snapshot ausdrücklich als ETF-Proxy markiert.');
}

function printHelp() {
  console.log(`FinanzNeo data fetcher\n\n` +
    `Standard:\n  node scripts/fetch-data.mjs\n\n` +
    `Markt:\n  node scripts/fetch-data.mjs stock AAPL 5y apple-5y\n` +
    `  node scripts/fetch-data.mjs crypto bitcoin 365 bitcoin-1y\n` +
    `  node scripts/fetch-data.mjs fx EUR\n\n` +
    `Offiziell:\n  node scripts/fetch-data.mjs ecb EXR M.USD.EUR.SP00.A eur-usd-monthly 2020-01\n` +
    `  node scripts/fetch-data.mjs bundesbank BBEX3 D.USD.EUR.BB.AC.000 usd-eur-daily 2026-01-01\n`);
}

const [command, ...args] = process.argv.slice(2);

try {
  if (!command) await standardSets();
  else if (command === 'stock') await stock(args[0], args[1] ?? '10y', args[2] ?? args[0]);
  else if (command === 'crypto') await crypto(args[0] ?? 'bitcoin', Number(args[1]) || 365, args[2] ?? args[0] ?? 'bitcoin', args[3] ?? 'eur');
  else if (command === 'fx') await fx(args[0] ?? 'EUR');
  else if (command === 'ecb') await ecb(args[0], args[1], args[2], args[3], args[4]);
  else if (command === 'bundesbank') await bundesbank(args[0], args[1], args[2], args[3], args[4]);
  else if (command === 'help' || command === '--help' || command === '-h') printHelp();
  else throw new Error(`Unbekannter Befehl: ${command}. Nutze --help.`);
} catch (error) {
  console.error('FEHLER:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}
