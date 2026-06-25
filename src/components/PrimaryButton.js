import React from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, font, shadow, space } from '../theme';

export default function PrimaryButton({
  label,
  sublabel,
  onPress,
  loading = false,
  disabled = false,
  variant = 'gold', // gold | emerald | ghost
  pulse = false,
}) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  React.useEffect(() => {
    if (pulse) {
      glow.value = withRepeat(
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [pulse]);

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { scale: pulse ? 1 + glow.value * 0.02 : 1 }],
  }));

  const press = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress && onPress();
  };

  const isGhost = variant === 'ghost';
  const grad = variant === 'emerald' ? gradients.emerald : gradients.gold;

  return (
    <Animated.View style={[aStyle, !isGhost && shadow.glow, disabled && { opacity: 0.45 }]}>
      <Pressable
        onPress={press}
        onPressIn={() => (scale.value = withSpring(0.97, { damping: 18 }))}
        onPressOut={() => (scale.value = withSpring(1, { damping: 14 }))}
        style={styles.press}
      >
        {isGhost ? (
          <View style={[styles.body, styles.ghost]}>
            <Label label={label} sublabel={sublabel} loading={loading} color={colors.text} />
          </View>
        ) : (
          <LinearGradient
            colors={grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.body}
          >
            <Label label={label} sublabel={sublabel} loading={loading} color={'#1A1304'} />
          </LinearGradient>
        )}
      </Pressable>
    </Animated.View>
  );
}

function Label({ label, sublabel, loading, color }) {
  if (loading) return <ActivityIndicator color={color} />;
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[styles.label, { color }]}>{label}</Text>
      {sublabel ? <Text style={[styles.sub, { color }]}>{sublabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  press: { borderRadius: radius.pill },
  body: {
    minHeight: 58,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space(6),
    paddingVertical: space(3),
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  label: { ...font.title, fontWeight: '700' },
  sub: { ...font.caption, opacity: 0.7, marginTop: 1 },
});
