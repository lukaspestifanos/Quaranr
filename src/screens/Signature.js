import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import SignaturePad from '../components/SignaturePad';
import { Eyebrow, H1, Lead } from '../components/Type';
import { useApp } from '../state/AppContext';
import { space } from '../theme';

export default function Signature({ progress, onNext, onBack }) {
  const { update } = useApp();
  const [strokes, setStrokes] = useState([]);

  const commit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    update({ commitment: { signedAt: Date.now(), strokes } });
    onNext();
  };

  return (
    <Screen
      progress={progress}
      onBack={onBack}
      gradient="dawn"
      footer={
        <PrimaryButton label="I commit" variant="gold" disabled={strokes.length === 0} onPress={commit} />
      }
    >
      <Eyebrow>Your commitment</Eyebrow>
      <H1>Make it real.</H1>
      <Lead style={{ marginBottom: space(8) }}>
        Not a contract — a quiet promise to yourself. Sign below to commit to showing up for these
        next 30 nights.
      </Lead>

      <View style={styles.padWrap}>
        <SignaturePad height={200} onChange={setStrokes} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  padWrap: { marginTop: space(2) },
});
