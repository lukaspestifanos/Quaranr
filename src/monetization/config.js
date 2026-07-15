// Monetization config — the ONE place to flip from mock to real billing.
//
// EASIEST PATH TO REVENUE:
//   1. Create products in App Store Connect / Google Play:
//        sakina_annual  (annual, 3-day free trial)
//        sakina_monthly (monthly)
//   2. Create a RevenueCat project, add an entitlement "premium",
//      attach both products, and create an offering "default".
//   3. `npx expo install react-native-purchases`
//   4. Paste your public SDK keys below and set USE_REAL_BILLING = true.
//   5. Build a dev client (RevenueCat needs native code; it will NOT
//      run in Expo Go) — `npx expo run:ios` / `run:android`.
//
// Until then the app runs fully with a realistic in-memory mock so the
// entire funnel — including the trial start — is testable today.

import Constants, { ExecutionEnvironment } from 'expo-constants';

// RevenueCat needs native code and CANNOT run in Expo Go. Detect Expo Go and
// fall back to the in-memory mock there so the entire funnel — including the
// paywall — is previewable; real dev-client / production builds use billing.
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Master switch for real billing. ON: purchases go through RevenueCat →
// StoreKit. Apple rejected build 13 under 2.1(b) because this was false and
// the mock "granted membership without initiating the in-app purchase
// process" — never ship a store build with this off.
export const REAL_BILLING_ENABLED = true;
export const USE_REAL_BILLING = REAL_BILLING_ENABLED && !isExpoGo;

// Public (publishable) SDK keys are safe to ship in the client bundle.
// Sourced from EXPO_PUBLIC_REVENUECAT_KEY when set; falls back to the real Apple
// App Store PUBLIC SDK key so cloud builds that miss the env var still talk to
// real StoreKit (never the test store). Public SDK keys are safe to ship.
const RC_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_KEY || 'appl_OuBaLwIJumRrPzVkNzflskPOCYk';

export const REVENUECAT = {
  iosApiKey: RC_KEY,
  androidApiKey: RC_KEY,
  // Must match the entitlement identifier configured in the RevenueCat dashboard.
  entitlementId: 'Sakina Pro',
  offeringId: 'default',
};

// Display data — mirrors what the store would return. Single currency for clarity.
export const PRODUCTS = {
  annual: {
    // Must match the App Store Connect / Play product identifier EXACTLY, and be
    // attached to the RevenueCat "default" offering. Create the annual sub in
    // App Store Connect with this exact Product ID (note the "quranr" spelling).
    id: 'com.quranr.pro.annual',
    title: 'Yearly',
    priceString: '$29.99',
    price: 29.99,
    perMonthString: '$2.49',
    period: 'year',
    trialDays: 3,
    badge: 'BEST VALUE · 3-DAY FREE TRIAL',
  },
  monthly: {
    // Matches the subscription you created in App Store Connect.
    id: 'com.quranr.pro.monthly',
    title: 'Monthly',
    priceString: '$9.99',
    price: 9.99,
    perMonthString: '$9.99',
    period: 'month',
    trialDays: 0,
    badge: null,
  },
};
