import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';

// JS-driven count-up; reliable across platforms without worklet text bridging.
export default function AnimatedNumber({
  value,
  duration = 1000,
  style,
  prefix = '',
  suffix = '',
  decimals = 0,
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  const start = useRef(null);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    start.current = null;
    const from = 0;
    const tick = (t) => {
      if (start.current == null) start.current = t;
      const p = Math.min(1, (t - start.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(from + (value - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return (
    <Text style={style}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </Text>
  );
}
