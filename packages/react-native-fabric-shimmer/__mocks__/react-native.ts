/**
 * Minimal react-native mock for Vitest / jsdom environment.
 * Only exposes what @testing-library/react-native actually uses.
 */
import React from "react";

export const StyleSheet = {
  flatten: (style: unknown) => {
    if (style === null || style === undefined) return undefined;
    if (Array.isArray(style)) {
      return style.reduce<Record<string, unknown>>(
        (acc, s) => Object.assign(acc, StyleSheet.flatten(s)),
        {},
      );
    }
    if (typeof style === "object") return { ...(style as Record<string, unknown>) };
    return undefined;
  },
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
  hairlineWidth: 0.5,
  absoluteFill: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  absoluteFillObject: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
};

type HostProps = Record<string, unknown> & { children?: React.ReactNode };

function host(name: string, element: keyof React.JSX.IntrinsicElements = "div") {
  const Component = React.forwardRef<unknown, HostProps>((props, ref) => {
    const { children, style } = props;
    return React.createElement(
      element,
      {
        ref,
        style: StyleSheet.flatten(style) as React.CSSProperties | undefined,
        "data-rn": name,
      },
      children,
    );
  });
  Component.displayName = name;
  return Component;
}

export const View = host("View");
export const Text = host("Text", "span");
export const Image = host("Image", "img");
export const Pressable = host("Pressable", "button");
export const TouchableOpacity = host("TouchableOpacity", "button");
export const TouchableHighlight = host("TouchableHighlight", "button");
export const TouchableWithoutFeedback = host("TouchableWithoutFeedback", "button");
export const ScrollView = host("ScrollView");
export const FlatList = host("FlatList");
export const SectionList = host("SectionList");
export const Modal = host("Modal");
export const ActivityIndicator = host("ActivityIndicator");
export const TextInput = host("TextInput", "input");
export const Switch = host("Switch", "input");
export const SafeAreaView = host("SafeAreaView");
export const KeyboardAvoidingView = host("KeyboardAvoidingView");

export const Platform = {
  OS: "ios",
  Version: 0,
  select: <T extends Record<string, unknown>>(obj: T): unknown => obj.ios ?? obj.default,
  isPad: false,
  isTVOS: false,
  isTV: false,
};

export const Dimensions = {
  get: (_dim: string) => ({ width: 375, height: 667, scale: 2, fontScale: 1 }),
  addEventListener: () => ({ remove: () => {} }),
  set: () => {},
};

export const PixelRatio = {
  get: () => 2,
  getFontScale: () => 1,
  getPixelSizeForLayoutSize: (size: number) => size * 2,
  roundToNearestPixel: (size: number) => Math.round(size * 2) / 2,
};

export const AccessibilityInfo = {
  addEventListener: () => ({ remove: () => {} }),
  announceForAccessibility: () => {},
  isReduceMotionEnabled: async () => false,
  isScreenReaderEnabled: async () => false,
};

export const NativeModules = {};
export const NativeEventEmitter = class {
  addListener() {
    return { remove: () => {} };
  }
};
export const DeviceEventEmitter = { addListener: () => ({ remove: () => {} }) };

export const Animated = {
  Value: class {
    setValue(_v: number) {}
  },
  View: host("Animated.View"),
  Text: host("Animated.Text", "span"),
  Image: host("Animated.Image", "img"),
  timing: () => ({ start: () => {}, stop: () => {} }),
  spring: () => ({ start: () => {}, stop: () => {} }),
  decay: () => ({ start: () => {}, stop: () => {} }),
  sequence: () => ({ start: () => {}, stop: () => {} }),
  parallel: () => ({ start: () => {}, stop: () => {} }),
  createAnimatedComponent: (c: unknown) => c,
};

export const I18nManager = { isRTL: false, forceRTL: () => {}, allowRTL: () => {} };
export const BackHandler = { addEventListener: () => ({ remove: () => {} }), exitApp: () => {} };
export const Alert = { alert: () => {}, prompt: () => {} };
export const Keyboard = {
  dismiss: () => {},
  addListener: () => ({ remove: () => {} }),
};

export const useWindowDimensions = () => ({ width: 375, height: 667, scale: 2, fontScale: 1 });
export const useColorScheme = () => "light";

export const findNodeHandle = () => null;
export const UIManager = {};
export const requireNativeComponent = () => "View";

export default {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  SectionList,
  Modal,
  ActivityIndicator,
  TextInput,
  Switch,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  PixelRatio,
  AccessibilityInfo,
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
  Animated,
  I18nManager,
  BackHandler,
  Alert,
  Keyboard,
  useWindowDimensions,
  useColorScheme,
  findNodeHandle,
  UIManager,
  requireNativeComponent,
};
