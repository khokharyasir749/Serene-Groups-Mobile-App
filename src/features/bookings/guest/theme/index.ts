import { StyleSheet } from 'react-native';

import { bookingColors, bookingHex, bookingPine, bookingWell, fonts } from '@/core/constants/theme';

// Every colour lives in the Groups theme (src/core/constants/theme.ts); the module only re-exports it under its own names.
export const C = bookingColors;
export const HEX = bookingHex;
export const pine = bookingPine;

// Cormorant Garamond for editorial display, Plus Jakarta Sans for UI and numerals (loaded in app/_layout.tsx).
export const FONTS = { ...fonts, display: fonts.displaySemi, displayMedium: fonts.displayMedium, displayBold: fonts.displayBold } as const;

export const F = { display: FONTS.display, sans: FONTS.ui };

// radius: buttons & inputs · card: cards & photos · tabBar: height of the floating dock.
export const S = { gutter: 20, radius: 14, card: 22, photo: 20, tabBar: 64, well: bookingWell };

/** Bottom padding a tab screen needs so its last item clears the floating dock. */
/** Distance from the top safe-area edge to the brand lockup — the same on every screen, so the logo never shifts when you change screens. */
export const LOGO_TOP = 10;

export const tabBarSpace = (bottomInset: number) => S.tabBar + bottomInset + 34; // dock height + its offset + its raised ball, and a little air

export const shadow = {
  card: { shadowColor: HEX.pine, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3 },
  cardHover: { shadowColor: HEX.pine, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 6 },
  pill: { shadowColor: HEX.pine, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  dock: { shadowColor: HEX.black, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.28, shadowRadius: 26, elevation: 10 },
} as const;

// One type scale for the whole app:
//   h1 screen titles · h2 section headings · h3 card titles · body copy · small meta · caps labels · price.
// Display sizes are tuned for Cormorant's small x-height; numbers use tabular figures.
export const T = StyleSheet.create({
  h1: { fontFamily: FONTS.display, fontSize: S.well, lineHeight: 40, letterSpacing: -0.4, color: C.ink },
  h2: { fontFamily: FONTS.display, fontSize: 27, lineHeight: 31, letterSpacing: -0.3, color: C.ink },
  h3: { fontFamily: FONTS.display, fontSize: 21, lineHeight: 25, color: C.ink },
  eyebrow: { fontFamily: FONTS.uiSemi, fontSize: 10.5, lineHeight: 14, letterSpacing: 1.6, textTransform: 'uppercase', color: C.ink55 },
  caps: { fontFamily: FONTS.uiBold, fontSize: 10.5, letterSpacing: 1.6, textTransform: 'uppercase', color: C.ink },
  display: { fontFamily: FONTS.display, color: C.ink },
  body: { fontFamily: FONTS.ui, fontSize: 15, lineHeight: 22, color: C.ink70 },
  small: { fontFamily: FONTS.ui, fontSize: 13, lineHeight: 18, color: C.ink55 },
  price: { fontFamily: FONTS.uiBold, fontSize: 18, lineHeight: 23, letterSpacing: -0.2, color: C.ink, fontVariant: ['tabular-nums'] },
});
