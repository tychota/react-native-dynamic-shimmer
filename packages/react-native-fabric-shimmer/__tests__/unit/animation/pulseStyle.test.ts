import { describe, it, expect } from "vitest";
import { pulseStyle } from "../../../src/animation/pulseStyle";

describe("pulseStyle", () => {
  // Cosine wave between MIN_OPACITY (0.62) and 1. Progress 0 and 1 are the
  // bright peaks (so the loop seam from 1 → 0 is invisible); the trough
  // sits at progress 0.5.
  it("returns opacity 1 at progress 0 (peak)", () => {
    expect(pulseStyle(0).opacity).toBeCloseTo(1, 2);
  });

  it("returns the minimum opacity at progress 0.5 (trough)", () => {
    expect(pulseStyle(0.5).opacity).toBeCloseTo(0.62, 2);
  });

  it("returns opacity 1 at progress 1 (peak — same as progress 0)", () => {
    expect(pulseStyle(1).opacity).toBeCloseTo(1, 2);
  });

  it("stays within the 0.62..1 range across the cycle", () => {
    for (let p = 0; p <= 1; p += 0.05) {
      const o = pulseStyle(p).opacity;
      expect(o).toBeGreaterThanOrEqual(0.62 - 0.001);
      expect(o).toBeLessThanOrEqual(1 + 0.001);
    }
  });
});
