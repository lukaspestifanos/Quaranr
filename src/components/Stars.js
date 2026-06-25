import React from 'react';
import { View } from 'react-native';
import Glyph from './Glyph';
import { colors } from '../theme';

export default function Stars({ count = 5, size = 16, color = colors.star, gap = 2 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={{ marginRight: i < 4 ? gap : 0 }}>
          <Glyph name="star" size={size} color={color} filled={i < count} />
        </View>
      ))}
    </View>
  );
}
