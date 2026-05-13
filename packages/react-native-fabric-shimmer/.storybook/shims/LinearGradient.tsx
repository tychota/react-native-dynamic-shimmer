import React from "react";

// Web-preview shim for expo-linear-gradient. Renders a CSS linear-gradient
// in place of the native component so Skeleton's shimmer track works in
// Storybook + Chromatic without the native module.
export function LinearGradient(props: {
  colors: ReadonlyArray<string>;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: React.CSSProperties;
  children?: React.ReactNode;
}): React.ReactElement {
  const stops = props.colors.join(", ");
  const dx = (props.end?.x ?? 1) - (props.start?.x ?? 0);
  const dy = (props.end?.y ?? 0) - (props.start?.y ?? 0);
  const angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI + 90);
  return (
    <div style={{ ...props.style, backgroundImage: `linear-gradient(${angle}deg, ${stops})` }}>
      {props.children}
    </div>
  );
}
