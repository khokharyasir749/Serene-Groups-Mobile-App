import { router } from "expo-router";
import { useAuthStore } from "@/core/stores/authStore";
import { PlateButton } from "./PlateButton";

/** Account entry in every header: opens the Profile tab. A champagne dot marks a signed-in session. */
export function AccountButton({ glass }: { glass?: boolean }) {
  const authed = useAuthStore((s) => s.accessToken !== null);
  return <PlateButton glass={glass} icon="person-circle-outline" label={authed ? "Your profile" : "Profile and sign in"} dot={authed} onPress={() => router.navigate("/profile")} />;
}
