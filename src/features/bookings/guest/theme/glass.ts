import type { ViewStyle } from 'react-native';

import { C, pine } from './index';

/**
 * ═══ The one switch for glass cards ═══
 * true  → cards are translucent glass over a soft tinted background.
 * false → every card and background goes back to exactly how it was before.
 */
export const GLASS_CARDS: boolean = true;

const on = (style: object): ViewStyle => (GLASS_CARDS ? (style as ViewStyle) : {});

// No fill colour and no elevation: on Android an elevated see-through view paints a dark box behind itself.
const base = { backgroundColor: 'transparent', borderWidth: 1.25, elevation: 0, shadowOpacity: 0 };

/** Light glass: cards with dark text. */
export const glassCard = on({
  ...base,
  borderColor: 'rgba(255, 255, 255, 0.95)',
  backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.66) 0%, rgba(255,255,255,0.26) 55%, rgba(255,255,255,0.46) 100%)',
  boxShadow: `0px 8px 22px ${pine(0.09)}`,
});

/** Pine glass: cards with cream text. */
export const glassCardDark = on({
  ...base,
  borderColor: 'rgba(255, 255, 255, 0.55)',
  backgroundImage: `linear-gradient(160deg, ${pine(0.74)} 0%, ${pine(0.9)} 60%, ${pine(0.8)} 100%)`,
  boxShadow: `0px 8px 22px ${pine(0.16)}`,
});

/** For a selected state that adds its own elevation on top of a glass card. */
export const glassFlat = on({ elevation: 0, shadowOpacity: 0 });

/** Soft Pine and Gold light behind the cards: clear glass needs something to show through. */
export const ambient = on({
  backgroundImage:
    'radial-gradient(circle at 8% 16%, rgba(49,74,67,0.26) 0%, rgba(49,74,67,0) 48%), radial-gradient(circle at 98% 46%, rgba(200,164,106,0.34) 0%, rgba(200,164,106,0) 46%), radial-gradient(circle at 10% 88%, rgba(49,74,67,0.22) 0%, rgba(49,74,67,0) 46%)',
});

/** Screen background. */
export const canvas: ViewStyle = { flex: 1, backgroundColor: C.sand, ...ambient };
