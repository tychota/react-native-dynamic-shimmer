import React from "react";
import { Skeleton } from "react-native-dynamic-shimmer";
import { UnistylesRuntime } from "react-native-unistyles";
import { DemoScreen } from "../src/components/DemoScreen";
import { UserCard } from "../src/components/UserCard";
import { MOCK_USER } from "../src/mocks/users";
import { fetchUser } from "../src/mocks/api";
import { useControlledQuery } from "../src/hooks/useControlledQuery";

export default function FastLoad(): React.ReactElement {
  const theme = UnistylesRuntime.getTheme();
  const { data } = useControlledQuery(["user", "fast"], (cfg) => fetchUser("1", cfg), {
    delayMs: 20,
  });
  return (
    <DemoScreen
      title="Fast load (20 ms)"
      subtitle="Skeleton should not appear. Data arrives within a frame."
    >
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
