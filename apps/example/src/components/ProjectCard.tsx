import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { StyleSheet } from "react-native-unistyles";
import type { Project } from "../mocks/projects";
import { ActivitySparkline } from "./ActivitySparkline";

// Deliberately leaf-heavy: header (avatar + name + status pill), description
// line, four metric pills, three tag pills. ~12 measurable bones per card,
// which exercises the fiber walker + JSI measurement + IR flatten more than
// the simpler UserCard (~6 bones).
//
// No manual useMemo / useCallback / React.memo — React Compiler should handle
// memoization given stable Project references from the parent. This is the
// component to profile via React DevTools to verify Compiler is doing its job.
export function ProjectCard({ project }: { project: Project }): React.ReactElement {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={project.avatarUrl} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{project.name}</Text>
          <Text style={styles.owner}>@{project.owner}</Text>
        </View>
        <StatusPill status={project.status} />
      </View>
      <Text style={styles.description}>{project.description}</Text>
      <View style={styles.metricsRow}>
        <Metric label="stars" value={project.metrics.stars} />
        <Metric label="forks" value={project.metrics.forks} />
        <Metric label="issues" value={project.metrics.issues} />
        <Metric label="contrib" value={project.metrics.contributors} />
      </View>
      <View style={styles.tagsRow}>
        {project.tags.map((t, i) => (
          <Tag key={i} label={t} />
        ))}
      </View>
      <ActivitySparkline project={project} />
    </View>
  );
}

function StatusPill({ status }: { status: Project["status"] }): React.ReactElement {
  return (
    <View style={[styles.pill, styles[`pill_${status}`]]}>
      <Text style={[styles.pillText, styles[`pillText_${status}`]]}>{status}</Text>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: number }): React.ReactElement {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function Tag({ label }: { label: string }): React.ReactElement {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>#{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    padding: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  headerText: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: "600", color: theme.colors.textPrimary },
  owner: { fontSize: 12, color: theme.colors.textMuted },
  description: { fontSize: 13, color: theme.colors.textPrimary },
  metricsRow: { flexDirection: "row", gap: 8 },
  metric: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  metricValue: { fontSize: 15, fontWeight: "600", color: theme.colors.textPrimary },
  metricLabel: { fontSize: 11, color: theme.colors.textMuted, marginTop: 1 },
  tagsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: { fontSize: 11, color: theme.colors.textMuted },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  pill_active: { backgroundColor: "#dcfce7" },
  pill_paused: { backgroundColor: "#fef3c7" },
  pill_archived: { backgroundColor: theme.colors.bg },
  pillText: { fontSize: 11, fontWeight: "600" },
  pillText_active: { color: "#166534" },
  pillText_paused: { color: "#854d0e" },
  pillText_archived: { color: theme.colors.textMuted },
}));
