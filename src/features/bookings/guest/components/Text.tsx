import { StyleSheet, Text as RNText, type TextProps } from 'react-native';

import { FONTS } from '@/features/bookings/guest/theme';

/** Serif display is used at or above this size; smaller "display" text is set in the UI face for legibility. */
const DISPLAY_MIN = 17;

const isDisplay = (family?: string) => !!family && family.startsWith('Cormorant');

function resolve(family: string | undefined, size: number, weight: string, italic: boolean) {
  const w = Number(weight) || (weight === 'bold' ? 700 : 400);
  if (isDisplay(family) && size >= DISPLAY_MIN) {
    if (italic) return FONTS.displayItalic;
    if (family === FONTS.displayBold || w >= 700) return FONTS.displayBold;
    if (family === FONTS.displayMedium) return FONTS.displayMedium;
    return FONTS.display;
  }
  if (isDisplay(family)) return w >= 700 ? FONTS.uiBold : FONTS.uiSemi; // small numerals/labels
  if (family && family.startsWith('PlusJakarta') && !weightGiven(weight)) return family;
  return w >= 700 ? FONTS.uiBold : w >= 600 ? FONTS.uiSemi : w >= 500 ? FONTS.uiMedium : FONTS.ui;
}

const LINING = { fontVariant: ['lining-nums' as const] };

const weightGiven = (w: string) => w !== 'undefined' && w !== '' && w !== 'normal';

/**
 * App-wide Text, as in the Serene Groups app: Cormorant Garamond for headlines, Plus Jakarta Sans for everything
 * else. The family is chosen from size and weight, and fontWeight is reset so Android never synthesises bold.
 */
export function Text({ style, ...rest }: TextProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  const size = typeof flat.fontSize === 'number' ? flat.fontSize : 14;
  const family = resolve(flat.fontFamily, size, String(flat.fontWeight), flat.fontStyle === 'italic');
  const lining = family.startsWith('Cormorant') && !flat.fontVariant ? LINING : null;
  return <RNText {...rest} style={[style, lining, { fontFamily: family, fontWeight: 'normal', fontStyle: 'normal' }]} />;
}
