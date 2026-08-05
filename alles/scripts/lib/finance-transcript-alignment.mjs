const normalizeToken = (value) => String(value ?? '')
  .toLocaleLowerCase('de-DE')
  .normalize('NFKC')
  .replace(/[^\p{L}\p{N}€%]+/gu, '')
  .trim();

const levenshtein = (left, right) => {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  const previous = Array.from({length: right.length + 1}, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= right.length; column += 1) {
      const above = previous[column];
      const substitution = diagonal + (left[row - 1] === right[column - 1] ? 0 : 1);
      const insertion = previous[column - 1] + 1;
      const deletion = above + 1;
      previous[column] = Math.min(substitution, insertion, deletion);
      diagonal = above;
    }
  }
  return previous[right.length];
};

const substitutionCost = (left, right) => {
  if (left === right) return 0;
  if (!left || !right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.25;
  const distance = levenshtein(left, right);
  const similarity = 1 - distance / Math.max(left.length, right.length);
  if (similarity >= 0.85) return 0.2;
  if (similarity >= 0.7) return 0.45;
  return 1;
};

export const tokenizeScriptScenes = (scenes) => {
  const tokens = [];
  for (let sceneIndex = 0; sceneIndex < scenes.length; sceneIndex += 1) {
    const raw = String(scenes[sceneIndex]?.voiceText ?? '').split(/\s+/).filter(Boolean);
    for (const text of raw) {
      const normalized = normalizeToken(text);
      if (!normalized) continue;
      tokens.push({
        text,
        normalized,
        sceneIndex,
        sceneId: scenes[sceneIndex]?.id ?? `scene-${sceneIndex + 1}`,
      });
    }
  }
  return tokens;
};

export const tokenizeTranscriptCaptions = (captions) => {
  const tokens = [];
  for (const caption of captions) {
    const parts = String(caption?.text ?? '').split(/\s+/).filter(Boolean);
    if (!parts.length) continue;
    const startMs = Number(caption.startMs);
    const endMs = Number(caption.endMs);
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) continue;
    const duration = endMs - startMs;
    for (let index = 0; index < parts.length; index += 1) {
      const normalized = normalizeToken(parts[index]);
      if (!normalized) continue;
      const tokenStart = Math.round(startMs + duration * index / parts.length);
      const tokenEnd = Math.round(startMs + duration * (index + 1) / parts.length);
      tokens.push({
        text: parts[index],
        normalized,
        startMs: tokenStart,
        endMs: Math.max(tokenStart + 1, tokenEnd),
        confidence: caption.confidence ?? null,
      });
    }
  }
  return tokens;
};

