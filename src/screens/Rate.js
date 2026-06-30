import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import Stars from '../components/Stars';
import Glyph from '../components/Glyph';
import { Eyebrow, H1, Lead } from '../components/Type';
import { useApp } from '../state/AppContext';
import { colors, font, space, radius } from '../theme';

const REVIEWS = [
  {
    name: 'Yusuf K.',
    text: 'I finally pray on time. The nightly surah became the calmest part of my day.',
  },
  {
    name: 'Amina R.',
    text: 'Gentle, never guilt-trippy. My streak is at 41 days and growing.',
  },
];

export default function Rate({ progress, onNext, onBack }) {
  const { update } = useApp();
  const [rated, setRated] = useState(false);

  const commit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    update({ ratedUs: true });
    onNext();
  };

  const onRate = () => {
    if (rated) return;
    Haptics.selectionAsync();
    setRated(true);
  };

  return (
    <Screen
      progress={progress}
      onBack={onBack}
      footer={
        <PrimaryButton
          label={rated ? 'Continue' : 'Rate Sakina'}
          variant="gold"
          onPress={commit}
        />
      }
    >
      <View style={styles.head}>
        <Eyebrow>Help us grow</Eyebrow>
        <H1 center>Enjoying Sakina?</H1>
        <Lead center style={{ maxWidth: 320 }}>
          A quick rating helps more Muslims find their way back to a steady, calm prayer habit.
        </Lead>
      </View>

      <Animated.View entering={ZoomIn.delay(250).springify().damping(12)} style={styles.starsWrap}>
        <Pressable onPress={onRate} hitSlop={12} style={styles.starsTap}>
          <Stars count={5} size={42} gap={6} color={colors.gold} />
        </Pressable>
        {rated ? (
          <Animated.Text entering={FadeInDown} style={styles.thanks}>
            Thank you — it means the world.
          </Animated.Text>
        ) : (
          <Text style={styles.tapHint}>Tap the stars to rate</Text>
        )}
      </Animated.View>

      <View style={styles.reviews}>
        {REVIEWS.map((r, i) => (
          <Animated.View key={r.name} entering={FadeInDown.delay(400 + i * 120)} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Stars count={5} size={13} gap={2} color={colors.gold} />
              <Text style={styles.reviewName}>{r.name}</Text>
            </View>
            <Text style={styles.reviewText}>{r.text}</Text>
          </Animated.View>
        ))}
      </View>

      <View style={styles.trust}>
        <Glyph name="heart" size={16} color={colors.rose} filled />
        <Text style={styles.trustText}>Loved by thousands of believers</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', marginTop: space(2), marginBottom: space(6) },
  starsWrap: { alignItems: 'center', marginBottom: space(8) },
  starsTap: { paddingVertical: space(2) },
  tapHint: { ...font.caption, color: colors.textMute, marginTop: space(3) },
  thanks: { ...font.bodyStrong, color: colors.emerald, marginTop: space(3) },
  reviews: { gap: space(3) },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space(4),
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: space(3), marginBottom: space(2) },
  reviewName: { ...font.caption, color: colors.textMute },
  reviewText: { ...font.body, color: colors.textDim },
  trust: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space(2), marginTop: space(6) },
  trustText: { ...font.caption, color: colors.textMute },
});
