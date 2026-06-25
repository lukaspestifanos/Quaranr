// The 36-step onboarding funnel, as DATA. Each step renders through a
// templated renderer keyed by `type`, so the whole high-converting experience
// is editable in one place. Order encodes the psychology:
//   hook → streak → demo → personalize → outcome → proof → commit →
//   permission → more proof → plan → hard paywall.

export const REVIEWS = {
  set1: [
    {
      name: 'Amina K.',
      handle: '@amina',
      text: 'I’ve tried to be consistent for years. The streak alone got me to Fajr 12 days straight. SubhanAllah.',
    },
    {
      name: 'Yusuf R.',
      handle: 'App Store',
      text: 'Falling asleep to Surah Al-Mulk changed my nights. This is the app I didn’t know I needed.',
    },
    {
      name: 'Layla M.',
      handle: '@laylam',
      text: 'It feels like it actually knows me. The reminders land right when I’m about to get distracted.',
    },
  ],
  set2: [
    {
      name: 'Bilal A.',
      handle: 'App Store',
      text: '4 months in, never missed a day. The plan it built for me was genuinely tailored.',
    },
    {
      name: 'Sara H.',
      handle: '@sarah',
      text: 'My kids now ask to do the night recitation with me. Worth every penny.',
    },
    {
      name: 'Omar T.',
      handle: '@omart',
      text: 'Calm but for the soul. I cancelled three other apps after a week of this.',
    },
  ],
  set3: [
    {
      name: 'Fatima Z.',
      handle: 'App Store',
      text: 'The commitment screen made me take it seriously. 60-day streak and counting.',
    },
    {
      name: 'Hamza I.',
      handle: '@hamza',
      text: 'Best $2.49 I spend each month, hands down. It paid for itself in peace.',
    },
  ],
};

