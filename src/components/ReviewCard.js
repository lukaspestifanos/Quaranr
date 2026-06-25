import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, font, space } from '../theme';
import Stars from './Stars';

const AVATAR_TINTS = ['#3FB98A', '#E6C27A', '#E8927C', '#7C9CE8', '#C58CE8'];

export default function ReviewCard({ name, handle, text, tint = 0 }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={[styles.avatar, { backgroundColor: AVATAR_TINTS[tint % AVATAR_TINTS.length] }]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          {handle ? <Text style={styles.handle}>{handle}</Text> : null}
        </View>
        <Stars count={5} size={13} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space(4),
    marginBottom: space(3),
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: space(2.5) },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space(3),
  },
  initials: { color: '#0B1020', fontWeight: '800', fontSize: 14 },
  name: { ...font.label, color: colors.text },
  handle: { ...font.caption, color: colors.textMute },
  text: { ...font.body, color: colors.textDim },
});
