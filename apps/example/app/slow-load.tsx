import React from "react";
import { Skeleton } from "react-native-fabric-shimmer";
import { UnistylesRuntime } from "react-native-unistyles";
import { DemoScreen } from "../src/components/DemoScreen";
import { UserCard } from "../src/components/UserCard";
import { MOCK_USER } from "../src/mocks/users";
import { fetchUser } from "../src/mocks/api";
import { useControlledQuery } from "../src/hooks/useControlledQuery";

export default function SlowLoad(): React.ReactElement {
  const theme = UnistylesRuntime.getTheme();
  const { data } = useControlledQuery(["user", "slow"], (cfg) => fetchUser("2", cfg), {
    delayMs: 3000,
  });
  return (
    <DemoScreen title="Slow load (3 s)" subtitle="Full shimmer animation cycle is visible.">
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
