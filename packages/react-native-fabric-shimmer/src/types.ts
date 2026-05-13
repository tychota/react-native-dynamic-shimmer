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

export type BoneContext = {
  readonly progress: SharedValue<number>;
  readonly baseColor: string;
  readonly highlightColor: string;
  readonly animation: AnimationKind;
  readonly index: number;
  readonly total: number;
};

export type BoneProps = {
  readonly rect: BoneRect;
  readonly ctx: BoneContext;
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
