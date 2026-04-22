import type { BoneNode } from "../types";

export function walk(
  tree: BoneNode,
  visit: (node: BoneNode, path: ReadonlyArray<BoneNode>) => void,
): void {
  const stack: Array<{ node: BoneNode; path: ReadonlyArray<BoneNode> }> = [
    { node: tree, path: [] },
  ];
  while (stack.length > 0) {
    const top = stack.pop()!;
    visit(top.node, top.path);
    const childPath = [...top.path, top.node];
    // Push in reverse so leftmost child is processed first
    for (let i = top.node.children.length - 1; i >= 0; i--) {
      stack.push({ node: top.node.children[i]!, path: childPath });
    }
  }
}
