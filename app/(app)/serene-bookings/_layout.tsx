import { View } from "react-native";
import { Stack } from "expo-router";
import { C } from "@/features/bookings/guest/theme";

const MODAL = { presentation: "fullScreenModal", animation: "slide_from_bottom" } as const;

// Serene Bookings: a self-contained mini-app. Every screen lives in src/features/bookings/guest; these routes only mount them.
export default function BookingsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: C.pine }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.sand }, animation: "slide_from_right" }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="book/[slug]" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="booking/[ref]" options={{ animation: "fade", gestureEnabled: false }} />
        <Stack.Screen name="stay" options={MODAL} />
        <Stack.Screen name="rates/[slug]" options={MODAL} />
        <Stack.Screen name="login" options={MODAL} />
        <Stack.Screen name="menu" options={{ presentation: "transparentModal", animation: "none", gestureEnabled: false, contentStyle: { backgroundColor: "transparent" } }} />
      </Stack>
    </View>
  );
}
