import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { Eyebrow } from '../components/Type';
import Glyph from '../components/Glyph';
import { colors, font, space } from '../theme';

export default function Talk({ step, progress, onNext, onBack }) {
  return (
    <Screen
      gradient={step.gradient || 'night'}
      progress={progress}
      onBack={onBack}
      scroll={false}
      footer={<PrimaryButton label={step.cta || 'Continue'} onPress={() => onNext()} pulse={step.final} />}
    >
      <View style={styles.center}>
        <Animated.View entering={FadeIn.delay(120).duration(500)} style={styles.glyph}>
          <Glyph name={step.final ? 'sparkle' : 'moon'} size={40} color={colors.gold} />
        </Animated.View>
        {step.eyebrow ? (
          <Animated.View entering={FadeInDown.delay(180)}>
            <Eyebrow>{step.eyebrow}</Eyebrow>
          </Animated.View>
        ) : null}
        <Animated.Text entering={FadeInDown.delay(260).springify().damping(18)} style={styles.title}>
          {step.title}
        </Animated.Text>
        {step.body ? (
          <Animated.Text entering={FadeInDown.delay(420)} style={styles.body}>
            {step.body}
          </Animated.Text>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: space(12) },
  glyph: { marginBottom: space(6) },
  title: { ...font.display, color: colors.text, textAlign: 'center', marginBottom: space(4) },
  body: { ...font.body, color: colors.textDim, textAlign: 'center', maxWidth: 320 },
});
