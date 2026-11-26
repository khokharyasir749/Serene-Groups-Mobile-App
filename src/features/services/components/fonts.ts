import { useSyncExternalStore } from "react";
import { loadAsync } from "expo-font";

/**
 * Serene Services has its own type: Playfair Display for names and titles, Manrope for everything read or tapped.
 * The files live in this module (../fonts) and load here, so the rest of the app keeps its own fonts.
 */
export const sf = {
  display: "SvcPlayfair_600SemiBold",
  displayMedium: "SvcPlayfair_500Medium",
  displaySemi: "SvcPlayfair_600SemiBold",
  displayBold: "SvcPlayfair_700Bold",
  displayItalic: "SvcPlayfair_500Medium_Italic",
  displayItalicLight: "SvcPlayfair_400Regular_Italic",
  ui: "SvcManrope_400Regular",
  uiMedium: "SvcManrope_500Medium",
  uiSemi: "SvcManrope_600SemiBold",
  uiBold: "SvcManrope_700Bold",
} as const;

const FILES = {
  [sf.display]: require("../fonts/PlayfairDisplay_600SemiBold.ttf"),
  [sf.displayMedium]: require("../fonts/PlayfairDisplay_500Medium.ttf"),
  [sf.displayBold]: require("../fonts/PlayfairDisplay_700Bold.ttf"),
  [sf.displayItalic]: require("../fonts/PlayfairDisplay_500Medium_Italic.ttf"),
  [sf.displayItalicLight]: require("../fonts/PlayfairDisplay_400Regular_Italic.ttf"),
  [sf.ui]: require("../fonts/Manrope_400Regular.ttf"),
  [sf.uiMedium]: require("../fonts/Manrope_500Medium.ttf"),
  [sf.uiSemi]: require("../fonts/Manrope_600SemiBold.ttf"),
  [sf.uiBold]: require("../fonts/Manrope_700Bold.ttf"),
};

let ready = false;
const listeners = new Set<() => void>();
const done = () => {
  ready = true;
  listeners.forEach((l) => l());
};
// Starts as soon as the module is first imported. A failure falls back to the system face rather than blocking the screen.
void loadAsync(FILES).then(done, done);

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

/** True once Services' fonts are registered. */
export const useServiceFonts = () => useSyncExternalStore(subscribe, () => ready, () => ready);
