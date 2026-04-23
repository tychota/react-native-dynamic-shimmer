import React from "react";
import { View, Text, Pressable } from "react-native";
import { Skeleton } from "react-native-dynamic-shimmer";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { DemoScreen } from "../src/components/DemoScreen";
import { UserCard } from "../src/components/UserCard";
import { MOCK_USER } from "../src/mocks/users";
import { fetchUser } from "../src/mocks/api";
import { useControlledQuery } from "../src/hooks/useControlledQuery";

export default function DarkMode(): React.ReactElement {
  const initialTheme: "light" | "dark" = UnistylesRuntime.themeName === "dark" ? "dark" : "light";
  const [themeName, setThemeName] = React.useState<"light" | "dark">(initialTheme);
  const { data } = useControlledQuery(["user", "dark"], (cfg) => fetchUser("4", cfg), {
    delayMs: 1800,
  });
  const theme = UnistylesRuntime.getTheme(themeName);
  return (
    <DemoScreen
      title="Dark mode"
      subtitle="Tap to toggle; Unistyles swaps theme, Skeleton picks up the new colors."
    >
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Theme: {themeName}</Text>
        <Pressable
          style={styles.btn}
          onPress={() => {
            const next = themeName === "light" ? "dark" : "light";
            UnistylesRuntime.setTheme(next);
            setThemeName(next);
          }}
        >
          <Text style={styles.btnText}>Switch</Text>
        </Pressable>
      </View>
      <Skeleton
        loading={data === undefined}
        baseColor={theme.colors.skeletonBase}
        highlightColor={theme.colors.skeletonHighlight}
      >
        <UserCard user={data ?? MOCK_USER} />
      </Skeleton>
    </DemoScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  toggleLabel: { color: theme.colors.textPrimary, fontSize: 15 },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.accent,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
}));
