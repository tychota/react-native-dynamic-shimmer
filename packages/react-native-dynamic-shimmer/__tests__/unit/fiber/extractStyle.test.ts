import { describe, expect, it } from "vitest";
import { extractStyle } from "../../../src/fiber/extractStyle";

const fiber = (style: unknown) => ({ memoizedProps: { style } }) as never;

describe("extractStyle", () => {
  it("returns {} when no style", () => {
    expect(extractStyle({ memoizedProps: {} } as never)).toEqual({});
  });

  it("returns {} when memoizedProps is null or undefined", () => {
    expect(extractStyle({ memoizedProps: null } as never)).toEqual({});
    expect(extractStyle({ memoizedProps: undefined } as never)).toEqual({});
  });

  it("returns flat object style", () => {
    expect(extractStyle(fiber({ backgroundColor: "#fff", borderRadius: 8 }))).toEqual({
      backgroundColor: "#fff",
      borderRadius: 8,
    });
  });

  it("flattens array styles (later entries override earlier)", () => {
    expect(
      extractStyle(fiber([{ backgroundColor: "#fff", borderRadius: 8 }, { borderRadius: 12 }])),
    ).toEqual({ backgroundColor: "#fff", borderRadius: 12 });
  });

  it("flattens nested arrays", () => {
    expect(
      extractStyle(fiber([{ backgroundColor: "#fff" }, [{ borderRadius: 8 }, { borderWidth: 1 }]])),
    ).toEqual({ backgroundColor: "#fff", borderRadius: 8, borderWidth: 1 });
  });

  it("ignores null/false entries", () => {
    expect(
      extractStyle(fiber([{ backgroundColor: "#fff" }, null, false, { borderRadius: 8 }])),
    ).toEqual({ backgroundColor: "#fff", borderRadius: 8 });
  });

  it("extracts per-corner borderRadius", () => {
    expect(extractStyle(fiber({ borderTopLeftRadius: 4, borderBottomRightRadius: 8 }))).toEqual({
      borderRadius: { topLeft: 4, bottomRight: 8 },
    });
  });
});
