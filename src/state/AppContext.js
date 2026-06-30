import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { loadState, saveState, defaultState, todayKey, daysBetween, resetState } from './store';
import {
  initBilling,
  getEntitlement,
  getOfferings as getOfferingsFlow,
  purchase as purchaseFlow,
  presentPaywall as presentPaywallFlow,
  restore as restorePurchasesFlow,
} from '../monetization/purchases';
import { setupNotificationHandler, scheduleReminders } from '../notifications/reminders';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let alive = true;
    setupNotificationHandler();
    loadState().then((s) => {
      if (!alive) return;
      setState(s);
      setReady(true);
      // Re-arm the persistent reminders on every launch so they never lapse.
      if (s.notificationsAsked) {
        scheduleReminders({ winddown: s.answers?.winddown }).catch(() => {});
      }
    });
    // Configure RevenueCat early and reconcile the persisted `entitled` flag
    // with the source of truth (the store) so a re-install or refund is honored.
    initBilling()
      .then(() => getEntitlement())
      .then(({ entitled }) => {
        if (alive && entitled) update({ entitled: true });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Merge + persist. Accepts an object or an updater function.
  const update = (patch) => {
    setState((prev) => {
      const next =
        typeof patch === 'function'
          ? { ...prev, ...patch(prev) }
          : { ...prev, ...patch };
      saveState(next);
      return next;
    });
  };

  // Set a single onboarding answer.
  const setAnswer = (id, value) =>
    update((prev) => ({ answers: { ...prev.answers, [id]: value } }));

  // Called when the user completes a session in the app.
  const completeSession = (minutes = 1) => {
    update((prev) => {
      const today = todayKey();
      // Already practiced today → count the minutes, streak unchanged.
      if (prev.lastSessionDay === today) {
        return {
          minutesTotal: prev.minutesTotal + minutes,
          sessionsDone: prev.sessionsDone + 1,
        };
      }
      // Consecutive day (yesterday) extends the streak; any longer gap — or the
      // very first session — (re)starts it at 1.
      const gap = prev.lastSessionDay ? daysBetween(prev.lastSessionDay, today) : null;
      const streak = gap === 1 ? (prev.streak || 0) + 1 : 1;
      return {
        streak,
        lastSessionDay: today,
        minutesTotal: prev.minutesTotal + minutes,
        sessionsDone: prev.sessionsDone + 1,
      };
    });
  };

  const finishOnboarding = () => update({ onboarded: true });
  const setEntitled = (v) => update({ entitled: v });

  // Present the RevenueCat paywall and persist the unlock. Returns the flow
  // result so callers can react (e.g. advance onboarding) without re-reading state.
  const presentPaywall = async () => {
    const result = await presentPaywallFlow();
    if (result.entitled) update({ entitled: true });
    return result;
  };

  // Buy a plan directly (used by our custom hard paywall). Calls RevenueCat's
  // purchasePackage under the hood and persists the unlock on success.
  const buy = async (plan) => {
    const result = await purchaseFlow(plan);
    if (result.entitled) update({ entitled: true });
    return result;
  };

  // Fetch live, localized offerings for the paywall (price strings, trials).
  // Always resolves — falls back to bundled display data on any failure.
  const loadOfferings = () => getOfferingsFlow();

  // "Restore Purchases" — required by App Store review. Persists on success.
  const restorePurchases = async () => {
    const result = await restorePurchasesFlow();
    if (result.entitled) update({ entitled: true });
    return result;
  };

  // Set what the hub player is cued to (reciter + surah ids). Stamped with the
  // day so a manual pick only overrides tonight's scheduled recitation today.
  const setNowPlaying = (reciter, surah) =>
    update({ nowPlaying: { reciter, surah, day: todayKey() } });

  const reset = async () => {
    await resetState();
    setState({ ...defaultState });
  };

  const value = useMemo(
    () => ({
      ...state,
      ready,
      update,
      setAnswer,
      completeSession,
      finishOnboarding,
      setEntitled,
      setNowPlaying,
      buy,
      loadOfferings,
      presentPaywall,
      restorePurchases,
      reset,
    }),
    [state, ready]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
