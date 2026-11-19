import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { ReserveSheet } from "@/features/stays/components/ReserveSheet";
import { FloatingDock } from "@/core/components/FloatingDock";
import { usePermissions } from "@/core/hooks/usePermissions";

export default function TabsLayout() {
  // Every role sees every pillar; permissions gate the admin content inside each one.
  const { permissions } = usePermissions();
  return (
    <>
      <Tabs backBehavior="history" key={permissions.join(",")} tabBar={(props) => <FloatingDock {...props} />} screenOptions={{ headerShown: false, sceneStyle: styles.scene }}>
        <Tabs.Screen name="index" options={{ title: "Explore" }} />
        <Tabs.Screen name="bookings/index" options={{ title: "Stay" }} />
        <Tabs.Screen name="payments/index" options={{ title: "Invest" }} />
      </Tabs>
      <ReserveSheet />
    </>
  );
}

const styles = StyleSheet.create({ scene: { backgroundColor: "transparent" } });
