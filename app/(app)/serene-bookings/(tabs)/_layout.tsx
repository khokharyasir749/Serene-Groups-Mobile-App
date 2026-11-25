import { useRef, type ComponentRef } from "react";
import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { BlurTargetView } from "expo-blur";
import { DockBridge, FloatingDock } from "@/features/bookings/guest/components/GlassTabBar";
import { C } from "@/features/bookings/guest/theme";

// Discover · Stay · Trips, with Serene Booking's own glass dock.
export default function BookingsTabs() {
  const blurTarget = useRef<ComponentRef<typeof View>>(null);
  return (
    <View style={styles.root}>
      <BlurTargetView ref={blurTarget} style={styles.root}>
      <Tabs
        detachInactiveScreens={false}
        tabBar={(props) => <DockBridge {...props} />}
        // Build every tab up front, so the first tap on one doesn't stutter the dock.
        screenOptions={{ headerShown: false, sceneStyle: styles.root, freezeOnBlur: false, lazy: false }}
      >
        <Tabs.Screen name="index" options={{ title: "Discover" }} />
        <Tabs.Screen name="apartments" options={{ title: "Stay" }} />
        <Tabs.Screen name="trips" options={{ title: "Trips" }} />
      </Tabs>
      </BlurTargetView>
      <FloatingDock blurTarget={blurTarget} />
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: C.sand } });
