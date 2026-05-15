import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => React.createElement("LinearGradient", props),
}));

// react-native-reanimated is mocked in __tests__/setup.ts.
import { Bone } from "../../src/Bone";
import type { AnimationKind, BoneProps, BoneRect, BoneKind } from "../../src/types";

function makeRect(over: Partial<BoneRect> = {}): BoneRect {
  return {
    x: 10,
    y: 20,
    width: 80,
    height: 40,
    borderRadius: 8,
    kind: "view",
    ...over,
  };
}

function makeProps(
  over: Partial<Omit<BoneProps, "rect">> & { rect?: Partial<BoneRect> } = {},
): BoneProps {
  const { rect: rectOver, ...restOver } = over;
  return {
    rect: makeRect(rectOver ?? {}),
    progress: { value: 0 } as unknown as BoneProps["progress"],
    baseColor: "#aaa",
    highlightColor: "#eee",
    animation: "shimmer" satisfies AnimationKind,
    ...restOver,
  };
}

function collectElements(
  node: React.ReactNode,
  acc: React.ReactElement[] = [],
): React.ReactElement[] {
  if (node === null || node === undefined || typeof node === "boolean") return acc;
  if (Array.isArray(node)) {
    for (const child of node) collectElements(child, acc);
    return acc;
  }
  if (typeof node === "string" || typeof node === "number") return acc;
  if (React.isValidElement(node)) {
    acc.push(node);
    const children = (node.props as { children?: React.ReactNode }).children;
    if (children !== undefined) collectElements(children, acc);
  }
  return acc;
}

function findByType(
  tree: React.ReactElement,
  predicate: (t: unknown) => boolean,
): React.ReactElement | undefined {
  return collectElements(tree).find((el) => predicate(el.type));
}

function isLinearGradient(t: unknown): boolean {
  if (typeof t === "string") return t === "LinearGradient";
  if (typeof t === "function")
    return (
      (t as { name?: string; displayName?: string }).displayName === "LinearGradient" ||
      (t as { name?: string }).name === "LinearGradient"
    );
  return false;
}

function flatStyle(style: unknown): Record<string, unknown> {
  if (style === null || style === undefined) return {};
  if (Array.isArray(style))
    return style.reduce<Record<string, unknown>>((acc, s) => Object.assign(acc, flatStyle(s)), {});
  if (typeof style === "object") return { ...(style as Record<string, unknown>) };
  return {};
}

describe("Bone", () => {
  it("returns a valid React element for a leaf rect", () => {
    const tree = Bone(makeProps());
    expect(React.isValidElement(tree)).toBe(true);
  });

  it("positions the bone at the rect's (x, y) with the given size", () => {
    const tree = Bone(makeProps({ rect: { x: 12, y: 34, width: 56, height: 78 } }));
    const style = flatStyle((tree.props as { style?: unknown }).style);
    expect(style["left"]).toBe(12);
    expect(style["top"]).toBe(34);
    expect(style["width"]).toBe(56);
    expect(style["height"]).toBe(78);
  });

  it("uses baseColor for leaf fill", () => {
    const tree = Bone(makeProps({ baseColor: "#123456" }));
    const style = flatStyle((tree.props as { style?: unknown }).style);
    expect(style["backgroundColor"]).toBe("#123456");
  });

  it("uses captured backgroundColor for containers (not baseColor)", () => {
    const tree = Bone(
      makeProps({
        rect: { kind: "container" satisfies BoneKind, backgroundColor: "#fafafa" },
        baseColor: "#aaa",
      }),
    );
    const style = flatStyle((tree.props as { style?: unknown }).style);
    expect(style["backgroundColor"]).toBe("#fafafa");
  });

  it("renders a LinearGradient track for shimmer leaves", () => {
    const tree = Bone(makeProps({ animation: "shimmer" }));
    expect(findByType(tree, isLinearGradient)).toBeDefined();
  });

  it("does NOT render a LinearGradient for containers (static)", () => {
    const tree = Bone(
      makeProps({ rect: { kind: "container" satisfies BoneKind }, animation: "shimmer" }),
    );
    expect(findByType(tree, isLinearGradient)).toBeUndefined();
  });

  it("does NOT render a LinearGradient for pulse animation", () => {
    const tree = Bone(makeProps({ animation: "pulse" }));
    expect(findByType(tree, isLinearGradient)).toBeUndefined();
  });

  it("does NOT render a LinearGradient when animation is none", () => {
    const tree = Bone(makeProps({ animation: "none" }));
    expect(findByType(tree, isLinearGradient)).toBeUndefined();
  });

  it("resolves '50%' borderRadius to half the smaller dimension", () => {
    const tree = Bone(makeProps({ rect: { width: 40, height: 60, borderRadius: "50%" } }));
    const style = flatStyle((tree.props as { style?: unknown }).style);
    expect(style["borderRadius"]).toBe(20);
  });

  it("preserves numeric borderRadius unchanged", () => {
    const tree = Bone(makeProps({ rect: { borderRadius: 8 } }));
    const style = flatStyle((tree.props as { style?: unknown }).style);
    expect(style["borderRadius"]).toBe(8);
  });
});
