import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius } from '../theme';

export default function ProgressBar({ progress = 0 }) {
  const w = useSharedValue(progress);
  useEffect(() => {
    w.value = withTiming(progress, { duration: 450, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const style = useAnimatedStyle(() => ({
    width: `${Math.max(4, Math.min(100, w.value * 100))}%`,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, style]}>
        <LinearGradient
          colors={gradients.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
    flex: 1,
  },
  fill: { height: '100%', borderRadius: radius.pill, overflow: 'hidden' },
});
