// Jest setup for Reassure perf tests. Mirrors the bits of
// `__tests__/setup.ts` (Vitest) that the perf tests need — reanimated
// stub, linear-gradient stub, Reassure's testingLibrary preference.

import { configure } from "reassure";

configure({ testingLibrary: "react" });

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) =>
    require("react").createElement("LinearGradient", props),
}));

jest.mock("react-native-reanimated", () => {
  const React = require("react");
  type SV<T> = { value: T; set: (v: T) => void; get: () => T };

  const useSharedValue = <T>(initial: T): SV<T> => {
    const sv: SV<T> = {
      value: initial,
      set(v: T) {
        this.value = v;
      },
      get() {
        return this.value;
      },
    };
    return sv;
  };
  const withTiming = <T>(target: T, _config?: unknown, cb?: (finished: boolean) => void): T => {
    if (cb !== undefined) cb(true);
    return target;
  };
  const withRepeat = <T>(value: T, _count?: number, _reverse?: boolean): T => value;
  const cancelAnimation = (_sv: unknown): void => {};
  const runOnJS =
    <Args extends ReadonlyArray<unknown>>(fn: (...args: Args) => void) =>
    (...args: Args) =>
      fn(...args);
  const useAnimatedStyle = <T>(fn: () => T): T => fn();
  const Easing = {
    linear: (v: number) => v,
    ease: (v: number) => v,
    in: (fn: (v: number) => number) => fn,
    out: (fn: (v: number) => number) => fn,
    quad: (v: number) => v * v,
    inOut: (fn: (v: number) => number) => fn,
  };
  const ReduceMotion = { System: "system", Always: "always", Never: "never" };
  const interpolate = (value: number, input: number[], output: number[]): number => {
    if (input.length < 2 || output.length < 2) return output[0] ?? 0;
    for (let i = 0; i < input.length - 1; i++) {
      const lo = input[i];
      const hi = input[i + 1];
      if (value >= lo && value <= hi) {
        const t = (value - lo) / (hi - lo);
        return (output[i] ?? 0) + t * ((output[i + 1] ?? 0) - (output[i] ?? 0));
      }
    }
    return value < input[0] ? output[0] : output[output.length - 1];
  };

  const AnimatedView = React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
    const { children, style } = props;
    return React.createElement(
      "div",
      { ref, style: flattenStyle(style), "data-rn": "Animated.View" },
      children,
    );
  });

  function flattenStyle(style: unknown): Record<string, unknown> | undefined {
    if (style === null || style === undefined) return undefined;
    if (Array.isArray(style)) {
      return style.reduce<Record<string, unknown>>(
        (acc, item) => Object.assign(acc, flattenStyle(item)),
        {},
      );
    }
    if (typeof style === "object") return style as Record<string, unknown>;
    return undefined;
  }

  return {
    __esModule: true,
    useSharedValue,
    withTiming,
    withRepeat,
    cancelAnimation,
    runOnJS,
    useAnimatedStyle,
    Easing,
    ReduceMotion,
    interpolate,
    default: { View: AnimatedView, createAnimatedComponent: (c: unknown) => c },
  };
});
