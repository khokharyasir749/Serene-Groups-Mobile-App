import { createContext, useContext } from "react";
import { StyleSheet, Text as RNText, type TextProps } from "react-native";
import { DISPLAY_MIN_SIZE, font, fonts } from "@/core/constants/theme";

// Nested <Text> inherits its parent's size so a soft second line stays in the same face as its headline.
const SizeContext = createContext<number>(font.md);
const NestedContext = createContext(false);

function pick(size: number, weight: string, italic: boolean): string {
  const w = Number(weight) || 400;
  if (size >= DISPLAY_MIN_SIZE) {
    if (italic) return fonts.displayItalic;
    return w >= 700 ? fonts.displayBold : w >= 500 ? fonts.display : fonts.displayMedium;
  }
  return w >= 700 ? fonts.uiBold : w >= 600 ? fonts.uiSemi : w >= 500 ? fonts.uiMedium : fonts.ui;
}

/** App-wide Text: serif display face for headlines/numerals (≥ 28pt), Plus Jakarta Sans for everything else. */
export function Text({ style, ...rest }: TextProps) {
  const parent = useContext(SizeContext);
  const flat = StyleSheet.flatten(style) ?? {};
  const size = typeof flat.fontSize === "number" ? flat.fontSize : parent;
  const family = flat.fontFamily ?? pick(size, String(flat.fontWeight ?? "400"), flat.fontStyle === "italic");
  const nested = useContext(NestedContext);
  // Editorial rhythm defaults (only when a style does not set its own, and never on nested runs): airy body copy, tight serif display.
  const display = size >= DISPLAY_MIN_SIZE;
  const rhythm = nested
    ? null
    : {
        ...(flat.lineHeight === undefined ? { lineHeight: Math.round(size * (display ? 1.1 : 1.45)) } : null),
        ...(flat.letterSpacing === undefined ? { letterSpacing: display ? -0.4 : size >= font.md ? -0.1 : 0.1 } : null),
        ...(display ? { includeFontPadding: false } : null),
      };
  const content = <RNText {...rest} style={[rhythm, style, { fontFamily: family, fontWeight: "normal", fontStyle: "normal" }]} />;
  return (
    <SizeContext.Provider value={size}>
      <NestedContext.Provider value>{content}</NestedContext.Provider>
    </SizeContext.Provider>
  );
}
