import type { BoneNode } from "../types";
import { hide } from "./hide";
import { union } from "./union";

let mergeCounter = 0;

function nextId(): string {
  mergeCounter += 1;
  return `merged-${mergeCounter}`;
}

export function merge(tree: BoneNode, targets: ReadonlyArray<BoneNode>): BoneNode {
  if (targets.length < 2) return tree;

  const unionRect = union(targets.map((t) => t.rect));
  if (unionRect === null) return tree;

  const merged: BoneNode = {
    id: nextId(),
    type: "merged",
    classification: "leaf",
    rect: unionRect,
    style: {},
    children: [],
  };

  const firstTarget = targets[0]!;
  const parent = findParent(tree, firstTarget);
  let next = tree;
  for (const t of targets) next = hide(next, t);
  if (parent === null) {
    return merged;
  }
  return replaceChildren(next, parent.id, (children) => [merged, ...children]);
}

function findParent(tree: BoneNode, target: BoneNode): BoneNode | null {
  for (const child of tree.children) {
    if (child === target) return tree;
    const nested = findParent(child, target);
    if (nested !== null) return nested;
  }
  return null;
}

function replaceChildren(
  tree: BoneNode,
  targetId: string,
  f: (current: ReadonlyArray<BoneNode>) => ReadonlyArray<BoneNode>,
): BoneNode {
  if (tree.id === targetId) return { ...tree, children: f(tree.children) };
  let changed = false;
  const nextChildren: BoneNode[] = [];
  for (const child of tree.children) {
    const replaced = replaceChildren(child, targetId, f);
    if (replaced !== child) changed = true;
    nextChildren.push(replaced);
  }
  return changed ? { ...tree, children: nextChildren } : tree;
}
