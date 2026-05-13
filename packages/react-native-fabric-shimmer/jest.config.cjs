// Dedicated Jest config for Reassure perf tests only. Vitest remains the
// main runner for unit + component tests; Jest is invoked solely by
// `reassure` (the perf CLI), which doesn't support Vitest.
//
// Reassure runs `*.perf.{ts,tsx}` files. They live under `__perf__/` and
// never overlap with the Vitest test patterns under `__tests__/`.
//
// Mocks for expo-linear-gradient and react-native-reanimated live in
// `__perf__/setup.ts`. The react-native surface uses the same mock as
// Vitest (`__mocks__/react-native.ts`).

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/__perf__/**/*.perf.{ts,tsx}"],
  setupFiles: ["<rootDir>/__perf__/setup.ts"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", tsx: true },
          transform: { react: { runtime: "automatic" } },
        },
      },
    ],
  },
  moduleNameMapper: {
    "^react-native$": "<rootDir>/__mocks__/react-native.ts",
  },
  globals: {
    __DEV__: true,
  },
};
