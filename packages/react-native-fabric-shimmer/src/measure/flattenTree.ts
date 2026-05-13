import type { BoneNode, BoneRect, BoneKind, StyleHints } from "../types";
import { walk } from "../ir/walk";

function inferKind(type: string, hasChildren: boolean): BoneKind {
  if (
    type === "RCTText" ||
    type === "Text" ||
    type === "RawText" ||
    type === "RCTTextInput" ||
    type === "TextInput"
  )
    return "text";
  if (type === "RCTImage" || type === "Image" || type === "ImageView") return "image";
  return hasChildren ? "container" : "view";
}

function resolveRadius(style: StyleHints, width: number, height: number): BoneRect["borderRadius"] {
  const r = style.borderRadius;
  if (typeof r === "object" && r !== null) {
    const { topLeft } = r;
    return typeof topLeft === "number" ? topLeft : 0;
  }
  if (typeof r === "number") {
    const minDim = Math.min(width, height);
    if (Math.abs(width - height) <= 2 && r >= minDim / 2) return "50%";
    return r;
  }
  return 0;
}

export function flattenTree(tree: BoneNode): ReadonlyArray<BoneRect> {
  const bones: BoneRect[] = [];
  walk(tree, (node) => {
    if (node.classification === "transparent") return;
    const { width, height } = node.rect;
    if (width < 1 || height < 1) return;
    const kind = inferKind(node.type, node.children.length > 0);
    const bone: BoneRect = {
      x: node.rect.x,
      y: node.rect.y,
      width,
      height,
      borderRadius: resolveRadius(node.style, width, height),
      kind,
      ...(node.style.backgroundColor !== undefined
        ? { backgroundColor: node.style.backgroundColor }
        : {}),
      ...(node.style.borderColor !== undefined ? { borderColor: node.style.borderColor } : {}),
      ...(node.style.borderWidth !== undefined ? { borderWidth: node.style.borderWidth } : {}),
    };
    bones.push(bone);
  });
  return bones;
}
