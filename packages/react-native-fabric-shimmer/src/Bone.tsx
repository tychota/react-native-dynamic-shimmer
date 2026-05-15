import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import type { BoneProps } from "./types";
import { shimmerStyle } from "./animation/shimmerStyle";
import { pulseStyle } from "./animation/pulseStyle";

// Bone takes flat scalar props instead of a nested `ctx` object so React
// Compiler can memoise it across Skeleton re-renders. With the old
// `{rect, ctx}` shape, `ctx` was rebuilt inline in Skeleton's map
// callback — a fresh object every render — and Compiler couldn't
// deduplicate it, so every Bone re-ran on every parent state change. The
// Profiler showed this as the 3.4ms tax on each loading-state transition.
export function Bone({
  rect,
  progress,
  baseColor,
  highlightColor,
  animation,
}: BoneProps): React.ReactElement {
  const isContainer = rect.kind === "container";

  const animatedStyle = useAnimatedStyle(() => {
    // Containers stay static — they represent the card surface, not a
    // loading placeholder. Only leaves (text/image/view) animate.
    if (isContainer) return { opacity: 1 };
    if (animation === "shimmer") {
      return shimmerStyle({ x: rect.x, width: rect.width }, progress.value);
    }
    if (animation === "pulse") {
      return pulseStyle(progress.value);
    }
    return { opacity: 1 };
  });

  const resolvedRadius =
    rect.borderRadius === "50%" ? Math.min(rect.width, rect.height) / 2 : rect.borderRadius;

  // Containers use the source's captured styling verbatim so the card's
  // outline is preserved as visual context. Leaves drop captured colors
  // and render as neutral placeholders (baseColor fill, hairline highlight
  // outline) — the skeleton's job is to abstract content, not mirror it.
  const backgroundColor = isContainer ? rect.backgroundColor : baseColor;
  const borderColor = isContainer ? rect.borderColor : highlightColor;
  const borderWidth = isContainer ? rect.borderWidth : StyleSheet.hairlineWidth;

  return (
    <View
      style={[
        styles.bone,
        {
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
          borderRadius: resolvedRadius,
          ...(backgroundColor !== undefined ? { backgroundColor } : {}),
          ...(borderColor !== undefined ? { borderColor } : {}),
          ...(borderWidth !== undefined ? { borderWidth } : {}),
        },
      ]}
    >
      {!isContainer && animation === "shimmer" ? (
        <Animated.View style={[styles.shimmerTrack, animatedStyle]}>
          <LinearGradient
            colors={["transparent", highlightColor, "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
        </Animated.View>
      ) : !isContainer && animation === "pulse" ? (
        <Animated.View
          style={[StyleSheet.absoluteFill, animatedStyle, { backgroundColor: highlightColor }]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bone: { position: "absolute", overflow: "hidden" },
  shimmerTrack: { position: "absolute", top: 0, bottom: 0 },
  gradient: { flex: 1 },
});
