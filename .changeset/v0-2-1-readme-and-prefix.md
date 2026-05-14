---
"react-native-fabric-shimmer": patch
---

Polish:

- Library README enriched with the "real component IS the skeleton" framing, the `refineBones` + `find`/`hide` extension example, a `dumpTree` debug snippet, and Credits (Nicușor Cîciudan's blog post and `0xGF/boneyard`) — the npm package page now shows the same level of detail as the docs site.
- Dev-mode warning prefix renamed from `[dynamic-shimmer]` to `[fabric-shimmer]` to match the package name. Three call sites updated (`useMeasureBones` two messages, `buildBoneTree` one). Filtering for these warnings in logs needs the new prefix.

No behaviour or public-API change.
