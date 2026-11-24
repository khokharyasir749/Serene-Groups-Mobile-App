import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { DockBridge, FloatingDock } from "@/features/bookings/guest/components/GlassTabBar";
import { C } from "@/features/bookings/guest/theme";

// Discover · Stay · Trips, with Serene Booking's own liquid-notch dock (the Groups dock is untouched).
export default function BookingsTabs() {
  return (
    <View style={styles.root}>
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
      <FloatingDock />
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: C.sand } });
