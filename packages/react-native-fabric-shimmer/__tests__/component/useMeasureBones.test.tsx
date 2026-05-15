// @vitest-environment jsdom
import { afterEach, describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMeasureBones } from "../../src/measure/useMeasureBones";
import type { BoneNode, FiberNode } from "../../src/types";

type Rect = { x: number; y: number; width: number; height: number };

function fabricHost(rect: Rect | null = null) {
  return {
    node: { rect },
    canonical: { nativeTag: 1, viewConfig: {}, currentProps: {} },
  };
}

function installFabricUIManager(): void {
  (globalThis as { nativeFabricUIManager?: unknown }).nativeFabricUIManager = {
    measureLayout: (
      node: unknown,
      _relativeNode: unknown,
      onFail: () => void,
      onSuccess: (x: number, y: number, width: number, height: number) => void,
    ) => {
      const rect = (node as { rect?: Rect | null }).rect;
      if (rect === null || rect === undefined) onFail();
      else onSuccess(rect.x, rect.y, rect.width, rect.height);
    },
  };
}

function clearFabricUIManager(): void {
  delete (globalThis as { nativeFabricUIManager?: unknown }).nativeFabricUIManager;
}

function refFor(fiber: FiberNode) {
  return { current: { __internalInstanceHandle: fiber } };
}

function hostFiber(type: string, stateNode: unknown, child: FiberNode | null = null): FiberNode {
  return {
    type,
    memoizedProps: {},
    stateNode,
    child,
    sibling: null,
    return: null,
  };
}

function makeRef() {
  const stateNode = {
    node: { __jsiHandle: true },
    canonical: { nativeTag: 1, viewConfig: {}, currentProps: {} },
  };
  return {
    current: {
      __internalInstanceHandle: {
        type: "View",
        memoizedProps: {},
        stateNode,
        child: null,
        sibling: null,
        return: null,
      },
    },
  };
}

describe("useMeasureBones", () => {
  afterEach(() => {
    clearFabricUIManager();
    vi.restoreAllMocks();
  });

  it("returns null bones initially", () => {
    const containerRef = makeRef();
    const contentRef = makeRef();
    const { result } = renderHook(() =>
      useMeasureBones(
        containerRef as unknown as Parameters<typeof useMeasureBones>[0],
        contentRef as unknown as Parameters<typeof useMeasureBones>[1],
        false,
        {},
      ),
    );
    expect(result.current.bones).toBeNull();
  });

  it("does not measure when inactive", async () => {
    const containerRef = makeRef();
    const contentRef = makeRef();
    const { result } = renderHook(() =>
      useMeasureBones(
        containerRef as unknown as Parameters<typeof useMeasureBones>[0],
        contentRef as unknown as Parameters<typeof useMeasureBones>[1],
        false,
        {},
      ),
    );
    await act(async () => {
      result.current.handleLayout({
        nativeEvent: { layout: { x: 0, y: 0, width: 100, height: 100 } },
      } as unknown as Parameters<ReturnType<typeof useMeasureBones>["handleLayout"]>[0]);
    });
    expect(result.current.bones).toBeNull();
  });

  it("measures active Fabric children and calls onMeasured with flat bones and refined tree", async () => {
    installFabricUIManager();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(
      (cb: (time: number) => void) => {
        cb(0);
        return 1;
      },
    );

    const containerHost = fabricHost({ x: 0, y: 0, width: 120, height: 80 });
    const textHost = fabricHost({ x: 12, y: 16, width: 64, height: 18 });
    const textFiber = hostFiber("RCTText", textHost);
    const contentFiber = hostFiber("View", fabricHost(), textFiber);
    const containerFiber = hostFiber("View", containerHost);
    const onMeasured = vi.fn();
    const refineBones = (tree: BoneNode): BoneNode => ({
      ...tree,
      children: tree.children.map((child) => ({
        ...child,
        style: { ...child.style, borderRadius: 4 },
      })),
    });

    const { result } = renderHook(() =>
      useMeasureBones(refFor(containerFiber), refFor(contentFiber), true, {
        refineBones,
        onMeasured,
      }),
    );

    await act(async () => {
      result.current.handleLayout({
        nativeEvent: { layout: { x: 0, y: 0, width: 120, height: 80 } },
      } as Parameters<ReturnType<typeof useMeasureBones>["handleLayout"]>[0]);
    });

    expect(result.current.bones).toEqual([
      {
        x: 12,
        y: 16,
        width: 64,
        height: 18,
        borderRadius: 4,
        kind: "text",
      },
    ]);
    expect(onMeasured).toHaveBeenCalledTimes(1);
    expect(onMeasured.mock.calls[0]![0]).toBe(result.current.bones);
    expect(onMeasured.mock.calls[0]![1].children[0]!.style.borderRadius).toBe(4);
  });
});
