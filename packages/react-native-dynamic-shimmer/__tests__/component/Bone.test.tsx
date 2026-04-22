import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => React.createElement("LinearGradient", props),
}));

// react-native-reanimated is mocked in __tests__/setup.ts. Augment that mock
// with an Animated.View component the test can render. We can't use
// vi.mock here without re-declaring the entire module — so instead,
// component rendering goes through React.createElement on the function
// directly, sidestepping the JSX runtime's lookup of Animated.View.
import { Bone } from "../../src/Bone";
import type { BoneRect, BoneContext, BoneKind } from "../../src/types";

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

function makeCtx(over: Partial<BoneContext> = {}): BoneContext {
  return {
    progress: { value: 0 } as unknown as BoneContext["progress"],
    baseColor: "#aaa",
    highlightColor: "#eee",
    animation: "shimmer",
    index: 0,
    total: 1,
    ...over,
  };
}

// Walk a React element tree, collecting every descendant element so tests
// can search by type without rendering through React DOM.
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
    const tree = Bone({ rect: makeRect(), ctx: makeCtx() });
    expect(React.isValidElement(tree)).toBe(true);
  });

  it("positions the bone at the rect's (x, y) with the given size", () => {
    const tree = Bone({ rect: makeRect({ x: 12, y: 34, width: 56, height: 78 }), ctx: makeCtx() });
    const style = flatStyle((tree.props as { style?: unknown }).style);
    expect(style["left"]).toBe(12);
    expect(style["top"]).toBe(34);
    expect(style["width"]).toBe(56);
    expect(style["height"]).toBe(78);
  });

  it("uses baseColor for leaf fill", () => {
    const tree = Bone({ rect: makeRect(), ctx: makeCtx({ baseColor: "#123456" }) });
    const style = flatStyle((tree.props as { style?: unknown }).style);
    expect(style["backgroundColor"]).toBe("#123456");
  });

  it("uses captured backgroundColor for containers (not baseColor)", () => {
    const tree = Bone({
      rect: makeRect({ kind: "container" satisfies BoneKind, backgroundColor: "#fafafa" }),
      ctx: makeCtx({ baseColor: "#aaa" }),
    });
    const style = flatStyle((tree.props as { style?: unknown }).style);
    expect(style["backgroundColor"]).toBe("#fafafa");
  });

  it("renders a LinearGradient track for shimmer leaves", () => {
    const tree = Bone({ rect: makeRect(), ctx: makeCtx({ animation: "shimmer" }) });
    expect(findByType(tree, isLinearGradient)).toBeDefined();
  });

  it("does NOT render a LinearGradient for containers (static)", () => {
    const tree = Bone({
      rect: makeRect({ kind: "container" satisfies BoneKind }),
      ctx: makeCtx({ animation: "shimmer" }),
    });
    expect(findByType(tree, isLinearGradient)).toBeUndefined();
  });

  it("does NOT render a LinearGradient for pulse animation", () => {
    const tree = Bone({ rect: makeRect(), ctx: makeCtx({ animation: "pulse" }) });
    expect(findByType(tree, isLinearGradient)).toBeUndefined();
  });

  it("does NOT render a LinearGradient when animation is none", () => {
    const tree = Bone({ rect: makeRect(), ctx: makeCtx({ animation: "none" }) });
    expect(findByType(tree, isLinearGradient)).toBeUndefined();
  });

  it("resolves '50%' borderRadius to half the smaller dimension", () => {
    const tree = Bone({
      rect: makeRect({ width: 40, height: 60, borderRadius: "50%" }),
      ctx: makeCtx(),
    });
    const style = flatStyle((tree.props as { style?: unknown }).style);
    expect(style["borderRadius"]).toBe(20);
  });

  it("preserves numeric borderRadius unchanged", () => {
    const tree = Bone({ rect: makeRect({ borderRadius: 8 }), ctx: makeCtx() });
    const style = flatStyle((tree.props as { style?: unknown }).style);
    expect(style["borderRadius"]).toBe(8);
  });
});
