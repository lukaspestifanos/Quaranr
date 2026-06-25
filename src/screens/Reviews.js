import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import ReviewCard from '../components/ReviewCard';
import Stars from '../components/Stars';
import { H1 } from '../components/Type';
import { REVIEWS } from '../onboarding/steps';
import { colors, font, space } from '../theme';

export default function Reviews({ step, progress, onNext, onBack }) {
  const list = REVIEWS[step.set] || REVIEWS.set1;
  return (
    <Screen
      progress={progress}
      onBack={onBack}
      footer={<PrimaryButton label="Continue" onPress={() => onNext()} />}
    >
      <View style={styles.head}>
        <Stars count={5} size={20} />
        <Text style={styles.rating}>4.9 · 64,200 ratings</Text>
      </View>
      <H1>{step.title}</H1>
      <View style={{ marginTop: space(2) }}>
        {list.map((r, i) => (
          <Animated.View key={r.name} entering={FadeInDown.delay(120 + i * 110)}>
            <ReviewCard name={r.name} handle={r.handle} text={r.text} tint={i} />
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', marginBottom: space(4), gap: space(2) },
  rating: { ...font.caption, color: colors.textDim },
});
