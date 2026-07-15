import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import PrimaryButton from '../components/PrimaryButton';
import Glyph from '../components/Glyph';
import Stars from '../components/Stars';
import { useApp } from '../state/AppContext';
import { PRODUCTS } from '../monetization/config';
import { colors, gradients, font, space, radius, shadow } from '../theme';

// Apple requires FUNCTIONAL links here (Guideline 3.1.2(c)). Terms uses
// Apple's standard EULA; Privacy is our GitHub Pages policy. If these hosts
// ever change, update the App Store metadata links too.
const TERMS_URL =
  'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const PRIVACY_URL = 'https://lukaspestifanos.github.io/Quaranr/privacy.html';

const BENEFITS = [
  { icon: 'moon', text: 'Sleep to Quran every night' },
  { icon: 'bell', text: 'Prayer reminders timed to your day' },
  { icon: 'book', text: 'Your full personalized 30-day plan' },
  { icon: 'flame', text: 'Streaks & progress to keep you consistent' },
];

// The signature hard paywall: annual-first, "Try for $0.00", monthly shown for
// contrast, and NO close button — the only ways forward are subscribe or
// restore. Buttons call the real RevenueCat purchase/restore flows.
export default function Paywall({ onSuccess }) {
  const app = useApp();
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState('annual'); // annual pre-selected
  const [prices, setPrices] = useState(PRODUCTS);
  const [busy, setBusy] = useState(false);

  // Pull live localized prices/trials from RevenueCat when available.
  useEffect(() => {
    let alive = true;
    app
      .loadOfferings()
      .then((o) => {
        if (alive && o) setPrices(o);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const annual = prices.annual || PRODUCTS.annual;
  const monthly = prices.monthly || PRODUCTS.monthly;
  const selected = plan === 'annual' ? annual : monthly;
  const hasTrial = (selected.trialDays || 0) > 0;

  const ctaLabel = hasTrial ? 'Try for $0.00' : 'Continue';
  const ctaSub = hasTrial
    ? `${selected.trialDays}-day free trial, then ${annual.priceString}/year`
    : `${monthly.priceString} per month`;

  const subscribe = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { entitled } = await app.buy(plan);
      if (entitled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onSuccess && onSuccess();
      }
    } catch (e) {
      if (!e?.userCancelled) {
        Alert.alert('Purchase failed', e?.message || 'Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { entitled } = await app.restorePurchases();
      if (entitled) {
        onSuccess && onSuccess();
      } else {
        Alert.alert('Nothing to restore', 'No previous purchase was found.');
      }
    } catch (e) {
      Alert.alert('Restore failed', e?.message || 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.plan} style={StyleSheet.absoluteFill} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space(8) }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View entering={FadeIn.duration(500)} style={styles.crown}>
          <Glyph name="sparkle" size={34} color={colors.gold} />
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(120)} style={styles.title}>
          Unlock your full{'\n'}prayer plan
        </Animated.Text>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.socialRow}>
          <Stars count={5} size={15} />
          <Text style={styles.socialText}>Loved by 1.2M+ Muslims · 4.9★</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(280)} style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b.text} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Glyph name={b.icon} size={18} color={colors.gold} />
              </View>
              <Text style={styles.benefitText}>{b.text}</Text>
              <Glyph name="check" size={18} color={colors.emerald} />
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(360)} style={{ alignSelf: 'stretch', gap: space(3) }}>
          <PlanCard
            title={annual.title}
            priceLine={`${annual.priceString} / year`}
            subline={`${annual.perMonthString} / mo`}
            badge={annual.badge}
            selected={plan === 'annual'}
            onPress={() => {
              Haptics.selectionAsync();
              setPlan('annual');
            }}
          />
          <PlanCard
            title={monthly.title}
            priceLine={`${monthly.priceString} / month`}
            subline={`${monthly.perMonthString} / mo`}
            selected={plan === 'monthly'}
            onPress={() => {
              Haptics.selectionAsync();
              setPlan('monthly');
            }}
          />
        </Animated.View>
      </ScrollView>

      {/* Sticky CTA dock — NO close button. Hard paywall. */}
      <View style={[styles.dock, { paddingBottom: insets.bottom + space(3) }]}>
        <PrimaryButton label={ctaLabel} sublabel={ctaSub} onPress={subscribe} loading={busy} pulse />
        <View style={styles.legalRow}>
          <Pressable onPress={restore} hitSlop={8}>
            <Text style={styles.legal}>Restore</Text>
          </Pressable>
          <Text style={styles.legalDot}>·</Text>
          <Pressable onPress={() => Linking.openURL(TERMS_URL)} hitSlop={8}>
            <Text style={styles.legal}>Terms</Text>
          </Pressable>
          <Text style={styles.legalDot}>·</Text>
          <Pressable onPress={() => Linking.openURL(PRIVACY_URL)} hitSlop={8}>
            <Text style={styles.legal}>Privacy</Text>
          </Pressable>
        </View>
        <Text style={styles.fine}>Cancel anytime. Auto-renews until cancelled.</Text>
      </View>
    </View>
  );
}

function PlanCard({ title, priceLine, subline, badge, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.plan, selected && styles.planOn]}>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <View style={styles.planBody}>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected ? <Glyph name="check" size={14} color={'#1A1304'} /> : null}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.planTitle}>{title}</Text>
          <Text style={styles.planSub}>{subline}</Text>
        </View>
        <Text style={styles.planPrice}>{priceLine}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space(6), paddingBottom: space(6), alignItems: 'center' },
  crown: { marginBottom: space(4) },
  title: { ...font.display, color: colors.text, textAlign: 'center', marginBottom: space(3) },
  socialRow: { flexDirection: 'row', alignItems: 'center', gap: space(2), marginBottom: space(6) },
  socialText: { ...font.caption, color: colors.textDim },

  benefits: { alignSelf: 'stretch', gap: space(3), marginBottom: space(7) },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: space(3) },
  benefitIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(230,194,122,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: { ...font.body, color: colors.text, flex: 1 },

  plan: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  planOn: { borderColor: colors.gold, backgroundColor: colors.surfaceHi, ...shadow.glow },
  badge: { backgroundColor: colors.gold, paddingVertical: space(1.5), alignItems: 'center' },
  badgeText: { ...font.micro, color: '#1A1304' },
  planBody: { flexDirection: 'row', alignItems: 'center', padding: space(4), gap: space(3) },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.textFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  planTitle: { ...font.title, color: colors.text },
  planSub: { ...font.caption, color: colors.textDim, marginTop: 1 },
  planPrice: { ...font.bodyStrong, color: colors.text },

  dock: {
    paddingHorizontal: space(6),
    paddingTop: space(3),
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: 'rgba(11,16,32,0.85)',
  },
  legalRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: space(2), marginTop: space(3) },
  legal: { ...font.caption, color: colors.textMute },
  legalDot: { color: colors.textFaint },
  fine: { ...font.micro, color: colors.textFaint, textAlign: 'center', marginTop: space(2) },
});
