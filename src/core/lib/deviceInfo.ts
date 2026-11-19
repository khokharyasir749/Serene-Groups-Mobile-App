import { Platform } from "react-native";
import { getDeviceId } from "@/core/auth/secureStore";

export async function getDeviceInfo() {
  return { deviceId: await getDeviceId(), platform: "mobile" as const, os: Platform.OS };
}
