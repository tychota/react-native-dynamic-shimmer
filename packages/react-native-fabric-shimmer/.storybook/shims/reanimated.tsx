import React from "react";

// Minimal reanimated stub for Storybook's web preview. The Skeleton uses:
//   - useSharedValue, withTiming, withRepeat, cancelAnimation, runOnJS
//   - useAnimatedStyle, Easing, ReduceMotion
//   - Animated.View (default export)
//
// Animations are static in the preview (we want consistent snapshots in
// Chromatic anyway). useAnimatedStyle just calls the worklet once and
// returns its result; Animated.View renders a plain div.

type SV<T> = { value: T; set: (v: T) => void; get: () => T };

export function useSharedValue<T>(initial: T): SV<T> {
  return {
    value: initial,
    set(v) {
      this.value = v;
    },
    get() {
      return this.value;
    },
  };
}

export function withTiming<T>(target: T, _config?: unknown, cb?: (finished: boolean) => void): T {
  if (cb !== undefined) cb(true);
  return target;
}

export function withRepeat<T>(value: T, _count?: number, _reverse?: boolean): T {
  return value;
}

export function cancelAnimation(_sv: unknown): void {}

export const runOnJS =
  <Args extends ReadonlyArray<unknown>>(fn: (...args: Args) => void) =>
  (...args: Args) =>
    fn(...args);

export function useAnimatedStyle<T>(fn: () => T): T {
  return fn();
}

export const Easing = {
  linear: (v: number) => v,
  ease: (v: number) => v,
  in: (fn: (v: number) => number) => fn,
  out: (fn: (v: number) => number) => fn,
  quad: (v: number) => v * v,
  inOut: (fn: (v: number) => number) => fn,
};

export const ReduceMotion = { System: "system", Always: "always", Never: "never" };

export function interpolate(value: number, input: number[], output: number[]): number {
  if (input.length < 2 || output.length < 2) return output[0] ?? 0;
  for (let i = 0; i < input.length - 1; i += 1) {
    const lo = input[i];
    const hi = input[i + 1];
    if (value >= lo && value <= hi) {
      const t = (value - lo) / (hi - lo);
      return (output[i] ?? 0) + t * ((output[i + 1] ?? 0) - (output[i] ?? 0));
    }
  }
  const first = input[0];
  const lastOut = output[output.length - 1];
  return value < (first ?? 0) ? (output[0] ?? 0) : (lastOut ?? 0);
}

const AnimatedView = React.forwardRef<HTMLDivElement, Record<string, unknown>>((props, ref) => {
  const { style, children, ...rest } = props as { style?: unknown; children?: React.ReactNode };
  const flat = flattenStyle(style);
  return React.createElement("div", { ...rest, ref, style: flat }, children);
});
AnimatedView.displayName = "Animated.View";

function flattenStyle(style: unknown): React.CSSProperties {
  if (style === null || style === undefined) return {};
  if (Array.isArray(style)) {
    return style.reduce<React.CSSProperties>(
      (acc, s) => Object.assign(acc, flattenStyle(s)),
      {} as React.CSSProperties,
    );
  }
  if (typeof style === "object") return style as React.CSSProperties;
  return {};
}

const Animated = {
  View: AnimatedView,
  Text: AnimatedView,
  Image: AnimatedView,
  ScrollView: AnimatedView,
  createAnimatedComponent: <T,>(c: T): T => c,
};

export default Animated;
