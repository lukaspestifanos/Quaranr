import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Glyph from '../components/Glyph';
import Home from '../screens/app/Home';
import Library from '../screens/app/Library';
import Profile from '../screens/app/Profile';
import { colors, font, space } from '../theme';

const TABS = [
  { key: 'today', label: 'Today', icon: 'moon' },
  { key: 'listen', label: 'Listen', icon: 'play' },
  { key: 'you', label: 'You', icon: 'heart' },
];

// Post-onboarding app shell. Custom bottom tab bar — no navigation library.
export default function Hub() {
  const [tab, setTab] = useState('today');
  const insets = useSafeAreaInsets();

  const go = (key) => {
    if (key !== tab) Haptics.selectionAsync();
    setTab(key);
  };

  return (
    <View style={styles.root}>
      <View style={styles.screen}>
        {tab === 'today' && <Home />}
        {tab === 'listen' && <Library onPlay={() => setTab('today')} />}
        {tab === 'you' && <Profile />}
      </View>

      <View style={[styles.tabBarWrap, { paddingBottom: Math.max(insets.bottom, space(3)) }]}>
        <LinearGradient
          colors={['rgba(11,16,32,0)', colors.bg]}
          style={styles.fade}
          pointerEvents="none"
        />
        <View style={styles.tabBar}>
          {TABS.map((t) => {
            const on = t.key === tab;
            return (
              <Pressable key={t.key} onPress={() => go(t.key)} style={styles.tab} hitSlop={8}>
                <Glyph name={t.icon} size={24} color={on ? colors.gold : colors.textMute} filled={on} />
                <Text style={[styles.tabLabel, on && { color: colors.gold }]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  screen: { flex: 1 },
  tabBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  fade: { position: 'absolute', top: -28, left: 0, right: 0, height: 28 },
  tabBar: { flexDirection: 'row', paddingTop: space(3) },
  tab: { flex: 1, alignItems: 'center', gap: space(1) },
  tabLabel: { ...font.micro, color: colors.textMute },
});
