import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../components/Screen';
import Glyph from '../../components/Glyph';
import * as Notifications from 'expo-notifications';
import { useApp } from '../../state/AppContext';
import { RECITERS, SURAHS } from '../../audio/recitations';
import { scheduleReminders } from '../../notifications/reminders';
import { colors, font, space, radius, shadow } from '../../theme';

export default function Profile() {
  const app = useApp();
  const [busy, setBusy] = useState(false);

  const reciterId = app.nowPlaying?.reciter || app.answers?.reciter || 'alafasy';
  const surahId = app.nowPlaying?.surah || app.answers?.firstSurah || 'mulk';
  const reciterName = RECITERS[reciterId]?.name || 'Surprise me';
  const surahName = SURAHS[surahId]?.title || 'Al-Mulk';

  const unlock = async () => {
    setBusy(true);
    try { await app.presentPaywall(); } finally { setBusy(false); }
  };
  const restore = async () => {
    setBusy(true);
    try {
      const r = await app.restorePurchases();
      Alert.alert(r?.entitled ? 'Restored' : 'Nothing to restore',
        r?.entitled ? 'Your premium access is active.' : 'No previous purchase was found.');
    } finally { setBusy(false); }
  };
  const enableReminders = async () => {
    setBusy(true);
    try {
      const { granted } = await Notifications.requestPermissionsAsync();
      app.update({ notificationsAsked: true });
      if (granted) {
        const n = await scheduleReminders({ winddown: app.answers?.winddown });
        Alert.alert('Reminders on', `You’ll get ${n} gentle nudges scheduled to keep your streak alive.`);
      } else {
        Alert.alert('Permission needed', 'Enable notifications for Quaranr in Settings to get reminders.');
      }
    } finally { setBusy(false); }
  };

  const confirmReset = () => {
    Alert.alert('Reset app?', 'This clears your streak, answers, and onboarding.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => app.reset() },
    ]);
  };

  return (
    <Screen
      gradient="night"
      edges={{ top: true, bottom: false }}
      contentStyle={{ paddingBottom: space(28) }}
    >
      <View style={styles.head}>
        <LinearGradient colors={['#243059', '#3A2F63']} style={styles.avatar}>
          <Text style={styles.avatarText}>{(app.name || 'You').slice(0, 1).toUpperCase()}</Text>
        </LinearGradient>
        <Text style={styles.name}>{app.name || 'Friend'}</Text>
        <Text style={styles.sub}>{app.entitled ? 'Quaranr Pro' : 'Free plan'}</Text>
      </View>

      <View style={styles.statsRow}>
        <Stat n={app.streak} label="Streak" />
        <Stat n={app.sessionsDone} label="Sessions" />
        <Stat n={app.minutesTotal} label="Minutes" />
      </View>

      {!app.entitled ? (
        <Pressable onPress={unlock} disabled={busy} style={styles.proCard}>
          <LinearGradient colors={['#E6C27A', '#C99B47']} style={StyleSheet.absoluteFill} />
          <Glyph name="sparkle" size={22} color={'#1A1304'} />
          <View style={{ flex: 1 }}>
            <Text style={styles.proTitle}>Unlock Quaranr Pro</Text>
            <Text style={styles.proSub}>Your full plan, every reciter, all surahs.</Text>
          </View>
          <Glyph name="lock" size={20} color={'#1A1304'} />
        </Pressable>
      ) : (
        <View style={[styles.proCard, styles.proActive]}>
          <Glyph name="check" size={22} color={colors.emerald} />
          <Text style={[styles.proTitle, { color: colors.text }]}>Pro is active — thank you 🤍</Text>
        </View>
      )}

      <Text style={styles.section}>Your setup</Text>
      <Row icon="moon" label="Reciter" value={reciterName} />
      <Row icon="book" label="Nightly surah" value={surahName} />
      <ActionRow
        icon="bell"
        label={app.notificationsAsked ? 'Reminders on · tap to refresh' : 'Turn on reminders'}
        onPress={enableReminders}
        disabled={busy}
      />

      <Text style={styles.section}>Account</Text>
      <ActionRow icon="heart" label="Restore purchases" onPress={restore} disabled={busy} />
      <ActionRow icon="lock" label="Reset app" onPress={confirmReset} danger />

      <Text style={styles.footer}>Quaranr · v1.0.0</Text>
    </Screen>
  );
}

function Stat({ n, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statL}>{label}</Text>
    </View>
  );
}
function Row({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <Glyph name={icon} size={18} color={colors.gold} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}
function ActionRow({ icon, label, onPress, danger, disabled }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.row}>
      <Glyph name={icon} size={18} color={danger ? colors.rose : colors.gold} />
      <Text style={[styles.rowLabel, danger && { color: colors.rose }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', marginTop: space(3) },
  avatar: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  avatarText: { ...font.h1, color: colors.text },
  name: { ...font.h2, color: colors.text, marginTop: space(3) },
  sub: { ...font.caption, color: colors.gold, marginTop: space(1) },
  statsRow: { flexDirection: 'row', gap: space(3), marginTop: space(6) },
  stat: {
    flex: 1, alignItems: 'center', paddingVertical: space(4),
    backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.hairline,
  },
  statN: { ...font.h2, color: colors.text },
  statL: { ...font.micro, color: colors.textMute, marginTop: space(1) },
  proCard: {
    flexDirection: 'row', alignItems: 'center', gap: space(3),
    padding: space(4), borderRadius: radius.lg, overflow: 'hidden', marginTop: space(6), ...shadow.glow,
  },
  proActive: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairline },
  proTitle: { ...font.bodyStrong, color: '#1A1304' },
  proSub: { ...font.caption, color: 'rgba(26,19,4,0.7)', marginTop: 1 },
  section: { ...font.label, color: colors.textDim, marginTop: space(7), marginBottom: space(2) },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: space(3),
    paddingVertical: space(4), borderBottomWidth: 1, borderBottomColor: colors.hairline,
  },
  rowLabel: { ...font.body, color: colors.text, flex: 1 },
  rowValue: { ...font.caption, color: colors.textDim },
  footer: { ...font.micro, color: colors.textFaint, textAlign: 'center', marginTop: space(8) },
});
