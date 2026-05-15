import { formatHex } from "culori";

// Tokens use OKLCH as their design source-of-truth: L (perceptual lightness)
// + C (chroma) + H (hue, degrees). The L axis is perceptually uniform — a
// step from L=92% → L=97% genuinely feels like "one step brighter," unlike
// sRGB hex pairs where the same arithmetic step on the dark vs light end
// produces very different visible differences.
//
// React Native 0.83's CSS colour parser doesn't accept `oklch(...)` strings
// natively yet (that's queued for 0.84+), so we convert each value to hex
// at module load via culori. The OKLCH parameters stay readable in source
// for designers; the consumed values are normal hex strings.
//
// Hue 286° is the cool neutral axis (slate / zinc family). Chroma is kept
// very low (≤ 0.013) so the colour reads as a neutral grey with only a
// barely-perceptible cool cast.
function oklch(l: number, c: number, h: number): string {
  return formatHex({ mode: "oklch", l, c, h }) ?? "#000";
}

const lightSkeletonBase = oklch(0.92, 0.004, 286); // ≈ Tailwind zinc-200
const lightSkeletonHighlight = oklch(0.967, 0.001, 286); // ≈ zinc-100
const darkSkeletonBase = oklch(0.27, 0.012, 286); // ≈ between zinc-800 and zinc-900
const darkSkeletonHighlight = oklch(0.37, 0.013, 286); // ≈ zinc-700

export const tokens = {
  colors: {
    light: {
      bg: "#ffffff",
      surface: oklch(0.985, 0.001, 286),
      textPrimary: oklch(0.21, 0.011, 286),
      textMuted: oklch(0.442, 0.017, 286),
      skeletonBase: lightSkeletonBase,
      skeletonHighlight: lightSkeletonHighlight,
      border: oklch(0.884, 0.005, 286),
      accent: "#2b6cff",
      error: "#d82e2e",
    },
    dark: {
      bg: oklch(0.145, 0.01, 286),
      surface: oklch(0.21, 0.011, 286),
      textPrimary: oklch(0.985, 0.001, 286),
      textMuted: oklch(0.705, 0.013, 286),
      skeletonBase: darkSkeletonBase,
      skeletonHighlight: darkSkeletonHighlight,
      border: oklch(0.33, 0.013, 286),
      accent: "#6e99ff",
      error: "#ff6b6b",
    },
  },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const,
  radius: { sm: 6, md: 12, round: 999 } as const,
  font: { sm: 13, base: 15, lg: 17, xl: 20 } as const,
} as const;

export type ColorTheme = typeof tokens.colors.light;
