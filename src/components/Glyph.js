import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { colors } from '../theme';

// Minimal stroke icon set so we ship zero image assets.
const PATHS = {
  moon: (c) => (
    <Path
      d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"
      fill="none"
      stroke={c}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  ),
  star: (c, f) => (
    <Path
      d="M12 3.6l2.4 5 5.5.6-4.1 3.7 1.2 5.4L12 15.9l-4.9 2.4 1.2-5.4-4.1-3.7 5.5-.6z"
      fill={f ? c : 'none'}
      stroke={c}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  ),
  flame: (c) => (
    // Filled silhouette + lighter inner core, so it reads as a real flame at
    // any size instead of a thin outline.
    <G>
      <Path
        d="M13.6 1.2c.4 2.6.2 4.6-.9 5.8-1 1.1-2.6 1-3.4-.1-.5-.7-.6-1.7-.4-2.7C6.1 6 4.4 9.2 4.4 12.6 4.4 17 7.8 20.4 12 20.4s7.6-3.4 7.6-7.8c0-4.7-2.4-9.2-6-11.4Z"
        fill={c}
        stroke="none"
      />
      <Path
        d="M12.3 11.1c.7 1.1.5 2.3-.2 3.3.9-.2 1.6-.9 1.9-1.8.5 .8 .8 1.7 .8 2.6 0 2-1.6 3.5-3.6 3.5-1.9 0-3.4-1.4-3.4-3.3 0-1.6 1-2.8 2.2-3.9.2 .9 .8 1.4 1.5 1.6-.3-.7-.2-1.4 .1-2.1Z"
        fill="rgba(255,255,255,0.30)"
        stroke="none"
      />
    </G>
  ),
  bell: (c) => (
    <Path
      d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 5 2 6.5 2 6.5h-15s2-1.5 2-6.5ZM10 19a2 2 0 0 0 4 0"
      fill="none"
      stroke={c}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  check: (c) => (
    <Path
      d="M5 12.5l4.2 4.2L19 7"
      fill="none"
      stroke={c}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  sparkle: (c) => (
    <Path
      d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"
      fill={c}
      stroke="none"
    />
  ),
  heart: (c) => (
    <Path
      d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.7C19 15.6 12 20 12 20Z"
      fill="none"
      stroke={c}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  ),
  play: (c) => <Path d="M8 5.5v13l11-6.5z" fill={c} />,
  pause: (c) => (
    <G fill={c}>
      <Path d="M8 5h3v14H8zM13 5h3v14h-3z" />
    </G>
  ),
  lock: (c) => (
    <Path
      d="M7 10V8a5 5 0 0 1 10 0v2M5.5 10h13v9h-13z"
      fill="none"
      stroke={c}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  ),
  book: (c) => (
    <Path
      d="M4 5.5C4 5 4.4 4.6 5 4.6h5.5c.8 0 1.5.7 1.5 1.5v13c0-.8-.7-1.5-1.5-1.5H4ZM20 5.5c0-.5-.4-.9-1-.9h-5.5c-.8 0-1.5.7-1.5 1.5v13c0-.8.7-1.5 1.5-1.5H20Z"
      fill="none"
      stroke={c}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  ),
  sun: (c) => (
    <G fill="none" stroke={c} strokeWidth={1.7} strokeLinecap="round">
      <Circle cx={12} cy={12} r={4} />
      <Path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </G>
  ),
};

export default function Glyph({ name, size = 24, color = colors.text, filled = false }) {
  const draw = PATHS[name];
  if (!draw) return null;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {draw(color, filled)}
    </Svg>
  );
}
