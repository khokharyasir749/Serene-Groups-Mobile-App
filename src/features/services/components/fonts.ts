import { useSyncExternalStore } from "react";
import { fonts } from "@/core/constants/theme";

/**
 * Serene Services sets type in the Serene Groups faces: Cormorant Garamond for names and titles, Plus Jakarta Sans for everything read
 * or tapped. The app loads them at start-up.
 */
export const sf = {
  display: fonts.display,
  displayMedium: fonts.displayMedium,
  displaySemi: fonts.displaySemi,
  displayBold: fonts.displayBold,
  displayItalic: fonts.displayItalic,
  displayItalicLight: fonts.displayItalic,
  ui: fonts.ui,
  uiMedium: fonts.uiMedium,
  uiSemi: fonts.uiSemi,
  uiBold: fonts.uiBold,
} as const;



let ready = false;
const listeners = new Set<() => void>();
const done = () => {
  ready = true;
  listeners.forEach((l) => l());
};
// Starts as soon as the module is first imported. A failure falls back to the system face rather than blocking the screen.
// The app loads these faces at start-up; nothing more to wait for.
done();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

/** True once Services' fonts are registered. */
export const useServiceFonts = () => useSyncExternalStore(subscribe, () => ready, () => ready);
