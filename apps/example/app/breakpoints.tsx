import React from "react";
import { View } from "react-native";
import { Skeleton } from "react-native-fabric-shimmer";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { DemoScreen } from "../src/components/DemoScreen";
import { UserCard } from "../src/components/UserCard";
import { MOCK_USER } from "../src/mocks/users";
import { fetchUser } from "../src/mocks/api";
import { useControlledQuery } from "../src/hooks/useControlledQuery";

const WIDTHS = [280, 375, 560] as const;

export default function Breakpoints(): React.ReactElement {
  const theme = UnistylesRuntime.getTheme();
  const { data } = useControlledQuery(["user", "bp"], (cfg) => fetchUser("3", cfg), {
    delayMs: 1500,
  });
  return (
    <DemoScreen title="Breakpoints" subtitle="Same card at 280 / 375 / 560 px.">
      {WIDTHS.map((w) => (
        <View key={w} style={[styles.box, { width: w }]}>
          <Skeleton
            loading={data === undefined}
            baseColor={theme.colors.skeletonBase}
            highlightColor={theme.colors.skeletonHighlight}
          >
            <UserCard user={data ?? MOCK_USER} />
          </Skeleton>
        </View>
      ))}
    </DemoScreen>
  );
}

const styles = StyleSheet.create(() => ({
  box: { alignSelf: "center" },
}));
