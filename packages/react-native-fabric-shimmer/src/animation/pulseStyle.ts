export type PulseOutput = { opacity: number };

// Smooth sinusoidal "breathing" between MIN and 1. Cosine of progress×2π
// produces 1 at the cycle's start/end and the minimum at the midpoint,
// so the loop seam from progress=1 → 0 is invisible (both ends are
// opacity 1 already). A simple triangle wave (linear up, linear down)
// gave a noticeable hard peak; the cosine version reads as a calm pulse.
//
// MIN at 0.62 is deliberately above 0.5 — at lower values the bone
// briefly disappears against most page backgrounds, which reads as a
// flicker rather than a pulse. 0.62 keeps the bone present even at the
// dimmest point of the cycle.
const MIN_OPACITY = 0.62;

export function pulseStyle(progress: number): PulseOutput {
  "worklet";
  const wave = 0.5 - Math.cos(progress * Math.PI * 2) * 0.5; // 0..1, smooth
  const opacity = 1 - (1 - MIN_OPACITY) * wave;
  return { opacity };
}
