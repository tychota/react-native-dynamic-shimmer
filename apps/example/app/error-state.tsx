import React from "react";
import { View, Text, Pressable } from "react-native";
import { Skeleton } from "react-native-fabric-shimmer";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { DemoScreen } from "../src/components/DemoScreen";
import { UserCard } from "../src/components/UserCard";
import { MOCK_USER } from "../src/mocks/users";
import { fetchUser } from "../src/mocks/api";
import { useControlledQuery } from "../src/hooks/useControlledQuery";

export default function ErrorState(): React.ReactElement {
  const theme = UnistylesRuntime.getTheme();
  const q = useControlledQuery(["user", "err"], (cfg) => fetchUser("1", cfg), {
    failAfterMs: 1500,
  });
  return (
    <DemoScreen
      title="Error state"
      subtitle="Request fails after 1500 ms. Skeleton yields to an error card."
    >
      {q.error !== null ? (
        <View style={styles.errCard}>
          <Text style={styles.errTitle}>Couldn't load user</Text>
          <Text style={styles.errBody}>{q.error?.message}</Text>
          <Pressable style={styles.retry} onPress={() => q.refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <Skeleton
          loading={q.data === undefined}
          baseColor={theme.colors.skeletonBase}
          highlightColor={theme.colors.skeletonHighlight}
        >
          <UserCard user={q.data ?? MOCK_USER} />
        </Skeleton>
      )}
    </DemoScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  errCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.error,
    gap: 8,
  },
  errTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  errBody: { fontSize: 13, color: theme.colors.textMuted },
  retry: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.accent,
  },
  retryText: { color: "#fff", fontWeight: "600" },
}));
