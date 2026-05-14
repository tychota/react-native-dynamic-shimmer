# react-native-fabric-shimmer

Dynamic shimmer skeletons for React Native. Wrap any component, the library measures it at runtime via Fabric's JSI `measureLayout`, and paints shimmer rectangles at the exact positions. The **real component IS the skeleton**.

- No build-time scan, no JSON bones, no CLI.
- Five extension points: `baseColor`/`highlightColor`, `animation`, `renderBone`, `classify`, `refineBones`.
- New Architecture only (React Native ≥ 0.76).
- React Compiler safe.
- Reduce Motion respected via `ReduceMotion.System`.
- 5.2 kB ESM / 5.3 kB CJS gzipped, zero runtime deps beyond peers.

Docs: https://tychota.github.io/react-native-fabric-shimmer

## Install

```sh
pnpm add react-native-fabric-shimmer
# peer deps (install if you don't have them yet)
pnpm add react-native-reanimated expo-linear-gradient
```

## Minimal usage

```tsx
import { Skeleton } from "react-native-fabric-shimmer";

<Skeleton loading={!user} baseColor="#eee" highlightColor="#fff">
  <UserCard user={user ?? MOCK_USER} />
</Skeleton>;
```

## Extension

```tsx
import { Skeleton, find, hide } from "react-native-fabric-shimmer";

<Skeleton
  loading={!user}
  baseColor={theme.skeletonBase}
  highlightColor={theme.skeletonHighlight}
  refineBones={(tree) => {
    const chevron = find(tree, (n) => n.type === "Chevron");
    return chevron ? hide(tree, chevron) : tree;
  }}
>
  <UserCard user={user ?? MOCK_USER} />
</Skeleton>;
```

## Debug

`dumpTree` renders the measured `BoneNode` tree as indented ASCII (type, classification, rect) — useful when tuning `classify` or `refineBones`:

```tsx
import { Skeleton, dumpTree } from "react-native-fabric-shimmer";

<Skeleton
  loading
  baseColor="#eee"
  highlightColor="#fff"
  onMeasured={(_, tree) => console.log(dumpTree(tree))}
>
  <UserCard user={MOCK_USER} />
</Skeleton>;
```

## Credits

- **[Nicușor Cîciudan — "Let's build dynamic shimmer skeletons"](https://neciudan.dev/lets-build-dynamic-shimmer-skeletons)** — original blog post establishing the "real component IS the skeleton" pattern.
- **[`0xGF/boneyard`](https://github.com/0xGF/boneyard)** — fiber-walker technique (`__internalInstanceHandle`), bone IR concept, and distinctive-container heuristic.

This library adapts those ideas to Fabric + React 19 + Reanimated 4 and ships a user-facing IR instead of fiber internals.

## License

MIT — see [LICENSE](./LICENSE).
