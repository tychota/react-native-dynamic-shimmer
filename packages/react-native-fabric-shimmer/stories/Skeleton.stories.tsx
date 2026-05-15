import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { View, Text, Image } from "react-native";
import { Skeleton, Bone, findAll, merge, type RenderBoneFn } from "../src";
import { MOCK_USER, LONG_BIO_USER, COLORS } from "./mock";

function UserCard({ user }: { user: typeof MOCK_USER }): React.ReactElement {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 16,
        backgroundColor: "#fafafa",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        gap: 12,
      }}
    >
      <Image source={{ uri: user.avatarUrl }} style={{ width: 56, height: 56, borderRadius: 28 }} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 17, fontWeight: "600" }}>{user.name}</Text>
        <Text style={{ fontSize: 13, color: "#6a6b72" }}>{user.role}</Text>
        <Text style={{ fontSize: 15 }}>{user.bio}</Text>
      </View>
    </View>
  );
}

const meta = {
  title: "Skeleton",
  component: Skeleton,
  parameters: { chromatic: { pauseAnimationAtEnd: true } },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Skeleton loading baseColor={COLORS.light.base} highlightColor={COLORS.light.highlight}>
      <UserCard user={MOCK_USER} />
    </Skeleton>
  ),
};

export const Pulse: Story = {
  render: () => (
    <Skeleton
      loading
      animation="pulse"
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
    >
      <UserCard user={MOCK_USER} />
    </Skeleton>
  ),
};

export const NoAnimation: Story = {
  render: () => (
    <Skeleton
      loading
      animation="none"
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
    >
      <UserCard user={MOCK_USER} />
    </Skeleton>
  ),
};

export const DarkMode: Story = {
  parameters: { backgrounds: { default: "dark" } },
  render: () => (
    <Skeleton loading baseColor={COLORS.dark.base} highlightColor={COLORS.dark.highlight}>
      <UserCard user={MOCK_USER} />
    </Skeleton>
  ),
};

export const LongText: Story = {
  render: () => (
    <Skeleton loading baseColor={COLORS.light.base} highlightColor={COLORS.light.highlight}>
      <UserCard user={LONG_BIO_USER} />
    </Skeleton>
  ),
};

export const SmallScreen: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <Skeleton loading baseColor={COLORS.light.base} highlightColor={COLORS.light.highlight}>
        <UserCard user={MOCK_USER} />
      </Skeleton>
    </View>
  ),
};

const customRenderBone: RenderBoneFn = (rect, ctx) =>
  rect.kind === "image" ? (
    <View
      key={ctx.index}
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        borderRadius: rect.borderRadius === "50%" ? rect.width / 2 : rect.borderRadius,
        borderWidth: 2,
        borderColor: "#2b6cff",
        backgroundColor: "#fafafa",
      }}
    />
  ) : (
    <Bone
      key={ctx.index}
      rect={rect}
      progress={ctx.progress}
      baseColor={ctx.baseColor}
      highlightColor={ctx.highlightColor}
      animation={ctx.animation}
    />
  );

export const WithCustomBone: Story = {
  render: () => (
    <Skeleton
      loading
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
      renderBone={customRenderBone}
    >
      <UserCard user={MOCK_USER} />
    </Skeleton>
  ),
};

export const MergedBones: Story = {
  render: () => (
    <Skeleton
      loading
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
      refineBones={(tree) => {
        const texts = findAll(tree, (n) => n.type === "RCTText" && n.rect.y < 60);
        return texts.length >= 2 ? merge(tree, texts.slice(0, 2)) : tree;
      }}
    >
      <UserCard user={MOCK_USER} />
    </Skeleton>
  ),
};

export const Loaded: Story = {
  render: () => (
    <Skeleton loading={false} baseColor={COLORS.light.base} highlightColor={COLORS.light.highlight}>
      <UserCard user={MOCK_USER} />
    </Skeleton>
  ),
};
