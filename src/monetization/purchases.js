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

// True when this CustomerInfo grants access. Checks the configured entitlement
// first, then falls back to ANY active entitlement and finally to an active
// subscription on one of our products — so a dashboard gap (entitlement not
// attached to a product, or renamed) can never lock out a paying customer.
// Apple rejected build 15 under 2.1(b) because the strict check returned false
// after a completed purchase and the paywall silently stayed up.
function hasAccess(info) {
  if (!info) return false;
  const active = info.entitlements?.active || {};
  if (active[REVENUECAT.entitlementId]) return true;
  if (Object.keys(active).length > 0) return true; // single-tier app: any entitlement unlocks
  const ourIds = Object.values(PRODUCTS).map((p) => p.id);
  // iOS ids come back bare; Android as "productId:basePlanId" — compare the prefix.
  return (info.activeSubscriptions || []).some((s) =>
    ourIds.includes(String(s).split(':')[0])
  );
}

// Reads the current entitlement straight from RevenueCat (or the cache).
// Returns { entitled: boolean }. Never throws — call it on launch to hydrate.
export async function getEntitlement() {
  if (USE_REAL_BILLING) {
    try {
      const sdk = await getRealSDK();
      const info = await sdk.getCustomerInfo();
      return { entitled: hasAccess(info) };
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
// On misconfiguration it throws a SPECIFIC, on-device-visible message so the
// exact RevenueCat gap (no current offering / product missing) is obvious.
export async function purchase(plan) {
  if (USE_REAL_BILLING) {
    const sdk = await getRealSDK();

    let offerings;
    try {
      offerings = await sdk.getOfferings();
    } catch (e) {
      throw new Error('Could not load offerings from RevenueCat: ' + (e?.message || e));
    }

    const current = offerings.current;
    if (!current) {
      const all = Object.keys(offerings.all || {});
      throw new Error(
        'No "current" offering in RevenueCat. ' +
          (all.length ? `Found offerings: ${all.join(', ')}. ` : 'No offerings exist. ') +
          'Go to RevenueCat → Offerings and mark one as Current.'
      );
    }

    const wantId = PRODUCTS[plan].id;
    const pkg = current.availablePackages?.find((p) => p.product.identifier === wantId);
    if (!pkg) {
      const have = (current.availablePackages || []).map((p) => p.product.identifier);
      throw new Error(
        `Product "${wantId}" not found in offering "${current.identifier}". ` +
          `Packages present: ${have.length ? have.join(', ') : 'none'}. ` +
          'Add it as a Package and ensure StoreKit returns it (product Ready to Submit + .p8 key uploaded).'
      );
    }

    // purchasePackage throws on cancel/failure. If it RESOLVES, Apple has
    // charged (or started the trial for) the customer — so the answer is
    // unconditionally "entitled". Never gate a completed payment on the
    // RevenueCat entitlement flag: a dashboard misconfiguration would strand
    // a paying user on the paywall (App Review rejection 2.1(b), build 15).
    const { customerInfo } = await sdk.purchasePackage(pkg);
    if (!hasAccess(customerInfo)) {
      // Purchase went through but RevenueCat shows no entitlement — log it
      // loudly so it shows in debug logs, but still unlock the app.
      console.warn(
        `[billing] Purchase of ${wantId} succeeded but entitlement ` +
          `"${REVENUECAT.entitlementId}" is not active. Check that the ` +
          'entitlement is attached to this product in RevenueCat.'
      );
    }
    return { entitled: true };
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
    return { entitled: hasAccess(info) };
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
