import { describe, expect, it } from "vitest";
import type { BoneNode } from "../../../src/types";
import { find, findAll } from "../../../src/ir/find";

function node(id: string, type: string, children: BoneNode[] = []): BoneNode {
  return {
    id,
    type,
    classification: "leaf",
    rect: { x: 0, y: 0, width: 10, height: 10 },
    style: {},
    children,
  };
}

describe("find", () => {
  const tree = node("a", "View", [node("b", "Text"), node("c", "View", [node("d", "Text")])]);

  it("returns the first match in depth-first order", () => {
    expect(find(tree, (n) => n.type === "Text")?.id).toBe("b");
  });

  it("returns null when no match", () => {
    expect(find(tree, (n) => n.type === "Image")).toBeNull();
  });
});

describe("findAll", () => {
  const tree = node("a", "View", [node("b", "Text"), node("c", "View", [node("d", "Text")])]);

  it("returns all matches in depth-first order", () => {
    expect(findAll(tree, (n) => n.type === "Text").map((n) => n.id)).toEqual(["b", "d"]);
  });

  it("returns empty array when no match", () => {
    expect(findAll(tree, (n) => n.type === "Image")).toEqual([]);
  });
});
