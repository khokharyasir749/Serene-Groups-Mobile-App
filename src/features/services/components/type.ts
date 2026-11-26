import type { TextStyle } from "react-native";
import { sf } from "@/features/services/components/fonts";


/**
 * Serene Services type: Playfair Display in italic for headings, upright for names on photographs,
 * and Manrope for everything that is read or tapped. Spaced capitals are kept for small labels only.
 */
export const type = {
  /** Small spaced capitals over a title. */
  eyebrow: { fontFamily: sf.uiSemi, fontSize: 11.5, lineHeight: 16, letterSpacing: 2.2, textTransform: "uppercase" },
  /** The one big name on a page (room, service). */
  // Lining figures: Playfair's default numerals sit up and down the line, which makes "Suite 4B" look uneven.
  hero: { fontFamily: sf.displayMedium, fontSize: 48, lineHeight: 56, letterSpacing: -0.8, fontVariant: ["lining-nums"] },
  /** Page title on a tab. */
  page: { fontFamily: sf.displayItalic, fontSize: 37, lineHeight: 45, letterSpacing: -0.6, fontVariant: ["lining-nums"] },
  /** Section heading. */
  title: { fontFamily: sf.displayItalic, fontSize: 29, lineHeight: 37, letterSpacing: -0.4, fontVariant: ["lining-nums"] },
  /** A name on a photograph: upright, heavier, so it holds on any picture. */
  onPhoto: { fontFamily: sf.displayMedium, fontSize: 17, lineHeight: 22, letterSpacing: -0.1 },
  /** One editorial sentence. */
  lead: { fontFamily: sf.displayItalicLight, fontSize: 20, lineHeight: 30, letterSpacing: -0.1 },
  body: { fontFamily: sf.ui, fontSize: 15, lineHeight: 23, letterSpacing: 0 },
  label: { fontFamily: sf.uiMedium, fontSize: 12.5, lineHeight: 17, letterSpacing: 0.2 },
  button: { fontFamily: sf.uiSemi, fontSize: 15, lineHeight: 20, letterSpacing: 0.3 },
  /** Phone numbers and references. */
  figure: { fontFamily: sf.uiSemi, fontSize: 15, lineHeight: 20, letterSpacing: 1.2 },
} satisfies Record<string, TextStyle>;
