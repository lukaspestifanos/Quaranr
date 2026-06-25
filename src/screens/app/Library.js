import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Screen from '../../components/Screen';
import Glyph from '../../components/Glyph';
import { useApp } from '../../state/AppContext';
import { RECITERS, SURAHS } from '../../audio/recitations';
import { colors, font, space, radius } from '../../theme';

export default function Library({ onPlay }) {
  const app = useApp();
  const reciter = app.nowPlaying?.reciter || app.answers?.reciter || 'alafasy';
  const surah = app.nowPlaying?.surah || app.answers?.firstSurah || 'mulk';

  const cue = (nextReciter, nextSurah, play) => {
    Haptics.selectionAsync();
    app.setNowPlaying(nextReciter, nextSurah);
    if (play && onPlay) onPlay();
  };

  return (
    <Screen
      gradient="night"
      edges={{ top: true, bottom: false }}
      contentStyle={{ paddingBottom: space(28) }}
    >
      <Text style={styles.h1}>Listen</Text>
      <Text style={styles.sub}>Choose a surah for tonight.</Text>

      <Text style={styles.section}>Reciter</Text>
      <View style={styles.reciterRow}>
        {Object.entries(RECITERS).map(([id, r]) => {
          const on = id === reciter;
          return (
            <Pressable key={id} onPress={() => cue(id, surah, false)} style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && styles.chipTextOn]} numberOfLines={1}>
                {r.name.split(' ')[0]} {r.name.split(' ').slice(-1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>Surahs</Text>
      {Object.entries(SURAHS).map(([id, s], i) => {
        const on = id === surah;
        return (
          <Animated.View key={id} entering={FadeInDown.delay(80 * i)}>
            <Pressable onPress={() => cue(reciter, id, true)} style={[styles.card, on && styles.cardOn]}>
              <View style={[styles.badge, on && styles.badgeOn]}>
                <Glyph name={on ? 'play' : 'book'} size={20} color={on ? '#1A1304' : colors.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{s.title}</Text>
                <Text style={styles.cardSub} numberOfLines={1}>{s.gloss}</Text>
              </View>
              <Text style={styles.surahNo}>{String(s.n).padStart(2, '0')}</Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: { ...font.h1, color: colors.text, marginTop: space(2) },
  sub: { ...font.caption, color: colors.textDim, marginTop: space(1) },
  section: { ...font.label, color: colors.textDim, marginTop: space(6), marginBottom: space(3) },
  reciterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2) },
  chip: {
    paddingHorizontal: space(3),
    paddingVertical: space(2),
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { ...font.caption, color: colors.textDim },
  chipTextOn: { color: '#1A1304', fontWeight: '700' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    padding: space(4),
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    marginBottom: space(3),
  },
  cardOn: { borderColor: colors.gold, backgroundColor: colors.surfaceHi },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(230,194,122,0.12)',
  },
  badgeOn: { backgroundColor: colors.gold },
  cardTitle: { ...font.title, color: colors.text },
  cardSub: { ...font.caption, color: colors.textDim, marginTop: 1 },
  surahNo: { ...font.label, color: colors.textMute },
});
