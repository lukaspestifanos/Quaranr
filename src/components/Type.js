import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, font, radius, space } from '../theme';

export function Eyebrow({ children, color = colors.gold, style }) {
  return <Text style={[styles.eyebrow, { color }, style]}>{String(children).toUpperCase()}</Text>;
}

export function H1({ children, style, center }) {
  return <Text style={[styles.h1, center && { textAlign: 'center' }, style]}>{children}</Text>;
}

export function Lead({ children, style, center }) {
  return <Text style={[styles.lead, center && { textAlign: 'center' }, style]}>{children}</Text>;
}

export function Pill({ children, tint = colors.gold }) {
  return (
    <View style={[styles.pill, { borderColor: tint }]}>
      <Text style={[styles.pillText, { color: tint }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: { ...font.micro, marginBottom: space(3) },
  h1: { ...font.h1, color: colors.text, marginBottom: space(3) },
  lead: { ...font.body, color: colors.textDim },
  pill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: space(3),
    paddingVertical: space(1.5),
  },
  pillText: { ...font.micro },
});
