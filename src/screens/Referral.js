import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { Eyebrow, H1, Lead } from '../components/Type';
import Glyph from '../components/Glyph';
import { colors, font, space, radius } from '../theme';

export default function Referral({ progress, onNext, onBack }) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);

  const apply = () => {
    if (code.trim().length > 0) setApplied(true);
  };

  return (
    <Screen
      progress={progress}
      onBack={onBack}
      footer={
        <View style={{ gap: space(3) }}>
          <PrimaryButton label="Continue" onPress={() => onNext(applied ? code.trim().toUpperCase() : null)} />
          <Pressable onPress={() => onNext(null)} hitSlop={8} style={{ alignItems: 'center' }}>
            <Text style={styles.skip}>I don’t have one</Text>
          </Pressable>
        </View>
      }
    >
      <Eyebrow>Referred by a friend?</Eyebrow>
      <H1>Enter your referral code</H1>
      <Lead style={{ marginBottom: space(6) }}>
        Get an extra week added to your free trial. Leave blank if you don’t have one.
      </Lead>

      <View style={[styles.inputRow, applied && styles.inputRowOk]}>
        <TextInput
          value={code}
          onChangeText={(t) => {
            setCode(t);
            setApplied(false);
          }}
          placeholder="e.g. AMINA-7"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="characters"
          autoCorrect={false}
          style={styles.input}
        />
        {applied ? (
          <Glyph name="check" size={22} color={colors.emerald} />
        ) : (
          <Pressable onPress={apply} hitSlop={8}>
            <Text style={styles.apply}>Apply</Text>
          </Pressable>
        )}
      </View>
      {applied ? <Text style={styles.applied}>✓ Code applied — +7 days added</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: space(4),
    height: 58,
    borderWidth: 1.5,
    borderColor: colors.hairline,
  },
  inputRowOk: { borderColor: colors.emerald },
  input: { flex: 1, ...font.bodyStrong, color: colors.text, letterSpacing: 1 },
  apply: { ...font.label, color: colors.gold },
  applied: { ...font.caption, color: colors.emerald, marginTop: space(3) },
  skip: { ...font.label, color: colors.textMute },
});
