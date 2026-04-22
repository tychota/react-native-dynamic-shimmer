import { describe, it, expect } from "vitest";
import type { BoneNode } from "../../../src/types";
import { flattenTree } from "../../../src/measure/flattenTree";

function n(
  id: string,
  classification: BoneNode["classification"],
  rect = { x: 0, y: 0, width: 10, height: 10 },
  children: BoneNode[] = [],
): BoneNode {
  return { id, type: "View", classification, rect, style: {}, children };
}

describe("flattenTree", () => {
  it("emits containers before their children (pre-order)", () => {
    const tree = n("root", "container", undefined, [n("a", "leaf"), n("b", "leaf")]);
    const flat = flattenTree(tree);
    expect(flat.map((b) => b.kind)).toEqual(["container", "view", "view"]);
    expect(flat[0]!.width).toBe(10);
  });

  it("excludes transparent nodes but descends into their children", () => {
    const tree = n("root", "transparent", undefined, [
      n("a", "leaf"),
      n("b", "transparent", undefined, [n("c", "leaf")]),
    ]);
    const flat = flattenTree(tree);
    expect(flat.length).toBe(2);
  });

  it("returns [] for empty leaf with no rect size", () => {
    const tree = n("root", "leaf", { x: 0, y: 0, width: 0, height: 0 });
    expect(flattenTree(tree)).toEqual([]);
  });

  it("uses text kind for Text types", () => {
    const tree: BoneNode = {
      id: "a",
      type: "RCTText",
      classification: "leaf",
      rect: { x: 0, y: 0, width: 10, height: 10 },
      style: {},
      children: [],
    };
    const out = flattenTree(tree);
    expect(out[0]!.kind).toBe("text");
  });

  it("uses image kind for Image types", () => {
    const tree: BoneNode = {
      id: "a",
      type: "RCTImage",
      classification: "leaf",
      rect: { x: 0, y: 0, width: 10, height: 10 },
      style: {},
      children: [],
    };
    expect(flattenTree(tree)[0]!.kind).toBe("image");
  });

  it('encodes a square with half-side radius as "50%"', () => {
    const tree: BoneNode = {
      id: "a",
      type: "View",
      classification: "leaf",
      rect: { x: 0, y: 0, width: 40, height: 40 },
      style: { borderRadius: 20 },
      children: [],
    };
    expect(flattenTree(tree)[0]!.borderRadius).toBe("50%");
  });

  it("keeps numeric radius when not a perfect circle", () => {
    const tree: BoneNode = {
      id: "a",
      type: "View",
      classification: "leaf",
      rect: { x: 0, y: 0, width: 40, height: 40 },
      style: { borderRadius: 8 },
      children: [],
    };
    expect(flattenTree(tree)[0]!.borderRadius).toBe(8);
  });
});
