import React from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "react-native-fabric-shimmer";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { DemoScreen } from "../src/components/DemoScreen";
import { UserCard } from "../src/components/UserCard";
import { MOCK_USER, type User } from "../src/mocks/users";
import { fetchUserList } from "../src/mocks/api";
import { useControlledQuery } from "../src/hooks/useControlledQuery";

export default function UserList(): React.ReactElement {
  const { data } = useControlledQuery(["users"], fetchUserList, {
    delayMs: 1200,
  });
  const rows: ReadonlyArray<User | null> = data ?? new Array<null>(20).fill(null);
  const theme = UnistylesRuntime.getTheme();
  return (
    <DemoScreen title="User list" subtitle="FlashList × 20; each row has its own Skeleton.">
      <View style={styles.list}>
        <FlashList
          data={rows as Array<User | null>}
          keyExtractor={(_, i) => String(i)}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <Skeleton
              loading={item === null}
              baseColor={theme.colors.skeletonBase}
              highlightColor={theme.colors.skeletonHighlight}
            >
              <UserCard user={item ?? MOCK_USER} />
            </Skeleton>
          )}
        />
      </View>
    </DemoScreen>
  );
}

const styles = StyleSheet.create(() => ({
  list: { minHeight: 600 },
  sep: { height: 12 },
}));
