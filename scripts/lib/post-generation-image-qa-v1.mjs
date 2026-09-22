export const POST_GENERATION_QA_ID = 'finanzneo-post-generation-image-qa-v1';
export const POST_GENERATION_QA_FILE = '05-projektdateien/image-vision-qa.json';
export const PIXEL_QA_VERSION = 1;

export const SEMANTIC_DIMENSIONS = [
  'voiceBeatMatch',
  'cameraMatch',
  'storyActionMatch',
  'locationMatch',
  'mainSubjectMatch',
  'causeEffectReadability',
  'visualHookStrength',
  'v9WorldConsistency',
  'sequenceNovelty',
];

export const MIN_SEMANTIC_SCORE = 4;
export const MIN_HOOK_SCORE = 4;
export const MAX_DHASH_DISTANCE_FOR_NEAR_DUPLICATE = 3;
export const MIN_LUMA_STDDEV = 7;
export const MIN_NONBLACK_RATIO = 0.035;

export const bitCount64 = (value) => {
  let current = BigInt(value);
  let count = 0;
  while (current) {
    count += Number(current & 1n);
    current >>= 1n;
  }
  return count;
};

export const hammingDistanceHex = (left, right) => {
  if (!/^[0-9a-f]{16}$/i.test(String(left)) || !/^[0-9a-f]{16}$/i.test(String(right))) return null;
  return bitCount64(BigInt(`0x${left}`) ^ BigInt(`0x${right}`));
};

export const dHashFromGray9x8 = (bytes) => {
  if (!bytes || bytes.length !== 72) throw new Error('dHash erwartet exakt 72 Graustufenbytes (9x8).');
  let bits = 0n;
  let bit = 0n;
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      const left = bytes[y * 9 + x];
      const right = bytes[y * 9 + x + 1];
      if (left > right) bits |= 1n << bit;
      bit += 1n;
    }
  }
  return bits.toString(16).padStart(16, '0');
};

export const luminanceStats = (bytes) => {
  if (!bytes?.length) return {mean: 0, stddev: 0, nonBlackRatio: 0};
  let sum = 0;
  let nonBlack = 0;
  for (const value of bytes) {
    sum += value;
    if (value >= 16) nonBlack += 1;
  }
  const mean = sum / bytes.length;
  let variance = 0;
  for (const value of bytes) variance += (value - mean) ** 2;
  variance /= bytes.length;
  return {
    mean: Number(mean.toFixed(3)),
    stddev: Number(Math.sqrt(variance).toFixed(3)),
    nonBlackRatio: Number((nonBlack / bytes.length).toFixed(4)),
  };
};

export const evaluatePixelQa = ({stats, nearestDistance}) => {
  const blockers = [];
  const warnings = [];
  if (stats.stddev < MIN_LUMA_STDDEV && stats.nonBlackRatio < MIN_NONBLACK_RATIO) {
    blockers.push('Bild ist nahezu leer/schwarz und enthält zu wenig sichtbare Bildinformation.');
  }
  if (nearestDistance !== null && nearestDistance <= MAX_DHASH_DISTANCE_FOR_NEAR_DUPLICATE) {
    blockers.push(`Bild ist einem anderen Bild visuell nahezu identisch (dHash-Distanz ${nearestDistance}).`);
  } else if (nearestDistance !== null && nearestDistance <= 7) {
    warnings.push(`Bild ist einem anderen Bild stark ähnlich (dHash-Distanz ${nearestDistance}); semantisch prüfen.`);
  }
  return {status: blockers.length ? 'FAIL' : 'PASS', blockers, warnings};
};

export const emptySemanticAssessment = (sceneId, fileName) => ({
  sceneId,
  fileName,
  status: 'PENDING',
  scores: Object.fromEntries(SEMANTIC_DIMENSIONS.map((key) => [key, null])),
  observed: {
    camera: '',
    location: '',
    mainSubject: '',
    storyAction: '',
    causeEffect: '',
    visualHook: '',
    v9World: '',
    sequenceDifference: '',
  },
  blockers: [],
  regenerationInstruction: '',
});

export const validateSemanticAssessment = (assessment) => {
  const errors = [];
  if (!assessment || assessment.status !== 'PASS') errors.push('Vision-QA status muss PASS sein.');
  for (const key of SEMANTIC_DIMENSIONS) {
    const score = Number(assessment?.scores?.[key]);
    if (!Number.isInteger(score) || score < 1 || score > 5) errors.push(`${key} muss als Ganzzahl 1–5 bewertet sein.`);
    else if (score < MIN_SEMANTIC_SCORE) errors.push(`${key}=${score} liegt unter Mindestscore ${MIN_SEMANTIC_SCORE}.`);
  }
  const hook = Number(assessment?.scores?.visualHookStrength);
  if (Number.isInteger(hook) && hook < MIN_HOOK_SCORE) errors.push(`visualHookStrength muss mindestens ${MIN_HOOK_SCORE}/5 sein.`);
  if (Array.isArray(assessment?.blockers) && assessment.blockers.length > 0) errors.push('Vision-QA enthält noch Blocker.');
  return errors;
};
