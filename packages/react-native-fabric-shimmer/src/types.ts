import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

// ── Public types ─────────────────────────────────────────────────────────────

export type BoneKind = "text" | "image" | "view" | "container";

export type BoneRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly borderRadius: number | "50%";
  readonly kind: BoneKind;
  readonly backgroundColor?: string;
  readonly borderColor?: string;
  readonly borderWidth?: number;
};

export type AnimationKind = "shimmer" | "pulse" | "none";

// Passed to user-supplied `renderBone` callbacks. Kept separate from
// BoneProps so the callback API has access to ordering info (index, total)
// that the default Bone renderer doesn't need.
export type BoneContext = {
  readonly progress: SharedValue<number>;
  readonly baseColor: string;
  readonly highlightColor: string;
  readonly animation: AnimationKind;
  readonly index: number;
  readonly total: number;
};

// Flat scalar props. React Compiler can memoise the Bone body across
// Skeleton re-renders when these don't change (e.g. when only `loading`
// flips). Falling through to the default Bone from inside a renderBone
// callback needs to pick fields off `ctx` explicitly:
//
//   renderBone={(rect, ctx) =>
//     rect.kind === "image"
//       ? <MyImageBone rect={rect} ctx={ctx} />
//       : <Bone
//           rect={rect}
//           progress={ctx.progress}
//           baseColor={ctx.baseColor}
//           highlightColor={ctx.highlightColor}
//           animation={ctx.animation}
//         />
//   }
export type BoneProps = {
  readonly rect: BoneRect;
  readonly progress: SharedValue<number>;
  readonly baseColor: string;
  readonly highlightColor: string;
  readonly animation: AnimationKind;
};

export type PerCornerRadius = {
  readonly topLeft?: number;
  readonly topRight?: number;
  readonly bottomLeft?: number;
  readonly bottomRight?: number;
};

export type StyleHints = {
  readonly backgroundColor?: string;
  readonly borderRadius?: number | PerCornerRadius;
  readonly borderColor?: string;
  readonly borderWidth?: number;
  readonly shadowOpacity?: number;
  readonly elevation?: number;
  readonly opacity?: number;
  readonly display?: "none" | "flex";
};

export type BoneNode = {
  readonly id: string;
  readonly type: string;
  readonly classification: "leaf" | "container" | "transparent";
  readonly rect: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly style: StyleHints;
  readonly children: ReadonlyArray<BoneNode>;
};

export type FiberNode = {
  readonly type: string | Function | null;
  readonly memoizedProps: unknown;
  readonly stateNode: unknown;
  readonly child: FiberNode | null;
  readonly sibling: FiberNode | null;
  readonly return: FiberNode | null;
};

export type FiberClassification = "leaf" | "container" | "transparent" | "skip";

export type RenderBoneFn = (rect: BoneRect, ctx: BoneContext) => ReactNode;
export type ClassifyFn = (fiber: FiberNode) => FiberClassification;
export type RefineBonesFn = (tree: BoneNode) => BoneNode;

export type SkeletonProps = {
  loading: boolean;
  children: ReactNode;
  baseColor: string;
  highlightColor: string;

  animation?: AnimationKind;
  transition?: boolean | number;
  minShowDuration?: number;
  delayShowDuration?: number;

  renderBone?: RenderBoneFn;
  classify?: ClassifyFn;
  refineBones?: RefineBonesFn;

  onMeasured?: (bones: ReadonlyArray<BoneRect>) => void;

  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};
