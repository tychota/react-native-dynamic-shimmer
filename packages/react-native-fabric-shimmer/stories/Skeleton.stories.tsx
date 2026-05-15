import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { View, Text, Image } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Skeleton, Bone, type BoneRect, type RenderBoneFn } from "../src";
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

const CARD_BONES: ReadonlyArray<BoneRect> = [
  {
    x: 0,
    y: 0,
    width: 360,
    height: 122,
    borderRadius: 12,
    kind: "container",
    backgroundColor: "#fafafa",
    borderColor: "#eee",
    borderWidth: 1,
  },
  { x: 16, y: 16, width: 56, height: 56, borderRadius: "50%", kind: "image" },
  { x: 84, y: 18, width: 128, height: 20, borderRadius: 6, kind: "text" },
  { x: 84, y: 46, width: 104, height: 16, borderRadius: 5, kind: "text" },
  { x: 84, y: 75, width: 238, height: 16, borderRadius: 5, kind: "text" },
  { x: 84, y: 98, width: 184, height: 16, borderRadius: 5, kind: "text" },
];

const LONG_TEXT_BONES: ReadonlyArray<BoneRect> = [
  ...CARD_BONES.slice(0, 4),
  { x: 84, y: 75, width: 248, height: 16, borderRadius: 5, kind: "text" },
  { x: 84, y: 98, width: 250, height: 16, borderRadius: 5, kind: "text" },
  { x: 84, y: 121, width: 226, height: 16, borderRadius: 5, kind: "text" },
  { x: 84, y: 144, width: 206, height: 16, borderRadius: 5, kind: "text" },
];

function scaleBones(bones: ReadonlyArray<BoneRect>, scale: number): BoneRect[] {
  return bones.map((bone) => ({
    ...bone,
    x: Math.round(bone.x * scale),
    width: Math.round(bone.width * scale),
  }));
}

function BoneFixture({
  bones,
  baseColor,
  highlightColor,
  animation = "shimmer",
  renderBone,
  background = "#ffffff",
}: {
  bones: ReadonlyArray<BoneRect>;
  baseColor: string;
  highlightColor: string;
  animation?: "shimmer" | "pulse" | "none";
  renderBone?: RenderBoneFn;
  background?: string;
}): React.ReactElement {
  const progress = useSharedValue(0.52);
  const width = Math.max(...bones.map((bone) => bone.x + bone.width));
  const height = Math.max(...bones.map((bone) => bone.y + bone.height));
  return (
    <View style={{ width, height, backgroundColor: background, position: "relative" }}>
      {bones.map((rect, index) => {
        if (renderBone !== undefined) {
          const custom = renderBone(rect, {
            progress,
            baseColor,
            highlightColor,
            animation,
            index,
            total: bones.length,
          });
          if (custom !== undefined && custom !== null) {
            return <React.Fragment key={index}>{custom}</React.Fragment>;
          }
        }
        return (
          <Bone
            key={index}
            rect={rect}
            progress={progress}
            baseColor={baseColor}
            highlightColor={highlightColor}
            animation={animation}
          />
        );
      })}
    </View>
  );
}

const meta = {
  title: "Skeleton/Fabric visual contract",
  component: Skeleton,
  parameters: {
    chromatic: { pauseAnimationAtEnd: true },
    docs: {
      description: {
        component:
          "Web Storybook cannot run Fabric measurement. These stories render deterministic measured BoneRect fixtures so Chromatic covers the visual contract; native measurement is covered by the example app.",
      },
    },
  },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <BoneFixture
      bones={CARD_BONES}
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
    />
  ),
};

export const Pulse: Story = {
  render: () => (
    <BoneFixture
      bones={CARD_BONES}
      animation="pulse"
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
    />
  ),
};

export const NoAnimation: Story = {
  render: () => (
    <BoneFixture
      bones={CARD_BONES}
      animation="none"
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
    />
  ),
};

export const DarkMode: Story = {
  parameters: { backgrounds: { default: "dark" } },
  render: () => (
    <BoneFixture
      bones={CARD_BONES}
      baseColor={COLORS.dark.base}
      highlightColor={COLORS.dark.highlight}
      background="#0b0b0f"
    />
  ),
};

export const LongText: Story = {
  render: () => (
    <BoneFixture
      bones={LONG_TEXT_BONES}
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
    />
  ),
};

export const SmallScreen: Story = {
  render: () => (
    <BoneFixture
      bones={scaleBones(CARD_BONES, 0.78)}
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
    />
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
    <BoneFixture
      bones={CARD_BONES}
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
      renderBone={customRenderBone}
    />
  ),
};

export const MergedTextLines: Story = {
  render: () => (
    <BoneFixture
      bones={[
        ...CARD_BONES.slice(0, 3),
        { x: 84, y: 46, width: 238, height: 68, borderRadius: 8, kind: "text" },
      ]}
      baseColor={COLORS.light.base}
      highlightColor={COLORS.light.highlight}
    />
  ),
};

export const LoadedContent: Story = {
  render: () => (
    <Skeleton loading={false} baseColor={COLORS.light.base} highlightColor={COLORS.light.highlight}>
      <UserCard user={MOCK_USER} />
    </Skeleton>
  ),
};

export const NativeMeasurementReference: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 14, lineHeight: 20, color: "#3f3f46" }}>
        Fabric measurement does not run in this web preview. The native example app covers runtime
        measurement, loading transitions, accessibility, and Maestro flows.
      </Text>
      <UserCard user={LONG_BIO_USER} />
    </View>
  ),
};
