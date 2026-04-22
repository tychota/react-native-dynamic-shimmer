import { describe, expect, it } from "vitest";
import type { BoneNode } from "../../../src/types";
import { merge } from "../../../src/ir/merge";

function node(
  id: string,
  rect = { x: 0, y: 0, width: 10, height: 10 },
  children: BoneNode[] = [],
): BoneNode {
  return {
    id,
    type: "Text",
    classification: "leaf",
    rect,
    style: {},
    children,
  };
}

describe("merge", () => {
  it("returns tree unchanged for empty targets", () => {
    const tree = node("a");
    expect(merge(tree, [])).toBe(tree);
  });

  it("returns tree unchanged for a single target (no-op)", () => {
    const a = node("a");
    const tree = node("root", { x: 0, y: 0, width: 10, height: 10 }, [a]);
    expect(merge(tree, [a])).toBe(tree);
  });

  it("merges two sibling targets into one bone at their union rect", () => {
    const a = node("a", { x: 0, y: 0, width: 10, height: 10 });
    const b = node("b", { x: 20, y: 0, width: 10, height: 10 });
    const tree = node("root", { x: 0, y: 0, width: 30, height: 10 }, [a, b]);
    const result = merge(tree, [a, b]);
    expect(result.children).toHaveLength(1);
    expect(result.children[0]!.rect).toEqual({ x: 0, y: 0, width: 30, height: 10 });
    expect(result.children[0]!.classification).toBe("leaf");
    expect(result.children[0]!.type).toBe("merged");
  });

  it("does not mutate the input", () => {
    const a = node("a");
    const b = node("b");
    const tree = node("root", { x: 0, y: 0, width: 30, height: 10 }, [a, b]);
    const before = tree.children.length;
    merge(tree, [a, b]);
    expect(tree.children.length).toBe(before);
  });
});
