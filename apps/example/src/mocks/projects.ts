export type Project = {
  id: string;
  name: string;
  owner: string;
  status: "active" | "paused" | "archived";
  description: string;
  metrics: {
    stars: number;
    forks: number;
    issues: number;
    contributors: number;
  };
  tags: ReadonlyArray<string>;
  avatarUrl: string;
};

const NAMES = [
  "Atlas",
  "Beacon",
  "Cipher",
  "Driftwood",
  "Ember",
  "Flux",
  "Glacier",
  "Halcyon",
  "Indigo",
  "Juniper",
  "Kestrel",
  "Lumen",
  "Mosaic",
  "Nebula",
  "Onyx",
];
const SUFFIXES = ["Lab", "Forge", "Works", "Studio", "Collective", "Co"];
const OWNERS = ["alice", "bob", "carol", "dave", "eve", "fox", "ghost"];
const TAGS = [
  "typescript",
  "react",
  "fabric",
  "ios",
  "android",
  "monorepo",
  "ci",
  "wip",
  "stable",
  "v0",
];
const STATUSES: Project["status"][] = ["active", "paused", "archived"];

// Deterministic pseudo-random — same n always produces the same list.
// Important so React Compiler memoization isn't fighting reference instability.
function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function generateProjects(count: number): ReadonlyArray<Project> {
  const r = rng(42);
  const out: Project[] = [];
  for (let i = 0; i < count; i += 1) {
    const name = NAMES[Math.floor(r() * NAMES.length)]!;
    const suffix = SUFFIXES[Math.floor(r() * SUFFIXES.length)]!;
    const owner = OWNERS[Math.floor(r() * OWNERS.length)]!;
    const tags = Array.from({ length: 3 }, () => TAGS[Math.floor(r() * TAGS.length)]!);
    out.push({
      id: `p${i}`,
      name: `${name} ${suffix}`,
      owner,
      status: STATUSES[Math.floor(r() * STATUSES.length)]!,
      description:
        "Internal tool for shipping a thing. Owns its release cadence and a small set of dashboards.",
      metrics: {
        stars: Math.floor(r() * 2000),
        forks: Math.floor(r() * 200),
        issues: Math.floor(r() * 80),
        contributors: Math.floor(r() * 30) + 1,
      },
      tags,
      avatarUrl: `https://i.pravatar.cc/96?img=${(i % 70) + 1}`,
    });
  }
  return out;
}
