import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import type { BoneProps } from "./types";
import { shimmerStyle } from "./animation/shimmerStyle";
import { pulseStyle } from "./animation/pulseStyle";

export function Bone({ rect, ctx }: BoneProps): React.ReactElement {
  const isContainer = rect.kind === "container";

  const animatedStyle = useAnimatedStyle(() => {
    // Containers stay static — they represent the card surface, not a
    // loading placeholder. Only leaves (text/image/view) animate.
    if (isContainer) return { opacity: 1 };
    if (ctx.animation === "shimmer") {
      return shimmerStyle({ x: rect.x, width: rect.width }, ctx.progress.value);
    }
    if (ctx.animation === "pulse") {
      return pulseStyle(ctx.progress.value);
    }
    return { opacity: 1 };
  });

  const resolvedRadius =
    rect.borderRadius === "50%" ? Math.min(rect.width, rect.height) / 2 : rect.borderRadius;

  // Containers use the source's captured styling verbatim so the card's
  // outline is preserved as visual context. Leaves drop captured colors
  // and render as neutral placeholders (baseColor fill, hairline highlight
  // outline) — the skeleton's job is to abstract content, not mirror it.
  const backgroundColor = isContainer ? rect.backgroundColor : ctx.baseColor;
  const borderColor = isContainer ? rect.borderColor : ctx.highlightColor;
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
      {!isContainer && ctx.animation === "shimmer" ? (
        <Animated.View style={[styles.shimmerTrack, animatedStyle]}>
          <LinearGradient
            colors={["transparent", ctx.highlightColor, "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
        </Animated.View>
      ) : !isContainer && ctx.animation === "pulse" ? (
        <Animated.View
          style={[StyleSheet.absoluteFill, animatedStyle, { backgroundColor: ctx.highlightColor }]}
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
