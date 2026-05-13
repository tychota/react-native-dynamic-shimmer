import React from "react";
import { View } from "react-native";
import { Bone, Skeleton, type RenderBoneFn } from "react-native-fabric-shimmer";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { DemoScreen } from "../src/components/DemoScreen";
import { UserCard } from "../src/components/UserCard";
import { MOCK_USER } from "../src/mocks/users";
import { fetchUser } from "../src/mocks/api";
import { useControlledQuery } from "../src/hooks/useControlledQuery";

// Custom bone for images: a solid ring instead of the default gradient sweep.
const renderBone: RenderBoneFn = (rect, ctx) => {
  if (rect.kind !== "image") return <Bone key={ctx.index} rect={rect} ctx={ctx} />;
  return (
    <View
      key={ctx.index}
      style={[
        {
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
          borderRadius: rect.borderRadius === "50%" ? rect.width / 2 : rect.borderRadius,
        },
        styles.imageBone,
      ]}
    />
  );
};

export default function CustomBone(): React.ReactElement {
  const theme = UnistylesRuntime.getTheme();
  const { data } = useControlledQuery(["user", "custom-bone"], (cfg) => fetchUser("1", cfg), {
    delayMs: 1500,
  });
  return (
    <DemoScreen title="Custom bone" subtitle="renderBone replaces image bones with a solid ring.">
      <Skeleton
        loading={data === undefined}
        baseColor={theme.colors.skeletonBase}
        highlightColor={theme.colors.skeletonHighlight}
        renderBone={renderBone}
      >
        <UserCard user={data ?? MOCK_USER} />
      </Skeleton>
    </DemoScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  imageBone: {
    borderWidth: 2,
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.surface,
  },
}));
