# react-native-dynamic-shimmer

Dynamic shimmer skeletons for React Native. Wrap any component, the library measures
it at runtime via Fabric's JSI `measureLayout` and paints shimmer rectangles at the
exact positions.

- No build-time scan, no JSON bones, no CLI.
- New Architecture only (React Native ≥ 0.76).
- Peer deps: `react ≥ 19`, `react-native-reanimated ≥ 3.17`, `expo-linear-gradient ≥ 15`.

See https://tychota.github.io/react-native-dynamic-shimmer for docs.

## Install

```sh
pnpm add react-native-dynamic-shimmer
```

## Use

```tsx
import { Skeleton } from "react-native-dynamic-shimmer";

<Skeleton loading={!user} baseColor="#eee" highlightColor="#fff">
  <UserCard user={user ?? MOCK_USER} />
</Skeleton>;
```

## License

MIT — see [LICENSE](./LICENSE).
