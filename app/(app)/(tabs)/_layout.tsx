import { useEffect, useRef, type ComponentRef } from "react";
import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { BlurTargetView } from "expo-blur";
import { ReserveSheet } from "@/features/stays/components/ReserveSheet";
import { FloatingDock, type DockProps } from "@/core/components/FloatingDock";
import { usePermissions } from "@/core/hooks/usePermissions";
import { setDockProps, useDockStore } from "@/core/stores/dockStore";

/** Receives the navigator's tab-bar props and syncs them to the store only when the tabs or the active tab change. */
function DockBridge(props: DockProps) {
  useEffect(() => {
    setDockProps(props);
  });
  return null;
}

export default function TabsLayout() {
  // Every role sees every pillar; permissions gate the admin content inside each one.
  const { permissions } = usePermissions();
  const blurTarget = useRef<ComponentRef<typeof View>>(null);
  const dock = useDockStore((s) => s.props);
  return (
    <View style={styles.root}>
      <BlurTargetView ref={blurTarget} style={styles.root}>
        <Tabs backBehavior="history" key={permissions.join(",")} tabBar={(props) => <DockBridge {...props} />} screenOptions={{ headerShown: false, sceneStyle: styles.scene }}>
          <Tabs.Screen name="index" options={{ title: "Explore" }} />
          <Tabs.Screen name="bookings/index" options={{ title: "Stay" }} />
          <Tabs.Screen name="payments/index" options={{ title: "Invest" }} />
        </Tabs>
      </BlurTargetView>
      {dock ? <FloatingDock {...dock} blurTarget={blurTarget} /> : null}
      <ReserveSheet />
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 }, scene: { backgroundColor: "transparent" } });
