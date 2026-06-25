import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import ProgressRing from '../components/ProgressRing';
import AnimatedNumber from '../components/AnimatedNumber';
import Glyph from '../components/Glyph';
import { Eyebrow, H1, Lead } from '../components/Type';
import { useApp } from '../state/AppContext';
import { colors, font, space, radius } from '../theme';

export default function Outcome({ step, progress, onNext, onBack }) {
  const Inner = {
    ring: RingOutcome,
    graph: GraphOutcome,
    recap: RecapOutcome,
    trial: TrialOutcome,
  }[step.variant] || RingOutcome;

  const cta = step.variant === 'trial' ? 'Continue' : step.variant === 'recap' ? 'This is me' : 'Continue';

  return (
    <Screen
      progress={progress}
      onBack={onBack}
      footer={<PrimaryButton label={cta} onPress={() => onNext()} />}
    >
      <Inner step={step} />
    </Screen>
  );
}

function RingOutcome({ step }) {
  return (
    <View style={styles.centerBlock}>
      <Eyebrow color={colors.emerald}>Your projection</Eyebrow>
      <H1 center>{step.title}</H1>
      <View style={{ marginVertical: space(6) }}>
        <ProgressRing size={210} stroke={16} progress={0.93}>
          <AnimatedNumber value={93} suffix="%" duration={1400} style={styles.ringNum} />
          <Text style={styles.ringLabel}>on-time salah</Text>
        </ProgressRing>
      </View>
      <Lead center style={{ maxWidth: 320 }}>
        {step.body}
      </Lead>
    </View>
  );
}

const BARS = [0.2, 0.3, 0.28, 0.45, 0.5, 0.68, 0.74, 0.86, 0.94];
function GraphOutcome({ step }) {
  return (
    <View style={{ flex: 1 }}>
      <Eyebrow color={colors.emerald}>30-day outlook</Eyebrow>
      <H1>{step.title}</H1>
      <Lead style={{ marginBottom: space(8) }}>{step.body}</Lead>
      <View style={styles.chart}>
        {BARS.map((h, i) => (
          <Bar key={i} h={h} i={i} last={i === BARS.length - 1} />
        ))}
      </View>
      <View style={styles.axis}>
        <Text style={styles.axisLabel}>Today</Text>
        <Text style={styles.axisLabel}>Day 30</Text>
      </View>
    </View>
  );
}

function Bar({ h, i, last }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(i * 90, withTiming(h, { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, []);
  const style = useAnimatedStyle(() => ({ height: `${v.value * 100}%` }));
  return (
    <View style={styles.barTrack}>
      <Animated.View
        style={[styles.bar, style, { backgroundColor: last ? colors.gold : 'rgba(63,185,138,0.55)' }]}
      />
    </View>
  );
}

const SURAH_NAME = {
  mulk: 'Al-Mulk',
  rahman: 'Ar-Rahman',
  yaseen: 'Ya-Seen',
  kahf: 'Al-Kahf',
};
const RECITER_NAME = {
  alafasy: 'Mishary Alafasy',
  sudais: 'Al-Sudais',
  minshawi: 'Al-Minshawi',
  surprise: 'A new voice nightly',
};
function RecapOutcome() {
  const { answers } = useApp();
  const surah = SURAH_NAME[answers.firstSurah] || 'Al-Mulk';
  const reciter = RECITER_NAME[answers.reciter] || 'Mishary Alafasy';
  const reminders = (answers.reminderTimes || ['fajr', 'maghrib', 'isha']).length;
  const rows = [
    { icon: 'book', label: 'Starting surah', value: surah },
    { icon: 'moon', label: 'Night recitation', value: reciter },
    { icon: 'bell', label: 'Daily prayer reminders', value: `${reminders} set` },
    { icon: 'flame', label: 'Goal', value: 'Build a 30-day streak' },
  ];
  return (
    <View>
      <Eyebrow>Built from your answers</Eyebrow>
      <H1>Your plan is personalized.</H1>
      <Lead style={{ marginBottom: space(6) }}>Everything below was shaped by what you told us.</Lead>
      {rows.map((r, i) => (
        <Animated.View key={r.label} entering={FadeInDown.delay(120 + i * 90)} style={styles.recapRow}>
          <View style={styles.recapIcon}>
            <Glyph name={r.icon} size={20} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.recapLabel}>{r.label}</Text>
            <Text style={styles.recapValue}>{r.value}</Text>
          </View>
          <Glyph name="check" size={18} color={colors.emerald} />
        </Animated.View>
      ))}
    </View>
  );
}

function TrialOutcome({ step }) {
  const items = [
    { day: 'Today', title: 'Full access unlocks', body: 'Your whole plan, free. Cancel anytime.', icon: 'lock', tint: colors.gold },
    { day: 'Day 2', title: 'We’ll remind you', body: 'A heads-up before your trial ends.', icon: 'bell', tint: colors.emerald },
    { day: 'Day 3', title: 'Your subscription begins', body: 'Only if you love it. Else, $0.', icon: 'star', tint: colors.gold },
  ];
  return (
    <View>
      <Eyebrow>No surprises</Eyebrow>
      <H1>{step.title}</H1>
      <View style={{ marginTop: space(6) }}>
        {items.map((it, i) => (
          <Animated.View key={it.day} entering={FadeInDown.delay(120 + i * 120)} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: it.tint }]}>
                <Glyph name={it.icon} size={16} color={'#1A1304'} />
              </View>
              {i < items.length - 1 ? <View style={styles.timelineLine} /> : null}
            </View>
            <View style={styles.timelineCard}>
              <Text style={styles.timelineDay}>{it.day}</Text>
              <Text style={styles.timelineTitle}>{it.title}</Text>
              <Text style={styles.timelineBody}>{it.body}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerBlock: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  ringNum: { ...font.display, fontSize: 46, color: colors.text },
  ringLabel: { ...font.caption, color: colors.textDim, marginTop: 2 },

  chart: {
    height: 220,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space(2),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.lg,
    padding: space(4),
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  barTrack: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 6, minHeight: 6 },
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space(3) },
  axisLabel: { ...font.micro, color: colors.textMute },

  recapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space(4),
    marginBottom: space(3),
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  recapIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(230,194,122,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recapLabel: { ...font.caption, color: colors.textMute },
  recapValue: { ...font.bodyStrong, color: colors.text, marginTop: 1 },

  timelineRow: { flexDirection: 'row', gap: space(4) },
  timelineLeft: { alignItems: 'center', width: 34 },
  timelineDot: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  timelineLine: { width: 2, flex: 1, backgroundColor: colors.hairline, marginVertical: space(1) },
  timelineCard: { flex: 1, paddingBottom: space(6) },
  timelineDay: { ...font.micro, color: colors.gold },
  timelineTitle: { ...font.title, color: colors.text, marginTop: 2 },
  timelineBody: { ...font.caption, color: colors.textDim, marginTop: 2 },
});
