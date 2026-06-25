import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import Glyph from '../components/Glyph';
import { Eyebrow } from '../components/Type';
import { colors, font, space, radius, shadow } from '../theme';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function Streak({ progress, onNext, onBack }) {
  return (
    <Screen
      progress={progress}
      onBack={onBack}
      scroll={false}
      footer={<PrimaryButton label="Keep my streak alive" variant="emerald" onPress={() => onNext()} />}
    >
      <View style={styles.center}>
        <Animated.View entering={ZoomIn.delay(150).springify().damping(12)} style={styles.flameWrap}>
          <LinearGradient colors={['#FF8A3D', '#E6C27A']} style={styles.flameBg}>
            <Glyph name="flame" size={56} color={'#3A1B00'} />
          </LinearGradient>
          <Animated.Text entering={FadeIn.delay(450)} style={styles.day}>
            1
          </Animated.Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350)} style={{ alignItems: 'center' }}>
          <Eyebrow color={colors.emerald}>Day 1 · Streak started</Eyebrow>
          <Text style={styles.title}>Your streak begins today.</Text>
          <Text style={styles.body}>
            Show up tomorrow and it becomes 2. Miss a day and it resets to 0. This one number will
            change everything.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(550)} style={styles.week}>
          {DAYS.map((d, i) => (
            <View key={i} style={styles.dayCol}>
              <View style={[styles.dot, i === 0 && styles.dotOn]}>
                {i === 0 ? <Glyph name="flame" size={16} color={'#3A1B00'} /> : null}
              </View>
              <Text style={styles.dayLabel}>{d}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  flameWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: space(7) },
  flameBg: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glow,
  },
  day: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: colors.bgElevated,
    color: colors.gold,
    ...font.label,
    paddingHorizontal: space(3),
    paddingVertical: space(1),
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  title: { ...font.h1, color: colors.text, textAlign: 'center', marginTop: space(2), marginBottom: space(3) },
  body: { ...font.body, color: colors.textDim, textAlign: 'center', maxWidth: 330 },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: space(8),
    paddingHorizontal: space(2),
  },
  dayCol: { alignItems: 'center', gap: space(2) },
  dot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  dayLabel: { ...font.micro, color: colors.textMute },
});
