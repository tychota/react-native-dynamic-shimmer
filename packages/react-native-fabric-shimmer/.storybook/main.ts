import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-native-web-vite";

const shim = (rel: string) => fileURLToPath(new URL(`./shims/${rel}`, import.meta.url));

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: { name: "@storybook/react-native-web-vite", options: {} },
  core: { disableTelemetry: true },
  // RN imports redirect to react-native-web. Reanimated and
  // expo-linear-gradient are replaced by local web shims so stories render
  // without any native bindings. Aliases use absolute paths so Vite does
  // NOT treat them as package-prefix rewrites — otherwise sub-path imports
  // (e.g. reanimated's internal worklet validator) try to resolve relative
  // to the shim file and crash.
  //
  // We replace cfg.resolve.alias entirely rather than spread it: Vite's
  // alias may be either an array of {find, replacement} OR a plain object,
  // and merging the two shapes is ill-defined. Storybook's RN-web preset
  // already redirects react-native → react-native-web; our overrides do
  // the same plus the two extra shims, so a clean replace is safe.
  viteFinal: (cfg) => ({
    ...cfg,
    resolve: {
      ...cfg.resolve,
      alias: {
        "react-native": "react-native-web",
        "react-native-reanimated": shim("reanimated.tsx"),
        "expo-linear-gradient": shim("LinearGradient.tsx"),
      },
    },
  }),
};

export default config;
