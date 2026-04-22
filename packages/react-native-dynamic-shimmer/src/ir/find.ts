import type { BoneNode } from "../types";
import { walk } from "./walk";

export function find(tree: BoneNode, predicate: (node: BoneNode) => boolean): BoneNode | null {
  let result: BoneNode | null = null;
  walk(tree, (node) => {
    if (result === null && predicate(node)) result = node;
  });
  return result;
}

export function findAll(tree: BoneNode, predicate: (node: BoneNode) => boolean): BoneNode[] {
  const out: BoneNode[] = [];
  walk(tree, (node) => {
    if (predicate(node)) out.push(node);
  });
  return out;
}
