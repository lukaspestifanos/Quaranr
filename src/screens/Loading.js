import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Screen from '../components/Screen';
import ProgressRing from '../components/ProgressRing';
import AnimatedNumber from '../components/AnimatedNumber';
import Glyph from '../components/Glyph';
import { useApp } from '../state/AppContext';
import { colors, font, space } from '../theme';

const TASKS = [
  'Analyzing your answers',
  'Matching your reciter',
  'Timing reminders to your day',
  'Selecting your starting surah',
  'Building your 30-day plan',
];

export default function Loading({ onNext }) {
  const { name } = useApp();
  const [done, setDone] = useState(0);

  useEffect(() => {
    const timers = TASKS.map((_, i) =>
      setTimeout(() => setDone(i + 1), 650 * (i + 1))
    );
    const finish = setTimeout(() => onNext(), 650 * TASKS.length + 700);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, []);

  return (
    <Screen scroll={false} gradient="dawn">
      <View style={styles.center}>
        <ProgressRing size={150} stroke={12} progress={1} duration={3600}>
          <AnimatedNumber value={100} suffix="%" duration={3600} style={styles.pct} />
        </ProgressRing>
        <Text style={styles.title}>Building your prayer plan…</Text>
        <Text style={styles.sub}>Tailored to everything you told us</Text>

        <View style={styles.tasks}>
          {TASKS.map((t, i) => {
            const isDone = i < done;
            const isActive = i === done;
            return (
              <Animated.View key={t} entering={FadeIn.delay(i * 120)} style={styles.taskRow}>
                <View style={[styles.taskDot, isDone && styles.taskDotDone]}>
                  {isDone ? (
                    <Glyph name="check" size={14} color={'#1A1304'} />
                  ) : isActive ? (
                    <ActivityIndicator size="small" color={colors.gold} />
                  ) : null}
                </View>
                <Text style={[styles.taskText, isDone && { color: colors.text }]}>{t}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  pct: { ...font.h1, color: colors.text },
  title: { ...font.h2, color: colors.text, marginTop: space(7), textAlign: 'center' },
  sub: { ...font.caption, color: colors.textDim, marginTop: space(2) },
  tasks: { marginTop: space(8), alignSelf: 'stretch', gap: space(3.5), paddingHorizontal: space(2) },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: space(3) },
  taskDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskDotDone: { backgroundColor: colors.gold, borderColor: colors.gold },
  taskText: { ...font.body, color: colors.textMute },
});
