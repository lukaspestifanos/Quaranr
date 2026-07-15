import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from 'expo-audio';
import { colors, gradients, radius, font, space, shadow } from '../theme';
import { getRecitation } from '../audio/recitations';
import Glyph from './Glyph';

// Real recitation player. Streams the chosen reciter's surah over HTTPS via
// expo-audio; the animated waveform + progress are driven by actual playback
// position. onComplete fires when the track finishes.
const BARS = 34;
const HEIGHTS = Array.from({ length: BARS }, (_, i) =>
  0.35 + Math.abs(Math.sin(i * 0.7) * 0.55) + (i % 3 === 0 ? 0.12 : 0)
);

// Play through the iOS silent switch AND keep playing when the app is
// backgrounded / the screen locks — this is a sleep app, recitation must
// continue after the phone is set down. shouldPlayInBackground pairs with the
// UIBackgroundModes "audio" entitlement in app.json. Set once.
let audioModeSet = false;
function ensureAudioMode() {
  if (audioModeSet) return;
  audioModeSet = true;
  setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
  }).catch(() => {});
}

export default function WaveformPlayer({
  reciter = 'alafasy',
  surah = 'mulk',
  title,
  subtitle,
  arabic,
  durationSec = 24,
  onComplete,
  autoplay = false,
}) {
  const track = useMemo(() => getRecitation(reciter, surah), [reciter, surah]);

  const player = useAudioPlayer(track.uri, { updateInterval: 80 });
  const status = useAudioPlayerStatus(player);

  const playing = !!status?.playing;
  const elapsed = status?.currentTime || 0;
  const total = status?.duration && status.duration > 0 ? status.duration : durationSec;
  const loading = !!status && !status.isLoaded;

  useEffect(() => {
    ensureAudioMode();
  }, []);

  // Autoplay once the track is ready.
  const startedRef = useRef(false);
  useEffect(() => {
    if (autoplay && status?.isLoaded && !startedRef.current) {
      startedRef.current = true;
      player.play();
    }
  }, [autoplay, status?.isLoaded]);

  // Fire onComplete exactly once per finish.
  useEffect(() => {
    if (status?.didJustFinish) onComplete && onComplete();
  }, [status?.didJustFinish]);

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (playing) {
      player.pause();
    } else {
      // Restart if we're at/near the end.
      if (status?.didJustFinish || elapsed >= total - 0.25) {
        player.seekTo(0).finally(() => player.play());
      } else {
        player.play();
      }
    }
  };

  const pct = total > 0 ? Math.min(1, elapsed / total) : 0;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <View style={styles.card}>
      <LinearGradient colors={gradients.dawn} style={StyleSheet.absoluteFill} />
      <Text style={styles.arabic}>{arabic || track.arabic}</Text>
      <Text style={styles.translit}>“{track.gloss}”</Text>

      <View style={styles.wave}>
        {HEIGHTS.map((h, i) => (
          <Bar key={i} index={i} baseH={h} active={i / BARS <= pct} playing={playing} />
        ))}
      </View>

      <View style={styles.row}>
        <Text style={styles.time}>{fmt(elapsed)}</Text>
        <Text style={styles.time}>{fmt(total)}</Text>
      </View>

      <View style={styles.controls}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {title || track.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle || track.subtitle}
          </Text>
        </View>
        <Pressable onPress={toggle} style={styles.playBtn} hitSlop={8}>
          <LinearGradient colors={gradients.gold} style={StyleSheet.absoluteFill} />
          {loading ? (
            <ActivityIndicator size="small" color={'#1A1304'} />
          ) : (
            <Glyph name={playing ? 'pause' : 'play'} size={26} color={'#1A1304'} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

function Bar({ index, baseH, active, playing }) {
  const v = useSharedValue(0);
  useEffect(() => {
    if (playing) {
      v.value = withDelay(
        index * 18,
        withRepeat(
          withTiming(1, { duration: 420 + (index % 5) * 70, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        )
      );
    } else {
      v.value = withTiming(0, { duration: 200 });
    }
  }, [playing]);

  const style = useAnimatedStyle(() => {
    const peak = baseH * (playing ? interpolate(v.value, [0, 1], [0.55, 1]) : 0.7);
    return { height: `${Math.max(10, peak * 100)}%` };
  });

  return (
    <Animated.View
      style={[
        styles.bar,
        style,
        { backgroundColor: active ? colors.gold : 'rgba(255,255,255,0.16)' },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: space(5),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadow.card,
  },
  arabic: { ...font.arabic, color: colors.text, textAlign: 'center', writingDirection: 'rtl' },
  translit: {
    ...font.caption,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: space(2),
    marginBottom: space(4),
    fontStyle: 'italic',
  },
  wave: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    marginBottom: space(2),
  },
  bar: { width: 4, borderRadius: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space(4) },
  time: { ...font.micro, color: colors.textMute },
  controls: { flexDirection: 'row', alignItems: 'center' },
  title: { ...font.title, color: colors.text },
  subtitle: { ...font.caption, color: colors.textDim, marginTop: 1 },
  playBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadow.glow,
  },
});
