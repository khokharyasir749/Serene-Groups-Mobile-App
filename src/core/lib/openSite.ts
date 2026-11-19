import { Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { colors } from "@/core/constants/theme";

/** Opens an official Serene site in the in-app browser (falls back to the system browser). */
export async function openSite(url: string): Promise<void> {
  try {
    await WebBrowser.openBrowserAsync(url, { toolbarColor: colors.pineBrand, controlsColor: colors.snow, enableBarCollapsing: true });
  } catch {
    await Linking.openURL(url);
  }
}
