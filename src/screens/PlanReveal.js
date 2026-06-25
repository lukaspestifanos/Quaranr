import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import ProgressRing from '../components/ProgressRing';
import Glyph from '../components/Glyph';
import { Eyebrow, H1, Lead } from '../components/Type';
import { useApp } from '../state/AppContext';
import { colors, font, space, radius } from '../theme';

const RECITER_NAME = {
  alafasy: 'Mishary Alafasy',
  sudais: 'Abdul Rahman Al-Sudais',
  minshawi: 'Al-Minshawi',
};
const SURAH_NAME = {
  mulk: 'Al-Mulk',
  rahman: 'Ar-Rahman',
  yaseen: 'Ya-Seen',
  kahf: 'Al-Kahf',
};
const PRAYER_NAME = {
  fajr: 'Fajr',
  duhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export default function PlanReveal({ step, progress, onNext, onBack }) {
  const { name, answers } = useApp();

  const surah = SURAH_NAME[answers.firstSurah] || 'Al-Mulk';
  const reciter = RECITER_NAME[answers.reciter] || 'Surprise me';
  const prayers = (answers.reminderTimes && answers.reminderTimes.length
    ? answers.reminderTimes
    : ['fajr', 'isha']
  )
    .map((p) => PRAYER_NAME[p] || p)
    .join(', ');

  const rows = [
    { icon: 'book', label: 'Nightly surah', value: surah },
    { icon: 'moon', label: 'Reciter', value: reciter },
    { icon: 'bell', label: 'Reminders', value: prayers },
    { icon: 'star', label: 'Plan length', value: '30 nights' },
  ];

  return (
    <Screen
      progress={progress}
      onBack={onBack}
      gradient="plan"
      footer={<PrimaryButton label={step?.cta || 'See it in action'} onPress={() => onNext()} />}
    >
      <View style={styles.hero}>
        <Animated.View entering={ZoomIn.delay(150).springify().damping(12)}>
          <ProgressRing size={172} stroke={14} progress={0.93} duration={1400}>
            <Glyph name="sparkle" size={40} color={colors.gold} filled />
            <Text style={styles.heroNum}>30</Text>
            <Text style={styles.heroLabel}>nights</Text>
          </ProgressRing>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.head}>
        <Eyebrow color={colors.emerald}>Personalized for you</Eyebrow>
        <H1>Your plan is ready{name ? `, ${name}` : ''}.</H1>
        <Lead>Built from your answers — a quiet, repeatable habit you can keep.</Lead>
      </Animated.View>

      <View style={styles.list}>
        {rows.map((r, i) => (
          <Animated.View key={r.label} entering={FadeInDown.delay(420 + i * 90)} style={styles.row}>
            <View style={styles.rowIcon}>
              <Glyph name={r.icon} size={20} color={colors.gold} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{r.label}</Text>
              <Text style={styles.rowValue}>{r.value}</Text>
            </View>
            <Glyph name="check" size={18} color={colors.emerald} />
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: space(2), marginBottom: space(6) },
  heroNum: { ...font.display, fontSize: 38, color: colors.text, marginTop: space(1) },
  heroLabel: { ...font.caption, color: colors.textDim, marginTop: -2 },
  head: { marginBottom: space(6) },
  list: { gap: space(3) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space(4),
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(230,194,122,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowLabel: { ...font.caption, color: colors.textMute },
  rowValue: { ...font.bodyStrong, color: colors.text, marginTop: 1 },
});
