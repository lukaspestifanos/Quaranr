import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import OptionCard from '../components/OptionCard';
import PrimaryButton from '../components/PrimaryButton';
import { Eyebrow, H1, Lead } from '../components/Type';
import { space } from '../theme';

export default function Question({ step, progress, onNext, onBack, initial }) {
  const multi = step.select === 'multi';
  const [sel, setSel] = useState(initial || (multi ? [] : null));

  const choose = (value) => {
    if (multi) {
      setSel((cur) => (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]));
    } else {
      setSel(value);
      // Single-select auto-advances — feels fast and premium.
      setTimeout(() => onNext(value), 240);
    }
  };

  const isSel = (v) => (multi ? sel.includes(v) : sel === v);
  const canContinue = multi ? sel.length > 0 : sel != null;

  return (
    <Screen
      progress={progress}
      onBack={onBack}
      footer={
        multi ? (
          <PrimaryButton
            label="Continue"
            disabled={!canContinue}
            onPress={() => onNext(sel)}
          />
        ) : null
      }
    >
      {step.eyebrow ? <Eyebrow>{step.eyebrow}</Eyebrow> : null}
      <H1>{step.title}</H1>
      {step.body ? <Lead style={{ marginBottom: space(5) }}>{step.body}</Lead> : <View style={{ height: space(4) }} />}
      {step.options.map((o) => (
        <OptionCard
          key={o.value}
          label={o.label}
          sublabel={o.sublabel}
          emoji={o.emoji}
          selected={isSel(o.value)}
          onPress={() => choose(o.value)}
        />
      ))}
    </Screen>
  );
}
