import { Platform } from 'react-native';
import { USE_REAL_BILLING, REVENUECAT, PRODUCTS } from './config';

// Thin, swappable billing layer. The app only ever talks to these four
// functions, so swapping the mock for RevenueCat is a one-file change.

let realSDK = null; // lazy-loaded react-native-purchases, only when enabled
let configurePromise = null; // single-flight guard so we configure exactly once

async function getRealSDK() {
  if (realSDK) return realSDK;
  // Lazy require so the bundle still builds in Expo Go (mock mode).
  const Purchases = require('react-native-purchases').default;
  const { LOG_LEVEL } = require('react-native-purchases');
  if (!configurePromise) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    configurePromise = Purchases.configure({
      apiKey:
        Platform.OS === 'ios' ? REVENUECAT.iosApiKey : REVENUECAT.androidApiKey,
    });
  }
  await configurePromise;
  realSDK = Purchases;
  return realSDK;
}

// Configure RevenueCat as early as possible (call once at app startup). Safe to
// call repeatedly — it's a no-op after the first invocation. In mock mode it
// resolves immediately so the same call site works in Expo Go.
export async function initBilling() {
  if (!USE_REAL_BILLING) return;
  try {
    await getRealSDK();
  } catch (e) {
    // Non-fatal: the app still renders; entitlement simply stays locked.
  }
}

// Reads the current entitlement straight from RevenueCat (or the cache).
// Returns { entitled: boolean }. Never throws — call it on launch to hydrate.
export async function getEntitlement() {
  if (USE_REAL_BILLING) {
    try {
      const sdk = await getRealSDK();
      const info = await sdk.getCustomerInfo();
      return {
        entitled: !!info.entitlements.active[REVENUECAT.entitlementId],
      };
    } catch (e) {
      return { entitled: false };
    }
  }
  return { entitled: false };
}

export async function getOfferings() {
  if (USE_REAL_BILLING) {
    try {
      const sdk = await getRealSDK();
      const offerings = await sdk.getOfferings();
      const current = offerings.current;
      // Map RevenueCat packages back to our display shape.
      const find = (id) =>
        current?.availablePackages?.find((p) => p.product.identifier === id);
      const a = find(PRODUCTS.annual.id);
      const m = find(PRODUCTS.monthly.id);
      return {
        annual: a
          ? { ...PRODUCTS.annual, priceString: a.product.priceString, _pkg: a }
          : PRODUCTS.annual,
        monthly: m
          ? { ...PRODUCTS.monthly, priceString: m.product.priceString, _pkg: m }
          : PRODUCTS.monthly,
      };
    } catch (e) {
      // fall through to mock display data if the network/store hiccups
    }
  }
  return { annual: PRODUCTS.annual, monthly: PRODUCTS.monthly };
}

// Returns { entitled: boolean }. Throws on a real, user-facing failure.
export async function purchase(plan) {
  if (USE_REAL_BILLING) {
    const sdk = await getRealSDK();
    const offerings = await getOfferings();
    const pkg = offerings[plan]?._pkg;
    if (!pkg) throw new Error('Product unavailable. Please try again.');
    const { customerInfo } = await sdk.purchasePackage(pkg);
    return {
      entitled: !!customerInfo.entitlements.active[REVENUECAT.entitlementId],
    };
  }
  // Mock: simulate the App Store sheet + trial start.
  await delay(1100);
  if (mockCancel) {
    mockCancel = false;
    const err = new Error('Purchase cancelled');
    err.userCancelled = true;
    throw err;
  }
  return { entitled: true };
}

// Presents the RevenueCat-hosted paywall UI (configured in the dashboard) and
// resolves to { entitled, presented }. Falls back to the mock purchase flow in
// Expo Go so the funnel is still exercisable without native code.
export async function presentPaywall() {
  if (USE_REAL_BILLING) {
    await getRealSDK(); // ensure configured before the UI reads offerings
    const RevenueCatUI = require('react-native-purchases-ui').default;
    const { PAYWALL_RESULT } = require('react-native-purchases-ui');
    const result = await RevenueCatUI.presentPaywall();
    switch (result) {
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return { entitled: true, presented: true };
      case PAYWALL_RESULT.NOT_PRESENTED:
        return { entitled: false, presented: false };
      case PAYWALL_RESULT.CANCELLED:
      case PAYWALL_RESULT.ERROR:
      default:
        return { entitled: false, presented: true };
    }
  }
  // Mock: reuse the simulated store sheet so a cancel still propagates.
  try {
    const { entitled } = await purchase('annual');
    return { entitled, presented: true };
  } catch (e) {
    if (e.userCancelled) return { entitled: false, presented: true };
    throw e;
  }
}

export async function restore() {
  if (USE_REAL_BILLING) {
    const sdk = await getRealSDK();
    const info = await sdk.restorePurchases();
    return { entitled: !!info.entitlements.active[REVENUECAT.entitlementId] };
  }
  await delay(700);
  return { entitled: false };
}

// --- mock test helpers -----------------------------------------------------
let mockCancel = false;
export function __mockNextPurchaseCancel() {
  mockCancel = true;
}
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
