import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack, useGlobalSearchParams } from "expo-router";
import { P } from "@/core/constants/api";
import { useAuthStore } from "@/core/stores/authStore";
import { colors } from "@/core/constants/theme";

export default function AuthLayout() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const authed = useAuthStore((s) => s.accessToken !== null);
  const permissions = useAuthStore((s) => s.permissions);
  const { next } = useGlobalSearchParams<{ next?: string }>();
  // Investors land on their portfolio; everyone else on the public home.
  const investor = permissions.includes(P.PORTFOLIO_READ) && !permissions.includes(P.PAYMENTS_READ);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: "center" }}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }
  if (authed) return <Redirect href={(next && next.startsWith("/") ? next : investor ? "/payments" : "/") as "/"} />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}
