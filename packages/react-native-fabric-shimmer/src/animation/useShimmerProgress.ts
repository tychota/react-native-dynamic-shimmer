import { useEffect } from "react";
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import type { AnimationKind } from "../types";

// 1500 ms per cycle reads as "ambient movement" rather than "this is
// loading right NOW." Faster pulls the eye too aggressively for a
// placeholder that may be on screen for several seconds; slower than
// ~2 s starts to feel sluggish.
const DURATION_MS = 1500;

export function useShimmerProgress(active: boolean, kind: AnimationKind): SharedValue<number> {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active || kind === "none") {
      cancelAnimation(progress);
      progress.set(0);
      return;
    }
    progress.set(0);
    progress.set(
      withRepeat(
        withTiming(1, {
          duration: DURATION_MS,
          easing: Easing.linear,
          reduceMotion: ReduceMotion.System,
        }),
        -1,
        false,
      ),
    );
    return () => {
      cancelAnimation(progress);
    };
  }, [active, kind, progress]);

  return progress;
}
