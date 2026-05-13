import React from "react";
import { View, Text } from "react-native";
import { measureRenders } from "reassure";
import { Skeleton } from "../src/Skeleton";

function Card({ n }: { n: number }): React.ReactElement {
  const lines: React.ReactElement[] = [];
  for (let i = 0; i < n; i += 1) {
    lines.push(React.createElement(Text, { key: i }, `Text line ${i}`));
  }
  return React.createElement(View, null, lines);
}

test("Skeleton — 10 bones initial render", async () => {
  await measureRenders(
    <Skeleton loading baseColor="#eee" highlightColor="#fff">
      <Card n={10} />
    </Skeleton>,
  );
});

test("Skeleton — 30 bones initial render", async () => {
  await measureRenders(
    <Skeleton loading baseColor="#eee" highlightColor="#fff">
      <Card n={30} />
    </Skeleton>,
  );
});
