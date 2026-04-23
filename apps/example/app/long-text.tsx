import React from "react";
import { Skeleton } from "react-native-dynamic-shimmer";
import { UnistylesRuntime } from "react-native-unistyles";
import { DemoScreen } from "../src/components/DemoScreen";
import { UserCard } from "../src/components/UserCard";
import { USER_LONG_BIO } from "../src/mocks/users";
import { fetchLongUser } from "../src/mocks/api";
import { useControlledQuery } from "../src/hooks/useControlledQuery";

export default function LongText(): React.ReactElement {
  const theme = UnistylesRuntime.getTheme();
  const { data } = useControlledQuery(["user", "long"], fetchLongUser, {
    delayMs: 1500,
  });
  return (
    <DemoScreen title="Long text" subtitle="Multi-line bio produces multiple text bones.">
      <Skeleton
        loading={data === undefined}
        baseColor={theme.colors.skeletonBase}
        highlightColor={theme.colors.skeletonHighlight}
      >
        <UserCard user={data ?? USER_LONG_BIO} />
      </Skeleton>
    </DemoScreen>
  );
}
