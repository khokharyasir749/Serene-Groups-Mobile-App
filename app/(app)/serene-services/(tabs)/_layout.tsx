import { useRef, type ComponentRef } from "react";
import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { BlurTargetView } from "expo-blur";
import { ServicesDock } from "@/features/services/components/ServicesDock";

export default function ServicesTabs() {
  const blurTarget = useRef<ComponentRef<typeof View>>(null);
  return (
    <View style={styles.root}>
      <BlurTargetView ref={blurTarget} style={styles.root}>
        <Tabs tabBar={() => null} screenOptions={{ headerShown: false }}>
          <Tabs.Screen name="index" options={{ title: "Home" }} />
          <Tabs.Screen name="my-bookings" options={{ title: "My Bookings" }} />
          <Tabs.Screen name="packages" options={{ title: "Packages" }} />
          <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
      </BlurTargetView>
      <ServicesDock blurTarget={blurTarget} />
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
