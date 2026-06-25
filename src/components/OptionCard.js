import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radius, font, space } from '../theme';
import Glyph from './Glyph';

export default function OptionCard({ label, sublabel, emoji, selected, onPress }) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const press = () => {
    Haptics.selectionAsync();
    onPress && onPress();
  };

  return (
    <Animated.View style={aStyle}>
      <Pressable
        onPress={press}
        onPressIn={() => (scale.value = withSpring(0.98, { damping: 20 }))}
        onPressOut={() => (scale.value = withSpring(1, { damping: 14 }))}
        style={[styles.card, selected && styles.cardSelected]}
      >
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <View style={styles.textWrap}>
          <Text style={[styles.label, selected && { color: colors.text }]}>{label}</Text>
          {sublabel ? <Text style={styles.sub}>{sublabel}</Text> : null}
        </View>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected ? <Glyph name="check" size={16} color={'#1A1304'} /> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: space(4),
    paddingHorizontal: space(4),
    marginBottom: space(3),
    borderWidth: 1.5,
    borderColor: colors.hairline,
  },
  cardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.surfaceHi,
  },
  emoji: { fontSize: 24, marginRight: space(3) },
  textWrap: { flex: 1 },
  label: { ...font.bodyStrong, color: colors.textDim },
  sub: { ...font.caption, color: colors.textMute, marginTop: 2 },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.textFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: colors.gold, borderColor: colors.gold },
});
