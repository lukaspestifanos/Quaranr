// Quaranr design system — premium, calm, "clean not cute". No mascot.
// Midnight navy canvas, warm gold accent, emerald for "growth/streak".

export const colors = {
  // canvas
  bg: '#0B1020',
  bgElevated: '#121A30',
  surface: '#16203A',
  surfaceHi: '#1C2845',
  hairline: 'rgba(255,255,255,0.08)',

  // text
  text: '#F4F1E8',
  textDim: '#A9B0C2',
  textFaint: '#586079',
  textMute: '#727B92',

  // accents
  gold: '#E6C27A',
  goldDeep: '#C99B47',
  emerald: '#3FB98A',
  emeraldDeep: '#2A8466',
  rose: '#E8927C',

  // utility
  white: '#FFFFFF',
  black: '#000000',
  success: '#3FB98A',
  star: '#F5C451',
  overlay: 'rgba(7,10,20,0.72)',
};

export const gradients = {
  night: ['#0B1020', '#101A35', '#0B1020'],
  dawn: ['#1A2444', '#243059', '#2A2150'],
  gold: ['#E6C27A', '#C99B47'],
  emerald: ['#3FB98A', '#2A8466'],
  plan: ['#243059', '#3A2F63', '#5A2F66'],
  halo: ['rgba(230,194,122,0.0)', 'rgba(230,194,122,0.18)'],
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const space = (n) => n * 4;

export const font = {
  // System fonts give a clean premium baseline without bundling assets.
  display: { fontSize: 32, lineHeight: 38, fontWeight: '700', letterSpacing: -0.5 },
  h1: { fontSize: 27, lineHeight: 33, fontWeight: '700', letterSpacing: -0.4 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.3 },
  title: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  label: { fontSize: 14, lineHeight: 19, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '600', letterSpacing: 0.6 },
  arabic: { fontSize: 30, lineHeight: 46, fontWeight: '500' },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  glow: {
    shadowColor: '#E6C27A',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
};
