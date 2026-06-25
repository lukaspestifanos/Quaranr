// Gesture handler must be imported before anything else.
import 'react-native-gesture-handler';
import React, { useCallback, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppProvider, useApp } from './src/state/AppContext';
import { STEPS, TOTAL_STEPS } from './src/onboarding/steps';
import Screen from './src/components/Screen';
import PrimaryButton from './src/components/PrimaryButton';
import { Eyebrow, H1, Lead } from './src/components/Type';
import { colors, space } from './src/theme';

// Funnel step renderers. `type` in steps.js selects the screen. Types whose
// screens aren't built yet fall through to <Placeholder/>, so the whole funnel
// stays walkable and each real screen drops in by adding it to this map.
import Talk from './src/screens/Talk';
import Streak from './src/screens/Streak';
import Demo from './src/screens/Demo';
import Question from './src/screens/Question';
import Outcome from './src/screens/Outcome';
import Reviews from './src/screens/Reviews';
import Referral from './src/screens/Referral';
import Loading from './src/screens/Loading';
import FirstUse from './src/screens/FirstUse';
import PlanReveal from './src/screens/PlanReveal';
import Rate from './src/screens/Rate';
import Signature from './src/screens/Signature';
import Notification from './src/screens/Notification';
import Hub from './src/app/Hub';

const SCREENS = {
  talk: Talk,
  streak: Streak,
  demo: Demo,
  question: Question,
  howheard: Question, // single-select list — Question handles it
  outcome: Outcome,
  reviews: Reviews,
  referral: Referral,
  loading: Loading,
  firstuse: FirstUse,
  planreveal: PlanReveal,
  rate: Rate,
  signature: Signature,
  notification: Notification,
};

// On-brand copy for step types that don't have a bespoke screen yet, so the
// funnel reads as finished rather than stubbed. Real screens supersede these
// by being added to SCREENS above.
const FALLBACK_COPY = {
  planreveal: {
    eyebrow: 'Your plan',
    title: 'Your 30-day plan is ready.',
    body: 'A surah a night, reminders timed to your day, and a streak to keep you honest.',
    cta: 'See it in action',
  },
  rate: {
    eyebrow: 'One small favor',
    title: 'Enjoying Quaranr so far?',
    body: 'A rating helps more Muslims find their way back. It takes a moment.',
    cta: 'Rate Quaranr',
  },
  signature: {
    eyebrow: 'Your commitment',
    title: 'Make it real.',
    body: 'A quiet promise to yourself: show up for one minute, every day.',
    cta: 'I commit',
  },
  notification: {
    eyebrow: 'Stay on track',
    title: 'Gentle nudges, right on time.',
    body: 'We’ll remind you for the prayers you chose — never spammy, always kind.',
    cta: 'Enable reminders',
  },
};

// Stand-in for step types still being built (planreveal, firstuse, rate,
// signature, notification). Keeps the flow moving without crashing.
function Placeholder({ step, progress, onNext, onBack }) {
  const copy = { ...(FALLBACK_COPY[step?.type] || {}), ...step };
  return (
    <Screen
      progress={progress}
      onBack={onBack}
      footer={<PrimaryButton label={copy.cta || 'Continue'} onPress={() => onNext()} />}
    >
      {copy.eyebrow ? <Eyebrow>{copy.eyebrow}</Eyebrow> : null}
      <H1 center>{copy.title || 'Continue your journey'}</H1>
      {copy.body ? <Lead center>{copy.body}</Lead> : null}
    </Screen>
  );
}

function Onboarding() {
  const app = useApp();
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const progress = (i + 1) / TOTAL_STEPS;

  const advance = useCallback(() => {
    setI((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, []);

  const onNext = useCallback(
    async (value) => {
      // Persist any answer this step produced (questions / pickers).
      if (value !== undefined && step?.id) app.setAnswer(step.id, value);

      // Final step → present the paywall, then enter the app.
      if (step?.final) {
        try {
          await app.presentPaywall();
        } catch (e) {
          // user cancelled / store error — still let them in (trial flow)
        }
        app.finishOnboarding();
        return;
      }

      if (i + 1 >= TOTAL_STEPS) {
        app.finishOnboarding();
        return;
      }
      advance();
    },
    [app, step, i, advance]
  );

  const onBack = useCallback(() => setI((prev) => Math.max(0, prev - 1)), []);

  const Comp = SCREENS[step.type] || Placeholder;
  return (
    <Comp
      step={step}
      progress={progress}
      onNext={onNext}
      onBack={onBack}
      initial={app.answers?.[step.id]}
    />
  );
}

function Gate() {
  const { ready, onboarded } = useApp();
  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }
  return onboarded ? <Hub /> : <Onboarding />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="light" />
          <Gate />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
