import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import WaveformPlayer from '../components/WaveformPlayer';
import { Eyebrow, H1, Lead } from '../components/Type';
import { useApp } from '../state/AppContext';
import { space } from '../theme';

// The "first usage" hype moment — plays the reciter + surah the user picked
// during onboarding, for real.
export default function FirstUse({ step, progress, onNext, onBack }) {
  const { answers } = useApp();
  const reciter = answers?.reciter || 'alafasy';
  const surah = answers?.firstSurah || 'mulk';

  return (
    <Screen
      progress={progress}
      onBack={onBack}
      footer={<PrimaryButton label={step?.cta || 'That felt good'} onPress={() => onNext()} />}
    >
      <Eyebrow>Your first session</Eyebrow>
      <H1>Press play.{'\n'}Begin tonight.</H1>
      <Lead>Your reciter, your surah — exactly how every night can start.</Lead>
      <Animated.View entering={FadeInDown.delay(200)} style={{ marginTop: space(5) }}>
        <WaveformPlayer reciter={reciter} surah={surah} autoplay />
      </Animated.View>
    </Screen>
  );
}
