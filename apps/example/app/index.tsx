import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native-unistyles";

type Demo = { group: string; slug: string; title: string; desc: string };

const DEMOS: ReadonlyArray<Demo> = [
  {
    group: "Basics",
    slug: "profile-card",
    title: "Profile card",
    desc: "Basic shimmer on a user card",
  },
  {
    group: "Basics",
    slug: "user-list",
    title: "User list",
    desc: "Shimmer across 20 rows in FlashList",
  },
  {
    group: "Basics",
    slug: "dark-mode",
    title: "Dark mode",
    desc: "Theme-aware colors via Unistyles",
  },
  {
    group: "Timing",
    slug: "fast-load",
    title: "Fast load (20ms)",
    desc: "Skeleton should never appear",
  },
  {
    group: "Timing",
    slug: "slow-load",
    title: "Slow load (3s)",
    desc: "Long-running shimmer",
  },
  {
    group: "Timing",
    slug: "error-state",
    title: "Error state",
    desc: "Query fails; skeleton yields to error UI",
  },
  {
    group: "Layout",
    slug: "long-text",
    title: "Long text",
    desc: "Multi-line text bones",
  },
  {
    group: "Layout",
    slug: "breakpoints",
    title: "Breakpoints",
    desc: "Same card, three widths",
  },
  {
    group: "Extension",
    slug: "custom-bone",
    title: "Custom bone",
    desc: "renderBone swaps image bones",
  },
  {
    group: "Extension",
    slug: "refine-bones-merge",
    title: "Refine: merge",
    desc: "Merge two text bones into one",
  },
  {
    group: "Extension",
    slug: "refine-bones-hide",
    title: "Refine: hide",
    desc: "Hide a decorative icon",
  },
  {
    group: "Extension",
    slug: "classify",
    title: "Classify: custom",
    desc: "Treat IconBadge as a single leaf",
  },
];

export default function Home(): React.ReactElement {
  const groups = Array.from(new Set(DEMOS.map((d) => d.group)));
  return (
    <>
      <Stack.Screen options={{ title: "react-native-fabric-shimmer" }} />
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        {groups.map((group) => (
          <View key={group} style={styles.group}>
            <Text style={styles.groupTitle}>{group}</Text>
            {DEMOS.filter((d) => d.group === group).map((d) => (
              <Link key={d.slug} href={`/${d.slug}` as never} asChild>
                <Pressable style={styles.item}>
                  <Text style={styles.itemTitle}>{d.title}</Text>
                  <Text style={styles.itemDesc}>{d.desc}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: 16, gap: 24 },
  group: { gap: 8 },
  groupTitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  item: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  itemDesc: { fontSize: 13, color: theme.colors.textMuted },
}));
