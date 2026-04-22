import type { FiberNode, PerCornerRadius, StyleHints } from "../types";

const SCALAR_KEYS: ReadonlyArray<keyof StyleHints> = [
  "backgroundColor",
  "borderColor",
  "borderWidth",
  "shadowOpacity",
  "elevation",
  "opacity",
];

type Raw = Record<string, unknown>;
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

function merge(acc: Raw, entry: unknown): void {
  if (entry === null || entry === undefined || entry === false) return;
  if (Array.isArray(entry)) {
    for (const e of entry) merge(acc, e);
    return;
  }
  if (typeof entry === "object") Object.assign(acc, entry as Raw);
}

export function extractStyle(fiber: FiberNode): StyleHints {
  const props = fiber.memoizedProps as Raw | null | undefined;
  if (props === null || props === undefined) return {};
  const raw = props["style"];
  if (raw === undefined) return {};
  const flat: Raw = {};
  merge(flat, raw);

  const out: Mutable<StyleHints> = {};
  for (const k of SCALAR_KEYS) {
    const v = flat[k];
    if (v !== undefined) (out as Raw)[k] = v;
  }
  if (flat["display"] === "none" || flat["display"] === "flex") out.display = flat["display"];

  const corners: Mutable<PerCornerRadius> = {};
  if (typeof flat["borderTopLeftRadius"] === "number")
    corners.topLeft = flat["borderTopLeftRadius"];
  if (typeof flat["borderTopRightRadius"] === "number")
    corners.topRight = flat["borderTopRightRadius"];
  if (typeof flat["borderBottomLeftRadius"] === "number")
    corners.bottomLeft = flat["borderBottomLeftRadius"];
  if (typeof flat["borderBottomRightRadius"] === "number")
    corners.bottomRight = flat["borderBottomRightRadius"];
  const hasCorners = Object.keys(corners).length > 0;
  if (hasCorners) {
    out.borderRadius = corners;
  } else if (typeof flat["borderRadius"] === "number") {
    out.borderRadius = flat["borderRadius"];
  }
  return out;
}
