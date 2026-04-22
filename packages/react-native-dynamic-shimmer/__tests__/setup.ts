// Vitest setup. Node environment for unit tests; component tests override
// via `// @vitest-environment jsdom`.

export {
  // __DEV__ is already declared by @types/react-native as a global `const`.
  // In a Node test environment it's undefined by default. Cast through unknown
  // to override the const declaration at runtime.
};
(globalThis as unknown as { __DEV__: boolean }).__DEV__ = true;
