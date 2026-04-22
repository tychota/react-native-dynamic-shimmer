import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: false,
  entry: ["src/index.ts"],
  external: ["react", "react-native", "react-native-reanimated", "expo-linear-gradient"],
  format: ["esm", "cjs"],
  sourcemap: true,
});
