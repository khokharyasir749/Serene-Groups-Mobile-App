import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { MiniAppSplashTransition } from "@/core/components/MiniAppSplashTransition";
import { useMeQuery } from "@/core/api/endpoints/authApi";
import { useAppStateRefresh } from "@/core/hooks/useAppStateRefresh";
import { useAuthStore } from "@/core/stores/authStore";
import { colors } from "@/core/constants/theme";

/** Re-validates a signed-in session (and picks up permission changes) when the app returns to the foreground. */
function SessionWatcher() {
  const authed = useAuthStore((s) => s.accessToken !== null);
  const { refetch } = useMeQuery(undefined, { skip: !authed });
  useAppStateRefresh(() => {
    if (authed) void refetch();
  });
  return null;
}

/** The Serene Group app is public: nobody is forced to sign in. Screens ask for it only where it matters. */
export default function AppLayout() {
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: "center" }}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }
  return (
    <>
      <SessionWatcher />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="serene-bookings" options={{ animation: "fade" }} />
        <Stack.Screen name="serene-services" options={{ animation: "fade" }} />
      </Stack>
      <MiniAppSplashTransition />
    </>
  );
}
