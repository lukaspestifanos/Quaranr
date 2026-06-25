import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../components/Screen';
import WaveformPlayer from '../../components/WaveformPlayer';
import AnimatedNumber from '../../components/AnimatedNumber';
import Glyph from '../../components/Glyph';
import { useApp } from '../../state/AppContext';
import { todayKey } from '../../state/store';
import { getTonightSurahId } from '../../audio/recitations';
import { colors, font, space, radius, shadow } from '../../theme';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Peaceful night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const app = useApp();
  // Tonight's scheduled recitation, unless the user manually picked one today.
  const tonight = getTonightSurahId(app.answers?.firstSurah, new Date());
  const override = app.nowPlaying && app.nowPlaying.day === todayKey() ? app.nowPlaying : null;
  const reciter = override?.reciter || app.answers?.reciter || 'alafasy';
  const surah = override?.surah || tonight;

  const onComplete = () => {
    app.completeSession(1);
    app.update({ lastCompletedSurah: surah });
  };

  return (
    <Screen
      gradient="night"
      edges={{ top: true, bottom: false }}
      contentStyle={{ paddingBottom: space(28) }}
    >
      <Animated.View entering={FadeIn} style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>{greeting()}{app.name ? `, ${app.name}` : ''}</Text>
          <Text style={styles.sub}>Your one minute for God starts here.</Text>
        </View>
        <LinearGradient colors={['#FF8A3D', '#E6C27A']} style={styles.streakPill}>
          <Glyph name="flame" size={16} color={'#3A1B00'} />
          <Text style={styles.streakNum}>{app.streak}</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120)} style={{ marginTop: space(5) }}>
        <Text style={styles.section}>Tonight’s recitation</Text>
        <WaveformPlayer reciter={reciter} surah={surah} onComplete={onComplete} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(240)} style={styles.stats}>
        <Stat value={app.streak} label="Day streak" icon="flame" />
        <Stat value={app.sessionsDone} label="Sessions" icon="check" />
        <Stat value={app.minutesTotal} label="Minutes" icon="moon" />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(340)} style={styles.verse}>
        <Glyph name="sparkle" size={18} color={colors.gold} />
        <Text style={styles.verseText}>
          “So remember Me; I will remember you.” — Al-Baqarah 2:152
        </Text>
      </Animated.View>
    </Screen>
  );
}

function Stat({ value, label, icon }) {
  return (
    <View style={styles.statCard}>
      <Glyph name={icon} size={18} color={colors.gold} />
      <AnimatedNumber value={value} duration={900} style={styles.statNum} />
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: space(2) },
  hello: { ...font.h2, color: colors.text },
  sub: { ...font.caption, color: colors.textDim, marginTop: space(1) },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(1),
    paddingHorizontal: space(3),
    paddingVertical: space(2),
    borderRadius: radius.pill,
    ...shadow.glow,
  },
  streakNum: { ...font.bodyStrong, color: '#3A1B00' },
  section: { ...font.label, color: colors.textDim, marginBottom: space(3) },
  stats: { flexDirection: 'row', gap: space(3), marginTop: space(6) },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingVertical: space(4),
    alignItems: 'center',
    gap: space(1),
  },
  statNum: { ...font.h2, color: colors.text },
  statLabel: { ...font.micro, color: colors.textMute },
  verse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    marginTop: space(7),
    padding: space(4),
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  verseText: { ...font.caption, color: colors.textDim, flex: 1, fontStyle: 'italic' },
});