export const alignTokenSequences = (scriptTokens, transcriptTokens) => {
  const rows = scriptTokens.length + 1;
  const columns = transcriptTokens.length + 1;
  const costs = Array.from({length: rows}, () => new Float64Array(columns));
  const moves = Array.from({length: rows}, () => new Uint8Array(columns));

  for (let row = 1; row < rows; row += 1) {
    costs[row][0] = row;
    moves[row][0] = 1;
  }
  for (let column = 1; column < columns; column += 1) {
    costs[0][column] = column;
    moves[0][column] = 2;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const diagonal = costs[row - 1][column - 1] + substitutionCost(
        scriptTokens[row - 1].normalized,
        transcriptTokens[column - 1].normalized,
      );
      const deleteScript = costs[row - 1][column] + 1;
      const insertTranscript = costs[row][column - 1] + 1;
      if (diagonal <= deleteScript && diagonal <= insertTranscript) {
        costs[row][column] = diagonal;
        moves[row][column] = 0;
      } else if (deleteScript <= insertTranscript) {
        costs[row][column] = deleteScript;
        moves[row][column] = 1;
      } else {
        costs[row][column] = insertTranscript;
        moves[row][column] = 2;
      }
    }
  }

  const scriptToTranscript = new Array(scriptTokens.length).fill(null);
  let row = scriptTokens.length;
  let column = transcriptTokens.length;
  let strongMatches = 0;
  let fuzzyMatches = 0;
  while (row > 0 || column > 0) {
    const move = moves[row][column];
    if (row > 0 && column > 0 && move === 0) {
      const cost = substitutionCost(scriptTokens[row - 1].normalized, transcriptTokens[column - 1].normalized);
      if (cost <= 0.45) {
        scriptToTranscript[row - 1] = column - 1;
        if (cost === 0) strongMatches += 1;
        else fuzzyMatches += 1;
      }
      row -= 1;
      column -= 1;
    } else if (row > 0 && (column === 0 || move === 1)) {
      row -= 1;
    } else {
      column -= 1;
    }
  }

  const matched = strongMatches + fuzzyMatches;
  return {
    scriptToTranscript,
    strongMatches,
    fuzzyMatches,
    matched,
    coverage: scriptTokens.length ? matched / scriptTokens.length : 0,
    normalizedCost: scriptTokens.length ? costs[scriptTokens.length][transcriptTokens.length] / scriptTokens.length : 1,
  };
};

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const resolveSceneTimingFromTranscript = ({
  scenes,
  captions,
  audioDurationMs,
  minimumCoverage = 0.72,
  minimumSceneMs = 1200,
}) => {
  if (!Array.isArray(scenes) || scenes.length === 0) throw new Error('Keine Szenen für die Transkript-Ausrichtung vorhanden.');
  if (!Array.isArray(captions) || captions.length === 0) throw new Error('Keine Transkript-Captions vorhanden.');
  if (!Number.isFinite(audioDurationMs) || audioDurationMs <= 0) throw new Error('Ungültige Audiodauer für die Transkript-Ausrichtung.');

  const scriptTokens = tokenizeScriptScenes(scenes);
  const transcriptTokens = tokenizeTranscriptCaptions(captions);
  if (!scriptTokens.length || !transcriptTokens.length) throw new Error('Skript oder Transkript enthält keine verwertbaren Wörter.');

  const alignment = alignTokenSequences(scriptTokens, transcriptTokens);
  if (alignment.coverage < minimumCoverage) {
    throw new Error(`Transkript stimmt nicht ausreichend mit dem freigegebenen Skript überein: ${(alignment.coverage * 100).toFixed(1)}% Wortabdeckung, benötigt ${(minimumCoverage * 100).toFixed(0)}%.`);
  }

  const sceneTokenRanges = scenes.map((scene, sceneIndex) => {
    const indexes = scriptTokens
      .map((token, index) => token.sceneIndex === sceneIndex ? alignment.scriptToTranscript[index] : null)
      .filter((index) => Number.isInteger(index));
    return {
      sceneId: scene.id,
      firstTranscriptIndex: indexes.length ? Math.min(...indexes) : null,
      lastTranscriptIndex: indexes.length ? Math.max(...indexes) : null,
      matchedWords: indexes.length,
      scriptWords: scriptTokens.filter((token) => token.sceneIndex === sceneIndex).length,
    };
  });

  const scriptWordCounts = sceneTokenRanges.map((range) => Math.max(1, range.scriptWords));
  const totalScriptWords = scriptWordCounts.reduce((sum, value) => sum + value, 0);
  const fallbackBoundaries = [0];
  let cumulativeWords = 0;
  for (let index = 0; index < scenes.length - 1; index += 1) {
    cumulativeWords += scriptWordCounts[index];
    fallbackBoundaries.push(Math.round(audioDurationMs * cumulativeWords / totalScriptWords));
  }
  fallbackBoundaries.push(audioDurationMs);

  const boundaries = [0];
  for (let index = 0; index < scenes.length - 1; index += 1) {
    const left = sceneTokenRanges[index];
    const right = sceneTokenRanges[index + 1];
    const leftEnd = Number.isInteger(left.lastTranscriptIndex)
      ? transcriptTokens[left.lastTranscriptIndex].endMs
      : null;
    const rightStart = Number.isInteger(right.firstTranscriptIndex)
      ? transcriptTokens[right.firstTranscriptIndex].startMs
      : null;
    let boundary = fallbackBoundaries[index + 1];
    if (Number.isFinite(leftEnd) && Number.isFinite(rightStart)) boundary = Math.round((leftEnd + rightStart) / 2);
    else if (Number.isFinite(leftEnd)) boundary = leftEnd;
    else if (Number.isFinite(rightStart)) boundary = rightStart;

    const earliest = boundaries[index] + minimumSceneMs;
    const remainingScenes = scenes.length - index - 1;
    const latest = audioDurationMs - remainingScenes * minimumSceneMs;
    boundaries.push(clamp(boundary, earliest, latest));
  }
  boundaries.push(audioDurationMs);

  const sceneTiming = scenes.map((scene, index) => ({
    sceneId: scene.id,
    startMs: boundaries[index],
    endMs: boundaries[index + 1],
    durationSec: Number(((boundaries[index + 1] - boundaries[index]) / 1000).toFixed(3)),
    matchedWords: sceneTokenRanges[index].matchedWords,
    scriptWords: sceneTokenRanges[index].scriptWords,
    matchCoverage: Number((sceneTokenRanges[index].matchedWords / Math.max(1, sceneTokenRanges[index].scriptWords)).toFixed(4)),
    timingSource: 'whisper-word-alignment',
  }));

  return {
    sceneTiming,
    alignment: {
      scriptWords: scriptTokens.length,
      transcriptWords: transcriptTokens.length,
      strongMatches: alignment.strongMatches,
      fuzzyMatches: alignment.fuzzyMatches,
      matchedWords: alignment.matched,
      coverage: Number(alignment.coverage.toFixed(4)),
      normalizedCost: Number(alignment.normalizedCost.toFixed(4)),
    },
  };
};
