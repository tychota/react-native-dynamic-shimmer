import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import type { Project } from "../mocks/projects";

// Intentionally CPU-heavy on every render: synthesises a 32-bar activity
// histogram from the project's metrics, then runs three passes of a 3-point
// moving-average smoother. Each pass is O(N), small N, but the function
// itself runs at every render — ideal for spotting in the React DevTools
// Profiler when you want to see the "what would be cached if memoised"
// hot path.
//
// No useMemo. React Compiler should infer this is a pure function of
// `project` and skip re-execution when the same Project reference flows
// in. That's exactly the property we want to verify in the Profiler:
//   - Compiler enabled  → ActivitySparkline self-time near zero on
//                         re-renders where `project` is unchanged.
//   - Compiler disabled → self-time stays constant on every parent
//                         re-render (the expensive bars[] is rebuilt).

const BARS = 32;
const SMOOTHING_PASSES = 3;

function synthesise(project: Project): ReadonlyArray<number> {
  // Hash the metrics deterministically into 32 bar heights.
  const seed =
    project.metrics.stars * 31 +
    project.metrics.forks * 17 +
    project.metrics.issues * 7 +
    project.metrics.contributors;
  const raw: number[] = [];
  let s = seed;
  for (let i = 0; i < BARS; i += 1) {
    s = (s * 1103515245 + 12345 + i * 7919) & 0x7fffffff;
    raw.push(s / 0x7fffffff);
  }
  // Three moving-average smoothing passes.
  let buf = raw;
  for (let pass = 0; pass < SMOOTHING_PASSES; pass += 1) {
    const next: number[] = [];
    for (let i = 0; i < buf.length; i += 1) {
      const a = buf[Math.max(0, i - 1)] ?? 0;
      const b = buf[i] ?? 0;
      const c = buf[Math.min(buf.length - 1, i + 1)] ?? 0;
      next.push((a + b + c) / 3);
    }
    buf = next;
  }
  // Normalise to 0..1.
  const max = Math.max(...buf, 1);
  return buf.map((v) => v / max);
}

export function ActivitySparkline({ project }: { project: Project }): React.ReactElement {
  const heights = synthesise(project);
  return (
    <View style={styles.row}>
      {heights.map((h, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              height: 8 + h * 24,
              backgroundColor: i === heights.length - 1 ? "#2b6cff" : "#cbd5e1",
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: 32,
  },
  bar: { width: 4, borderRadius: 1 },
}));
