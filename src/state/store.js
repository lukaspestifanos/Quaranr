import AsyncStorage from '@react-native-async-storage/async-storage';

// Single source of truth for everything we persist locally.
const KEY = 'quaranr.state.v1';

export const defaultState = {
  onboarded: false,
  answers: {},          // keyed by step id
  name: null,
  commitment: null,     // { signedAt, strokes }
  referral: null,
  source: null,         // "how did you hear"
  streak: 1,            // streak starts at 1 the moment they show up
  lastSessionDay: null, // YYYY-MM-DD
  minutesTotal: 0,
  sessionsDone: 0,
  ratedUs: false,
  notificationsAsked: false,
  entitled: false,      // premium unlocked
  nowPlaying: null,     // { reciter, surah } — current selection in the hub
  lastCompletedSurah: null,
};

export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...defaultState };
    return reconcileStreak({ ...defaultState, ...JSON.parse(raw) });
  } catch (e) {
    return { ...defaultState };
  }
}

// On launch, break the streak if a full day was missed. The streak survives if
// the last session was today or yesterday; a gap of 2+ days resets it to 0
// (the next completed session restarts it at 1).
export function reconcileStreak(state) {
  if (state.lastSessionDay) {
    const gap = daysBetween(state.lastSessionDay, todayKey());
    if (gap >= 2) return { ...state, streak: 0 };
  }
  return state;
}

export async function saveState(state) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    // best-effort; non-fatal
  }
}

export async function resetState() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {}
}

export function todayKey() {
  // Local YYYY-MM-DD without pulling in a date lib.
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Whole-day difference between two YYYY-MM-DD keys (toKey - fromKey).
export function daysBetween(fromKey, toKey) {
  const [fy, fm, fd] = fromKey.split('-').map(Number);
  const [ty, tm, td] = toKey.split('-').map(Number);
  const a = Date.UTC(fy, fm - 1, fd);
  const b = Date.UTC(ty, tm - 1, td);
  return Math.round((b - a) / 86400000);
}
