// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMeasureBones } from "../../src/measure/useMeasureBones";

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
});
