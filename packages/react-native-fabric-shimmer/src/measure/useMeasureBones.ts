import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { LayoutChangeEvent } from "react-native";
import type { BoneRect, BoneNode, ClassifyFn, RefineBonesFn } from "../types";
import { getFiber } from "../fiber/getFiber";
import { defaultClassify } from "../fiber/defaultClassify";
import { buildBoneTree } from "./buildBoneTree";
import { measureTree } from "./measureTree";
import { flattenTree } from "./flattenTree";
import { getFabricUIManager, isFabricHost } from "../platform/fabric";

export type UseMeasureBonesOptions = {
  classify?: ClassifyFn;
  refineBones?: RefineBonesFn;
  onMeasured?: (bones: ReadonlyArray<BoneRect>) => void;
};

export type UseMeasureBonesResult = {
  bones: ReadonlyArray<BoneRect> | null;
  handleLayout: (e: LayoutChangeEvent) => void;
};

function devWarn(message: string): void {
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.warn(`[fabric-shimmer] ${message}`);
  }
}

function devLog(message: string): void {
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log(`[fabric-shimmer] ${message}`);
  }
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
    } else {
      resolve();
    }
  });
}

// containerRef: the measurement origin — bones' (x, y) are relative to it.
// contentRef:   the walk root — typically the library's own hidden wrapper
//               over the user's children. Not classified, always descended.
export function useMeasureBones(
  containerRef: RefObject<unknown>,
  contentRef: RefObject<unknown>,
  active: boolean,
  options: UseMeasureBonesOptions,
): UseMeasureBonesResult {
  const [bones, setBones] = useState<ReadonlyArray<BoneRect> | null>(null);
  const runIdRef = useRef(0);
  const lastSizeRef = useRef<{ width: number; height: number } | null>(null);
  const lastLoggedCountRef = useRef<number | null>(null);

  // Keep options fresh in a ref so handleLayout's identity doesn't churn
  // every render (callers typically pass a fresh object literal each time).
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Reset the size cache when `active` toggles — a new activation should
  // always measure at least once, even at the same size.
  useEffect(() => {
    if (!active) {
      lastSizeRef.current = null;
      lastLoggedCountRef.current = null;
    }
  }, [active]);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (!active) return;
      const { width, height } = e.nativeEvent.layout;
      const last = lastSizeRef.current;
      if (last !== null && Math.abs(last.width - width) < 1 && Math.abs(last.height - height) < 1)
        return;
      lastSizeRef.current = { width, height };

      const runId = ++runIdRef.current;
      void (async () => {
        // Wait one frame so descendant native layout has completed — async
        // image sizing, nested layout passes, etc. onLayout fires on the
        // wrapper before children are guaranteed to have their Fabric nodes
        // positioned.
        await nextFrame();

        if (runId !== runIdRef.current) return;

        const container = containerRef.current;
        const content = contentRef.current;
        if (container === null || container === undefined) {
          devWarn("containerRef.current is null — skipping measurement.");
          return;
        }
        if (content === null || content === undefined) {
          devWarn("contentRef.current is null — skipping measurement.");
          return;
        }

        const containerFiber = getFiber(container);
        if (containerFiber === null) {
          devWarn(
            "containerRef has no fiber instance. Make sure the ref is on a host component " +
              "(native <View>) and add collapsable={false} so Fabric doesn't flatten it away.",
          );
          return;
        }
        const contentFiber = getFiber(content);
        if (contentFiber === null) {
          devWarn(
            "contentRef has no fiber instance. Add collapsable={false} on the content wrapper.",
          );
          return;
        }

        const containerStateNode = containerFiber.stateNode;
        if (!isFabricHost(containerStateNode)) {
          devWarn(
            "Fabric state node not found on container. Enable the New Architecture " +
              "(newArchEnabled=true) and rebuild the native binaries.",
          );
          return;
        }
        if (getFabricUIManager() === null) {
          devWarn(
            "global.nativeFabricUIManager is not available. The app may still be on the " +
              "legacy renderer even though Fabric state nodes are present.",
          );
          return;
        }

        const opts = optionsRef.current;
        const { tree, targets } = buildBoneTree(contentFiber, opts.classify ?? defaultClassify);
        if (targets.size === 0) {
          devWarn(
            `No measurable bones found under contentRef (container ${width.toFixed(0)}×${height.toFixed(0)}). ` +
              "Check that children render host components and that your classify function " +
              "labels at least one fiber as 'leaf' or 'container'.",
          );
          return;
        }

        const measured: BoneNode = await measureTree(tree, targets, containerStateNode);
        if (runId !== runIdRef.current) return;

        let refined = measured;
        if (opts.refineBones !== undefined) {
          try {
            refined = opts.refineBones(measured);
          } catch (err) {
            devWarn("refineBones threw; using unrefined tree");
            if (typeof __DEV__ !== "undefined" && __DEV__) console.error(err);
          }
        }

        const flat = flattenTree(refined);
        if (runId !== runIdRef.current) return;

        // Only log when the bone count actually changes — prevents spam when
        // Fabric re-fires onLayout at the same size during overlay animation.
        if (lastLoggedCountRef.current !== flat.length) {
          devLog(`Measured ${flat.length} bone(s) under ${width.toFixed(0)}×${height.toFixed(0)}`);
          lastLoggedCountRef.current = flat.length;
        }

        setBones(flat);
        opts.onMeasured?.(flat);
      })();
    },
    [active, containerRef, contentRef],
  );

  return { bones, handleLayout };
}
