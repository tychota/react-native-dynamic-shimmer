import { describe, expect, it } from "vitest";
import type { BoneNode } from "../../../src/types";
import { walk } from "../../../src/ir/walk";

function node(id: string, children: BoneNode[] = []): BoneNode {
  return {
    id,
    type: "View",
    classification: "leaf",
    rect: { x: 0, y: 0, width: 10, height: 10 },
    style: {},
    children,
  };
}

describe("walk", () => {
  it("visits a single node", () => {
    const visited: string[] = [];
    walk(node("a"), (n) => visited.push(n.id));
    expect(visited).toEqual(["a"]);
  });

  it("visits in depth-first pre-order", () => {
    const tree = node("a", [node("b", [node("c"), node("d")]), node("e")]);
    const order: string[] = [];
    walk(tree, (n) => order.push(n.id));
    expect(order).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("passes path of ancestors (root-first, excluding current)", () => {
    const tree = node("a", [node("b", [node("c")])]);
    const paths: Record<string, string[]> = {};
    walk(tree, (n, path) => {
      paths[n.id] = path.map((p) => p.id);
    });
    expect(paths).toEqual({ a: [], b: ["a"], c: ["a", "b"] });
  });
});
