import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import Glyph from '../components/Glyph';
import { Eyebrow, H1, Lead } from '../components/Type';
import { useApp } from '../state/AppContext';
import { scheduleReminders } from '../notifications/reminders';
import { colors, font, space, shadow } from '../theme';

const PRAYER_NAME = {
  fajr: 'Fajr',
  duhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export default function Notification({ progress, onNext, onBack }) {
  const { answers, update } = useApp();
  const [loading, setLoading] = useState(false);

  const chosen = (answers.reminderTimes || [])
    .map((p) => PRAYER_NAME[p] || p)
    .filter(Boolean);
  const prayersLabel = chosen.length ? chosen.join(', ') : 'your prayers';

  const enable = async () => {
    setLoading(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { granted } = await Notifications.requestPermissionsAsync();
      update({ notificationsAsked: true });
      if (granted) await scheduleReminders({ winddown: answers.winddown });
      onNext();
    } catch (e) {
      update({ notificationsAsked: true });
      onNext();
    }
  };

  const later = () => {
    update({ notificationsAsked: true });
    onNext();
  };

  return (
    <Screen
      progress={progress}
      onBack={onBack}
      footer={
        <View style={{ gap: space(3) }}>
          <PrimaryButton label="Enable reminders" variant="gold" loading={loading} onPress={enable} />
          <PrimaryButton label="Maybe later" variant="ghost" onPress={later} />
        </View>
      }
    >
      <View style={styles.hero}>
        <Animated.View entering={ZoomIn.delay(150).springify().damping(12)}>
          <LinearGradient colors={['#E6C27A', '#B98C3D']} style={styles.bell}>
            <Glyph name="bell" size={48} color={'#1A1304'} filled />
          </LinearGradient>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(300)}>
        <Eyebrow>Stay on track</Eyebrow>
        <H1>Gentle nudges, right on time.</H1>
        <Lead>
          A soft reminder before {prayersLabel} — never noisy, never guilt-trips. Just enough to keep
          your streak alive.
        </Lead>
      </Animated.View>

      {chosen.length ? (
        <Animated.View entering={FadeInDown.delay(440)} style={styles.tags}>
          {chosen.map((p) => (
            <View key={p} style={styles.tag}>
              <Glyph name="bell" size={13} color={colors.gold} />
              <Text style={styles.tagText}>{p}</Text>
            </View>
          ))}
        </Animated.View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: space(4), marginBottom: space(8) },
  bell: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glow,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2), marginTop: space(6) },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(2),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 999,
    paddingHorizontal: space(3),
    paddingVertical: space(2),
  },
  tagText: { ...font.label, color: colors.text },
});
