import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import WaveformPlayer from '../components/WaveformPlayer';
import { Eyebrow, H1 } from '../components/Type';
import { colors, font, space } from '../theme';

export default function Demo({ progress, onNext, onBack }) {
  return (
    <Screen
      progress={progress}
      onBack={onBack}
      footer={<PrimaryButton label="I want this" onPress={() => onNext()} />}
    >
      <Eyebrow>A 20-second taste</Eyebrow>
      <H1>This is what your nights{'\n'}could sound like.</H1>
      <Animated.View entering={FadeInDown.delay(200)} style={{ marginTop: space(3) }}>
        <WaveformPlayer durationSec={20} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(360)} style={styles.row}>
        <Bullet text="Drift to sleep with Quran, not your feed" />
        <Bullet text="Wake to a gentle Fajr call, on your time" />
        <Bullet text="A plan that bends around your day" />
      </Animated.View>
    </Screen>
  );
}

function Bullet({ text }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.dot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: space(6), gap: space(3) },
  bullet: { flexDirection: 'row', alignItems: 'center', gap: space(3) },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gold },
  bulletText: { ...font.body, color: colors.textDim, flex: 1 },
});
