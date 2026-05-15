import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "react-native-fabric-shimmer";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { DemoScreen } from "../src/components/DemoScreen";
import { ProjectCard } from "../src/components/ProjectCard";
import { generateProjects, type Project } from "../src/mocks/projects";

// Profiling stress-test screen.
//
// 50 cards × ~12 measurable bones per card × a deliberately CPU-heavy
// ActivitySparkline child. Two controls churn loading state:
//   - "Toggle all"     — flips every row's loading state simultaneously
//   - "Reload 5 random" — toggles 5 randomly chosen rows to re-enter loading
//                        for 2 seconds each, exercises mount/unmount of
//                        the bone overlay
//
// How to profile (with React DevTools open in Chrome/Safari debug mode):
//   1. React → Profiler tab → record
//   2. Hit "Reload 5 random" several times
//   3. Stop, inspect the flame graph
//   4. Look at ActivitySparkline's self-time vs ProjectCard's wrapper time
//   5. Toggle off React Compiler in the example app's babel.config and
//      re-record — you should see ActivitySparkline run on every parent
//      re-render instead of being skipped.
//
// No useCallback / useMemo / React.memo anywhere. React Compiler handles
// memoization; if it doesn't, the Profiler will show it as wasted work.

const ITEM_COUNT = 50;

type RowState = { loading: boolean };

function initialRows(count: number): RowState[] {
  return Array.from({ length: count }, () => ({ loading: true }));
}

function pickRandom(count: number, n: number): number[] {
  const indices = new Set<number>();
  while (indices.size < n && indices.size < count) {
    indices.add(Math.floor(Math.random() * count));
  }
  return [...indices];
}

export default function ProfileStress(): React.ReactElement {
  const theme = UnistylesRuntime.getTheme();
  const projects: ReadonlyArray<Project> = generateProjects(ITEM_COUNT);
  const [rows, setRows] = useState<RowState[]>(() => initialRows(ITEM_COUNT));

  // Initial bulk-load: flip all to loaded after 1.5s on mount.
  React.useEffect(() => {
    const t = setTimeout(() => {
      setRows((prev) => prev.map(() => ({ loading: false })));
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const toggleAll = () => {
    setRows((prev) => prev.map((r) => ({ loading: !r.loading })));
  };

  const reloadFiveRandom = () => {
    const targets = pickRandom(ITEM_COUNT, 5);
    setRows((prev) => prev.map((r, i) => (targets.includes(i) ? { loading: true } : r)));
    // After 2s, flip those rows back to loaded.
    setTimeout(() => {
      setRows((prev) => prev.map((r, i) => (targets.includes(i) ? { loading: false } : r)));
    }, 2000);
  };

  return (
    <DemoScreen
      title="Profile stress"
      subtitle="50 complex cards with intentionally heavy ActivitySparkline. Open React DevTools Profiler, record, and click the buttons."
    >
      <View style={styles.controls}>
        <Pressable onPress={toggleAll} style={styles.button}>
          <Text style={styles.buttonText}>Toggle all</Text>
        </Pressable>
        <Pressable onPress={reloadFiveRandom} style={styles.button}>
          <Text style={styles.buttonText}>Reload 5 random</Text>
        </Pressable>
      </View>
      <View style={styles.list}>
        <FlashList
          data={projects as Array<Project>}
          keyExtractor={(p) => p.id}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item, index }) => (
            <Skeleton
              loading={rows[index]?.loading ?? false}
              baseColor={theme.colors.skeletonBase}
              highlightColor={theme.colors.skeletonHighlight}
            >
              <ProjectCard project={item} />
            </Skeleton>
          )}
        />
      </View>
    </DemoScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  controls: { flexDirection: "row", gap: 8, marginBottom: 12 },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.accent,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 14, fontWeight: "600" },
  list: { minHeight: 600 },
  sep: { height: 10 },
}));
