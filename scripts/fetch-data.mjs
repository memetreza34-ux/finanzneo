#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════════
//  FinanzNeo · Echte Finanzdaten holen (GRATIS, kein API-Key)
//  Quellen: Yahoo Finance (Aktien/ETF) · CoinGecko (Crypto) · ExchangeRate (FX)
//  Speichert chart-fertige JSONs nach public/data/  →  in Szene importieren:
//     import series from '../public/data/sp500-10y.json'
//     <AreaPremium data={series.chart} ... />   // series.chart = [{x,y}]
//
//  Nutzung:
//     node scripts/fetch-data.mjs            # holt die Standard-Sets
//     node scripts/fetch-data.mjs stock URTH 10y msci-world   # eigenes Set
//     node scripts/fetch-data.mjs crypto bitcoin 365 btc
//     node scripts/fetch-data.mjs fx EUR
//
//  ⚠️ Daten IMMER mit Quelle + Datum im Video zeigen (Glaubwürdigkeit + sauber).
// ════════════════════════════════════════════════════════════════════════════
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'data');
mkdirSync(OUT, { recursive: true });

const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' };
const today = new Date().toISOString().slice(0, 10);

async function get(url, headers = {}) {
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${url}`);
  return r.json();
}

// Downsample auf ~N Punkte (Charts bleiben sauber, nicht 2500 Punkte)
function downsample(arr, n = 60) {
  if (arr.length <= n) return arr;
  const step = (arr.length - 1) / (n - 1);
  return Array.from({ length: n }, (_, i) => arr[Math.round(i * step)]);
}

function save(name, obj) {
  const file = join(OUT, `${name}.json`);
  writeFileSync(file, JSON.stringify(obj, null, 2));
  const last = obj.chart?.[obj.chart.length - 1];
  console.log(`✓ ${name}.json  (${obj.chart?.length ?? 0} Punkte, zuletzt ${last?.x} = ${last?.y})`);
}

// ─── YAHOO FINANCE: Aktien / Indizes / ETFs ───────────────────────────────────
// symbol z.B. ^GSPC (S&P500), URTH (MSCI World ETF), ^GDAXI (DAX), AAPL …
async function stock(symbol, range = '10y', name = symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1mo`;
  const j = await get(url, UA);
  const res = j.chart.result[0];
  const ts = res.timestamp || [];
  const close = res.indicators.quote[0].close || [];
  const pts = ts.map((t, i) => ({ t, c: close[i] }))
    .filter((p) => p.c != null)
    .map((p) => ({ x: new Date(p.t * 1000).toISOString().slice(0, 7), y: Math.round(p.c * 100) / 100 }));
  save(name, {
    source: 'Yahoo Finance', symbol, range, fetchedAt: today,
    currency: res.meta.currency, chart: downsample(pts, 60),
  });
}

// ─── COINGECKO: Crypto-Historie ───────────────────────────────────────────────
async function crypto(id = 'bitcoin', days = 365, name = id, vs = 'eur') {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${vs}&days=${days}&interval=daily`;
  const j = await get(url);
  const pts = (j.prices || []).map(([t, p]) => ({ x: new Date(t).toISOString().slice(0, 10), y: Math.round(p) }));
  save(name, { source: 'CoinGecko', id, days, vs, fetchedAt: today, chart: downsample(pts, 60) });
}

// ─── EXCHANGERATE: Währungskurse (Snapshot) ───────────────────────────────────
async function fx(base = 'EUR') {
  const j = await get(`https://open.er-api.com/v6/latest/${base}`);
  const pick = ['USD', 'GBP', 'CHF', 'JPY', 'BTC' in j.rates ? 'BTC' : 'CNY'];
  const rates = Object.fromEntries(pick.filter((k) => j.rates[k] != null).map((k) => [k, j.rates[k]]));
  const file = join(OUT, `fx-${base.toLowerCase()}.json`);
  writeFileSync(file, JSON.stringify({ source: 'ExchangeRate-API', base, fetchedAt: today, updated: j.time_last_update_utc, rates }, null, 2));
  console.log(`✓ fx-${base.toLowerCase()}.json  (${Object.keys(rates).join(', ')})`);
}

// ─── CLI ──────────────────────────────────────────────────────────────────────
const [cmd, ...a] = process.argv.slice(2);
try {
  if (cmd === 'stock')      await stock(a[0], a[1], a[2]);
  else if (cmd === 'crypto') await crypto(a[0], Number(a[1]) || 365, a[2]);
  else if (cmd === 'fx')     await fx(a[0]);
  else {
    // Standard-Sets fürs Finanz-Repertoire
    console.log('Hole Standard-Datensätze…');
    await stock('URTH', '10y', 'msci-world-10y');   // MSCI World ETF
    await stock('^GSPC', '10y', 'sp500-10y');       // S&P 500
    await stock('^GDAXI', '10y', 'dax-10y');        // DAX
    await crypto('bitcoin', 365, 'bitcoin-1y');     // BTC 1 Jahr
    await crypto('ethereum', 365, 'ethereum-1y');   // ETH 1 Jahr
    await fx('EUR');                                 // EUR-Kurse
    console.log('\nFertig → public/data/');
  }
} catch (e) {
  console.error('FEHLER:', e.message);
  process.exit(1);
}
