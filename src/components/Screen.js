import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProgressBar from './ProgressBar';
import { colors, gradients, font, space } from '../theme';

// Animated, full-bleed screen shell used by every onboarding step.
// Entering animation = the "animation between every screen".
export default function Screen({
  children,
  footer,
  scroll = true,
  gradient = 'night',
  progress = null,
  onBack = null,
  topRight = null,
  contentStyle,
  edges = { top: true, bottom: true },
}) {
  const insets = useSafeAreaInsets();
  const Body = scroll ? ScrollView : View;
  const bodyProps = scroll
    ? {
        contentContainerStyle: [styles.scrollContent, contentStyle],
        showsVerticalScrollIndicator: false,
        bounces: false,
      }
    : { style: [styles.staticBody, contentStyle] };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients[gradient] || gradients.night}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />
      <View style={{ height: edges.top ? insets.top : 0 }} />

      {(progress !== null || onBack || topRight) && (
        <View style={styles.topBar}>
          {onBack ? (
            <Pressable hitSlop={12} onPress={onBack} style={styles.back}>
              <Text style={styles.backTxt}>‹</Text>
            </Pressable>
          ) : (
            <View style={styles.back} />
          )}
          {progress !== null ? (
            <ProgressBar progress={progress} />
          ) : (
            <View style={{ flex: 1 }} />
          )}
          <View style={styles.topRight}>{topRight}</View>
        </View>
      )}

      <Animated.View
        style={styles.flex}
        entering={FadeInDown.springify().damping(18).mass(0.7)}
        exiting={FadeOut.duration(160)}
      >
        <Body {...bodyProps}>{children}</Body>
      </Animated.View>

      {footer ? (
        <Animated.View
          entering={FadeIn.delay(120).duration(300)}
          style={[styles.footer, { paddingBottom: (edges.bottom ? insets.bottom : 0) + space(4) }]}
        >
          {footer}
        </Animated.View>
      ) : (
        <View style={{ height: edges.bottom ? insets.bottom : 0 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space(5),
    paddingVertical: space(3),
    gap: space(3),
  },
  back: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  backTxt: { color: colors.textDim, fontSize: 34, marginTop: -6, fontWeight: '300' },
  topRight: { minWidth: 30, alignItems: 'flex-end' },
  scrollContent: {
    paddingHorizontal: space(6),
    paddingTop: space(4),
    paddingBottom: space(6),
    flexGrow: 1,
  },
  staticBody: {
    flex: 1,
    paddingHorizontal: space(6),
    paddingTop: space(4),
  },
  footer: {
    paddingHorizontal: space(6),
    paddingTop: space(3),
  },
});
