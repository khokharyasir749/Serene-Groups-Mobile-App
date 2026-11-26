import type { TextStyle } from "react-native";
import { sf } from "@/features/services/components/fonts";


/** Serene Services type scale, matched to Serene Groups: Cormorant for names and titles, Plus Jakarta Sans for reading and tapping. */
export const type = {
  /** Small spaced capitals over a title. */
  eyebrow: { fontFamily: sf.uiSemi, fontSize: 11, lineHeight: 16, letterSpacing: 1.6, textTransform: "uppercase" },
  /** The one big name on a page (room, service). */
  // Lining figures: Playfair's default numerals sit up and down the line, which makes "Suite 4B" look uneven.
  hero: { fontFamily: sf.display, fontSize: 52, lineHeight: 54, letterSpacing: -1.1, fontVariant: ["lining-nums"] },
  /** Page title on a tab. */
  page: { fontFamily: sf.displayItalic, fontSize: 42, lineHeight: 46, letterSpacing: -0.8, fontVariant: ["lining-nums"] },
  /** Section heading. */
  title: { fontFamily: sf.display, fontSize: 33, lineHeight: 37, letterSpacing: -0.6, fontVariant: ["lining-nums"] },
  /** A name on a photograph: upright, heavier, so it holds on any picture. */
  onPhoto: { fontFamily: sf.display, fontSize: 20, lineHeight: 23, letterSpacing: -0.2 },
  /** One editorial sentence. */
  lead: { fontFamily: sf.displayItalic, fontSize: 23, lineHeight: 30, letterSpacing: -0.1 },
  body: { fontFamily: sf.ui, fontSize: 15, lineHeight: 23, letterSpacing: 0 },
  label: { fontFamily: sf.uiMedium, fontSize: 12.5, lineHeight: 17, letterSpacing: 0.2 },
  button: { fontFamily: sf.uiSemi, fontSize: 15, lineHeight: 20, letterSpacing: 0.3 },
  /** Phone numbers and references. */
  figure: { fontFamily: sf.uiSemi, fontSize: 15, lineHeight: 20, letterSpacing: 1.2 },
} satisfies Record<string, TextStyle>;
