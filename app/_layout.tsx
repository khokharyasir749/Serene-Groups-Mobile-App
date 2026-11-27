import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import { CormorantGaramond_500Medium } from "@expo-google-fonts/cormorant-garamond/500Medium";
import { CormorantGaramond_500Medium_Italic } from "@expo-google-fonts/cormorant-garamond/500Medium_Italic";
import { CormorantGaramond_600SemiBold } from "@expo-google-fonts/cormorant-garamond/600SemiBold";
import { CormorantGaramond_700Bold } from "@expo-google-fonts/cormorant-garamond/700Bold";
import { PlusJakartaSans_400Regular } from "@expo-google-fonts/plus-jakarta-sans/400Regular";
import { PlusJakartaSans_500Medium } from "@expo-google-fonts/plus-jakarta-sans/500Medium";
import { PlusJakartaSans_600SemiBold } from "@expo-google-fonts/plus-jakarta-sans/600SemiBold";
import { PlusJakartaSans_700Bold } from "@expo-google-fonts/plus-jakarta-sans/700Bold";
import { store } from "@/core/stores/store";
import { hydrateSession } from "@/core/auth/session";
import { useUiStore } from "@/core/stores/uiStore";
import { ToastHost } from "@/core/components/Toast";
import { LaunchSplash } from "@/core/components/LaunchSplash";
import { colors, fonts } from "@/core/constants/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsReady, fontError] = useFonts({
    [fonts.displayMedium]: CormorantGaramond_500Medium,
    [fonts.displayItalic]: CormorantGaramond_500Medium_Italic,
    [fonts.displaySemi]: CormorantGaramond_600SemiBold,
    [fonts.displayBold]: CormorantGaramond_700Bold,
    [fonts.ui]: PlusJakartaSans_400Regular,
    [fonts.uiMedium]: PlusJakartaSans_500Medium,
    [fonts.uiSemi]: PlusJakartaSans_600SemiBold,
    [fonts.uiBold]: PlusJakartaSans_700Bold,
  });

  const typeReady = fontsReady || Boolean(fontError);

  // The native splash hands over to the branded LaunchSplash once its first frame is up (same Pine, same crest).
  const handOver = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    void hydrateSession();
    const unsub = NetInfo.addEventListener((s) => useUiStore.getState().setOffline(s.isConnected === false));
    return unsub;
  }, []);

  // The native splash stays up until the type is ready (a font error falls back to system type).
  if (!typeReady) return <View style={{ flex: 1, backgroundColor: colors.pineBrand }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Slot />
          <ToastHost />
          <LaunchSplash onShown={handOver} />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
