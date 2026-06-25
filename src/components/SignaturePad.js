import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors, radius, font, space } from '../theme';

// Draw-to-commit signature. Returns the SVG path strings via onChange so the
// commitment can be persisted + replayed on the home screen.
export default function SignaturePad({ height = 190, onChange }) {
  const [paths, setPaths] = useState([]);
  const [current, setCurrent] = useState('');

  const addPoint = useCallback((x, y, isStart) => {
    setCurrent((c) => (isStart ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `${c} L ${x.toFixed(1)} ${y.toFixed(1)}`));
  }, []);

  const endStroke = useCallback(() => {
    setCurrent((c) => {
      if (c) {
        setPaths((p) => {
          const next = [...p, c];
          onChange && onChange(next);
          return next;
        });
      }
      return '';
    });
  }, [onChange]);

  const pan = Gesture.Pan()
    .onBegin((e) => {
      runOnJS(Haptics.selectionAsync)();
      runOnJS(addPoint)(e.x, e.y, true);
    })
    .onUpdate((e) => {
      runOnJS(addPoint)(e.x, e.y, false);
    })
    .onEnd(() => {
      runOnJS(endStroke)();
    })
    .minDistance(0);

  const clear = () => {
    setPaths([]);
    setCurrent('');
    onChange && onChange([]);
  };

  const hasInk = paths.length > 0 || current.length > 0;

  return (
    <View>
      <GestureDetector gesture={pan}>
        <View style={[styles.pad, { height }]}>
          <Svg width="100%" height="100%">
            {paths.map((d, i) => (
              <Path key={i} d={d} stroke={colors.gold} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ))}
            {current ? (
              <Path d={current} stroke={colors.gold} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
          </Svg>
          {!hasInk && (
            <View style={styles.placeholder} pointerEvents="none">
              <Text style={styles.placeholderText}>Sign here with your finger</Text>
            </View>
          )}
          <View style={styles.line} pointerEvents="none" />
          <Text style={styles.x} pointerEvents="none">✕</Text>
        </View>
      </GestureDetector>
      {hasInk && (
        <Pressable onPress={clear} hitSlop={8} style={styles.clear}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  placeholder: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { ...font.body, color: colors.textFaint },
  line: {
    position: 'absolute',
    left: space(6),
    right: space(6),
    bottom: space(8),
    height: 1,
    backgroundColor: colors.hairline,
  },
  x: { position: 'absolute', left: space(6), bottom: space(8) + 2, color: colors.textFaint, fontSize: 16 },
  clear: { alignSelf: 'flex-end', paddingVertical: space(2), paddingHorizontal: space(1) },
  clearText: { ...font.label, color: colors.textMute },
});