export const STEPS = [
  // 1 — the hook. It talks to you.
  {
    id: 'hook',
    type: 'talk',
    eyebrow: 'Welcome to Quaranr',
    title: 'Do you have 1 minute\nfor God?',
    body: 'Just one. That’s how the journey back begins.',
    cta: 'Yes, I do',
    gradient: 'dawn',
  },
  // 2 — reframe
  {
    id: 'reframe',
    type: 'talk',
    title: 'The average person scrolls\nfor 2 hours a day.',
    body: 'We’ll start with one minute for your Lord — and build from there.',
    cta: 'I’m ready',
  },
  // 3 — streak immediately
  { id: 'streak', type: 'streak' },
  // 4 — demo / see the product
  { id: 'demo', type: 'demo' },
  // 5 — goal (multi)
  {
    id: 'goal',
    type: 'question',
    eyebrow: 'Personalize',
    title: 'What do you want from Quaranr?',
    body: 'Choose all that speak to you.',
    select: 'multi',
    options: [
      { value: 'consistency', label: 'Pray 5 times a day, consistently', emoji: '🕌' },
      { value: 'sleep', label: 'Fall asleep to Quran', emoji: '🌙' },
      { value: 'memorize', label: 'Memorize more surahs', emoji: '📖' },
      { value: 'calm', label: 'Reduce anxiety with dhikr', emoji: '🤍' },
      { value: 'closer', label: 'Feel closer to Allah', emoji: '✨' },
    ],
  },
  // 6 — affirmation, talks to you
  {
    id: 'affirm-goal',
    type: 'talk',
    title: 'You’re not alone in this.',
    body: 'Over 1.2 million people started exactly where you are right now.',
    cta: 'Continue',
  },
  // 7 — relationship
  {
    id: 'relationship',
    type: 'question',
    eyebrow: 'About you',
    title: 'How is your relationship\nwith prayer right now?',
    select: 'single',
    options: [
      { value: 'struggling', label: 'I struggle to pray at all', emoji: '🥀' },
      { value: 'inconsistent', label: 'On and off — I want consistency', emoji: '🌗' },
      { value: 'steady', label: 'Mostly steady, want to go deeper', emoji: '🌱' },
      { value: 'devoted', label: 'Devoted — I want to perfect it', emoji: '🌟' },
    ],
  },
  // 8 — how many of 5
  {
    id: 'prayers',
    type: 'question',
    title: 'How many of the 5 daily\nprayers do you keep?',
    select: 'single',
    options: [
      { value: '0', label: 'Rarely any', emoji: '0️⃣' },
      { value: '1-2', label: '1–2 a day', emoji: '✌️' },
      { value: '3-4', label: '3–4 a day', emoji: '🙏' },
      { value: '5', label: 'All five, masha’Allah', emoji: '🤲' },
    ],
  },
  // 9 — struggle (multi)
  {
    id: 'struggle',
    type: 'question',
    title: 'What gets in the way most?',
    body: 'We’ll design around it.',
    select: 'multi',
    options: [
      { value: 'forget', label: 'I forget / lose track of time', emoji: '⏰' },
      { value: 'motivation', label: 'I lack motivation', emoji: '🪫' },
      { value: 'distracted', label: 'Phone & distractions', emoji: '📱' },
      { value: 'tired', label: 'Too tired, especially Fajr', emoji: '😴' },
      { value: 'knowledge', label: 'I’m unsure how / what to recite', emoji: '❓' },
    ],
  },
  // 10 — reassurance
  {
    id: 'affirm-struggle',
    type: 'talk',
    title: 'Every one of those\nhas a fix.',
    body: 'And we’ve built each one into your plan. Keep going.',
    cta: 'Continue',
  },
  // 11 — for whom
  {
    id: 'audience',
    type: 'question',
    title: 'Who are you building\nthis practice for?',
    select: 'single',
    options: [
      { value: 'me', label: 'Just me', emoji: '🧎' },
      { value: 'family', label: 'Me and my family', emoji: '👨‍👩‍👧' },
      { value: 'kids', label: 'Helping my kids learn', emoji: '🧒' },
      { value: 'revert', label: 'I’m new to Islam', emoji: '🌅' },
    ],
  },
  // 12 — age (the "weight/activity" deep-personalization beat)
  {
    id: 'age',
    type: 'question',
    title: 'How old are you?',
    body: 'We tune pace and reminders to your stage of life.',
    select: 'single',
    options: [
      { value: '13-17', label: '13–17' },
      { value: '18-24', label: '18–24' },
      { value: '25-34', label: '25–34' },
      { value: '35-49', label: '35–49' },
      { value: '50+', label: '50+' },
    ],
  },
  // 13 — Quran experience
  {
    id: 'experience',
    type: 'question',
    title: 'How much Quran do\nyou already know?',
    select: 'single',
    options: [
      { value: 'none', label: 'I’m just beginning', emoji: '🌱' },
      { value: 'short', label: 'A few short surahs', emoji: '📗' },
      { value: 'juz', label: 'A juz or more', emoji: '📘' },
      { value: 'hafiz', label: 'Large portions / hafiz', emoji: '📚' },
    ],
  },
  // 14 — reciter
  {
    id: 'reciter',
    type: 'question',
    title: 'Which voice calms you most?',
    body: 'You can change this anytime.',
    select: 'single',
    options: [
      { value: 'alafasy', label: 'Mishary Rashid Alafasy', emoji: '🎙️' },
      { value: 'sudais', label: 'Abdul Rahman Al-Sudais', emoji: '🕋' },
      { value: 'minshawi', label: 'Mohamed Siddiq Al-Minshawi', emoji: '📿' },
      { value: 'surprise', label: 'Surprise me each night', emoji: '🎲' },
    ],
  },
  // 15 — wind-down time (sleep)
  {
    id: 'winddown',
    type: 'question',
    title: 'When do you want\nto wind down?',
    body: 'We’ll cue your night recitation then.',
    select: 'single',
    options: [
      { value: 'early', label: 'Before 10 PM', emoji: '🌆' },
      { value: 'mid', label: '10 PM – Midnight', emoji: '🌃' },
      { value: 'late', label: 'After Midnight', emoji: '🌌' },
      { value: 'varies', label: 'It varies a lot', emoji: '🔄' },
    ],
  },
  // 16 — first surah
  {
    id: 'firstSurah',
    type: 'question',
    title: 'Pick a surah to begin with',
    select: 'single',
    options: [
      { value: 'mulk', label: 'Al-Mulk — for protection at night', emoji: '🌙' },
      { value: 'rahman', label: 'Ar-Rahman — for gratitude', emoji: '🤍' },
      { value: 'yaseen', label: 'Ya-Seen — the heart of the Quran', emoji: '💚' },
      { value: 'kahf', label: 'Al-Kahf — for Fridays', emoji: '🕊️' },
    ],
  },
  // 17 — outcome ring
  {
    id: 'outcome-ring',
    type: 'outcome',
    variant: 'ring',
    title: 'In 30 days, you could pray\n93% of your salah on time.',
    body: 'Based on people with your answers who stay 7 days.',
  },
  // 18 — outcome graph
  {
    id: 'outcome-graph',
    type: 'outcome',
    variant: 'graph',
    title: 'Consistency compounds.',
    body: 'Most users go from scattered to steady within their first two weeks.',
  },
  // 19 — reviews #1
  { id: 'reviews1', type: 'reviews', set: 'set1', title: 'You’re in good company' },
  // 20 — how did you hear
  {
    id: 'howheard',
    type: 'howheard',
    title: 'How did you hear about us?',
    options: [
      { value: 'tiktok', label: 'TikTok', emoji: '🎵' },
      { value: 'instagram', label: 'Instagram', emoji: '📸' },
      { value: 'friend', label: 'Friend or family', emoji: '🫶' },
      { value: 'masjid', label: 'My masjid / imam', emoji: '🕌' },
      { value: 'appstore', label: 'App Store search', emoji: '🔎' },
      { value: 'youtube', label: 'YouTube', emoji: '▶️' },
    ],
  },
  // 21 — referral code
  { id: 'referral', type: 'referral' },
  // 22 — which prayers to remind
  {
    id: 'reminderTimes',
    type: 'question',
    eyebrow: 'Your reminders',
    title: 'Which prayers should\nwe nudge you for?',
    select: 'multi',
    options: [
      { value: 'fajr', label: 'Fajr', emoji: '🌅' },
      { value: 'duhr', label: 'Dhuhr', emoji: '☀️' },
      { value: 'asr', label: 'Asr', emoji: '🌤️' },
      { value: 'maghrib', label: 'Maghrib', emoji: '🌇' },
      { value: 'isha', label: 'Isha', emoji: '🌙' },
    ],
  },
  // 23 — affirmation
  {
    id: 'affirm-build',
    type: 'talk',
    title: 'We’ll build this\naround your life.',
    body: 'Not a generic plan. Yours.',
    cta: 'Build my plan',
  },
  // 24 — loading
  { id: 'loading', type: 'loading' },
  // 25 — plan reveal
  { id: 'planreveal', type: 'planreveal' },
  // 26 — first usage hype moment
  { id: 'firstuse', type: 'firstuse' },
  // 27 — how did that feel (micro)
  {
    id: 'feel',
    type: 'question',
    title: 'How did that feel?',
    select: 'single',
    options: [
      { value: 'peaceful', label: 'Peaceful', emoji: '🤍' },
      { value: 'emotional', label: 'Emotional', emoji: '🥹' },
      { value: 'focused', label: 'Focused', emoji: '🎯' },
      { value: 'more', label: 'I want more', emoji: '🔥' },
    ],
  },
  // 28 — rate us mid-flow
  { id: 'rate', type: 'rate' },
  // 29 — reviews #2
  { id: 'reviews2', type: 'reviews', set: 'set2', title: 'Loved by 1.2M+ Muslims' },
  // 30 — signature commitment
  { id: 'signature', type: 'signature' },
  // 31 — notification permission
  { id: 'notification', type: 'notification' },
  // 32 — one last thing
  {
    id: 'almost',
    type: 'talk',
    eyebrow: 'Almost there',
    title: 'One last thing\nbefore we begin.',
    body: 'See what’s waiting for you.',
    cta: 'Continue',
  },
  // 33 — reviews #3 right before paywall
  { id: 'reviews3', type: 'reviews', set: 'set3', title: 'Don’t just take our word for it' },
  // 34 — personalized recap
  { id: 'recap', type: 'outcome', variant: 'recap', title: 'Your plan is personalized' },
  // 35 — trial explainer
  { id: 'trial', type: 'outcome', variant: 'trial', title: 'How your free trial works' },
  // 36 — final hype → paywall
  {
    id: 'ready',
    type: 'talk',
    eyebrow: 'You’re ready',
    title: 'Your journey back\nstarts now.',
    body: 'Unlock your full personalized plan and begin tonight.',
    cta: 'See my plan',
    gradient: 'dawn',
    final: true,
  },
];

export const TOTAL_STEPS = STEPS.length;
