import { Alert } from "react-native";
import { useLogoutMutation } from "@/core/api/endpoints/authApi";
import { HeaderAction } from "./FloatingHeader";

/** Dark ink "Logout" pill for the floating header. */
export function SignOutButton() {
  const [logout] = useLogoutMutation();
  const confirm = () =>
    Alert.alert("Sign out", "You'll need to sign in again on this device.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => void logout() },
    ]);
  return <HeaderAction label="Logout" onPress={confirm} />;
}
