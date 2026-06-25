import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Animated SVG ring used on outcome / plan-reveal screens.
export default function ProgressRing({
  size = 180,
  stroke = 14,
  progress = 0.75,
  children,
  duration = 1200,
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withTiming(progress, { duration, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const animProps = useAnimatedProps(() => ({
    strokeDashoffset: c * (1 - p.value),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <SvgGrad id="ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.gold} />
            <Stop offset="1" stopColor={colors.emerald} />
          </SvgGrad>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={'rgba(255,255,255,0.08)'}
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          animatedProps={animProps}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {children}
    </View>
  );
}
