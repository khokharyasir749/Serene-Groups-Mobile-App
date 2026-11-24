import { Stack } from "expo-router";
import { colors } from "@/core/constants/theme";
import { DeskSheetHost } from "@/features/services/components/DeskSheet";

// Serene Services: a self-contained mini-app. Every screen lives in src/features/services; these routes only mount them.
export default function ServicesLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.splashCanvas }, animation: "slide_from_right" }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="book/[slug]" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="booked/[ref]" options={{ animation: "fade", gestureEnabled: false }} />
      </Stack>
      <DeskSheetHost />
    </>
  );
}
