// Real Quran recitation sources. Streamed over HTTPS (range-request capable),
// so we ship no large audio assets. Reciter + surah ids come straight from the
// onboarding answers (see steps.js: `reciter` and `firstSurah`).

// Per-reciter base URL on mp3quran.net. Each hosts full-surah MP3s named NNN.mp3.
const RECITERS = {
  alafasy: { name: 'Mishary Rashid Alafasy', base: 'https://server8.mp3quran.net/afs/' },
  sudais: { name: 'Abdul Rahman Al-Sudais', base: 'https://server11.mp3quran.net/sds/' },
  minshawi: { name: 'Mohamed Siddiq Al-Minshawi', base: 'https://server10.mp3quran.net/minsh/' },
};

// Onboarding surah ids → { number, titles }. Number drives the file name.
const SURAHS = {
  mulk: { n: 67, title: 'Surah Al-Mulk', arabic: 'تَبَارَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ', gloss: 'Blessed is He in whose hand is dominion.' },
  rahman: { n: 55, title: 'Surah Ar-Rahman', arabic: 'ٱلرَّحْمَٰنُ • عَلَّمَ ٱلْقُرْآنَ', gloss: 'The Most Merciful — taught the Quran.' },
  yaseen: { n: 36, title: 'Surah Ya-Seen', arabic: 'يسٓ • وَٱلْقُرْآنِ ٱلْحَكِيمِ', gloss: 'Ya Seen. By the wise Quran.' },
  kahf: { n: 18, title: 'Surah Al-Kahf', arabic: 'ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ', gloss: 'All praise to Allah who sent down the Book.' },
};

const DEFAULT_RECITER = 'alafasy';
const DEFAULT_SURAH = 'mulk';

const pad3 = (n) => String(n).padStart(3, '0');

// Resolve a playable recitation from onboarding selections (or sensible defaults).
// `reciter` 'surprise' (or anything unknown) falls back to Alafasy.
export function getRecitation(reciterId, surahId) {
  const reciter = RECITERS[reciterId] || RECITERS[DEFAULT_RECITER];
  const surah = SURAHS[surahId] || SURAHS[DEFAULT_SURAH];
  return {
    uri: `${reciter.base}${pad3(surah.n)}.mp3`,
    title: surah.title,
    subtitle: reciter.name,
    arabic: surah.arabic,
    gloss: surah.gloss,
  };
}

// --- Nightly schedule --------------------------------------------------------
// Each night maps to a specific, correct recitation:
//   • Friday  → Surah Al-Kahf (the Jumu'ah Sunnah)
//   • Otherwise → a deterministic per-date rotation, biased to the user's
//     nightly pick, so the recitation is right for *that* night and changes
//     night to night rather than being static.
const NIGHTLY_CYCLE = ['mulk', 'yaseen', 'rahman'];

// epoch-day index — same value for everyone on a given calendar day (UTC).
function epochDay(date) {
  return Math.floor(date.getTime() / 86400000);
}

export function getTonightSurahId(prefSurah, date = new Date()) {
  if (date.getDay() === 5) return 'kahf'; // Friday
  const pref = prefSurah && SURAHS[prefSurah] && prefSurah !== 'kahf' ? prefSurah : null;
  const cycle = pref ? [pref, ...NIGHTLY_CYCLE.filter((s) => s !== pref)] : NIGHTLY_CYCLE;
  return cycle[((epochDay(date) % cycle.length) + cycle.length) % cycle.length];
}

// Resolve tonight's full recitation (reciter + the scheduled surah).
export function getNightlyRecitation(reciterId, prefSurah, date = new Date()) {
  return getRecitation(reciterId, getTonightSurahId(prefSurah, date));
}

export { RECITERS, SURAHS };
