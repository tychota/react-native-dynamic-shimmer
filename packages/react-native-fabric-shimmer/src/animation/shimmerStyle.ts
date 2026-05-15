// Bar fraction at 0.58 reads as a soft wash rather than a stripe. With
// the previous 0.4 fraction the highlight was a clearly-shaped band
// crossing the bone; a wider bar passes more like ambient light. The
// non-round number (not 0.5 / 0.6 / 0.65) is intentional — the eye picks
// up the asymmetry as movement rather than a metronomic beat.
const BAR_FRACTION = 0.58;

// Phase factor staggers neighbouring bones so a wave reads as travelling
// across the card. 0.42 is enough that adjacent bones feel offset
// without being so out of sync that the screen looks chaotic.
const PHASE_FACTOR = 0.42;

export type ShimmerInput = { readonly x: number; readonly width: number };

export type ShimmerOutput = {
  opacity: number;
  width: number;
  transform: ReadonlyArray<{ translateX: number }>;
};

// Smooth in/out at the edges of the sweep so the highlight enters and
// leaves gently rather than popping. A cubic ease-in-out is enough; we
// don't need a full Bezier here.
function easeInOut(t: number): number {
  "worklet";
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function shimmerStyle(rect: ShimmerInput, progress: number): ShimmerOutput {
  "worklet";
  if (rect.width <= 0) return { opacity: 0, width: 0, transform: [{ translateX: 0 }] };
  const barW = rect.width * BAR_FRACTION;
  const phase = rect.x / Math.max(1, rect.width * 4);
  const t = (progress - phase * PHASE_FACTOR + 1) % 1;
  const eased = easeInOut(t);
  const translateX = -barW + eased * (rect.width + barW);
  return { opacity: 1, width: barW, transform: [{ translateX }] };
}
