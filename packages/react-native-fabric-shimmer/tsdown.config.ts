import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: false,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  deps: {
    neverBundle: ["react", "react-native", "react-native-reanimated", "expo-linear-gradient"],
  },
});
