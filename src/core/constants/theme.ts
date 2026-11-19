// Design tokens. This is the ONLY file allowed to contain hex colours (enforced by scripts/check.mjs).
//
// Serene Management / Serene Groups flagship visual palette:
//   Warm Alabaster Canvas:   #F5F1E8
//   Elevated White/Ivory:    #FFFFFF / #FCFBF8
//   Muted Stone Surface:     #ECE6DA / #E4DDD0
//   Deep Forest Pine:        #123524 / #1B4332
//   Champagne Gold Accent:   #C8A46A
//   Snow Highlight:          #ECEEED

const SAND = "#F5F1E8";
const WHITE = "#FFFFFF";
const IVORY = "#FCFBF8";
const STONE = "#ECE6DA";
const STONE_DIVIDER = "#E4DDD0";
const PINE = "#123524";
const PINE_FOREST = "#1B4332";
const GOLD = "#C8A46A";
const SNOW = "#ECEEED";
const BLACK = "#000000";
// Crest + splash identity (exact values from the Serene Management app).
const CREST_SLATE = "#314A43";
const SPLASH_CANVAS = "#F5F2EB";
const SPLASH_MUTED = "#5C645E";

const pine = (a: number) => `rgba(18, 53, 36, ${a})`;
const forest = (a: number) => `rgba(27, 67, 50, ${a})`;
const gold = (a: number) => `rgba(200, 164, 106, ${a})`;
const snow = (a: number) => `rgba(236, 238, 237, ${a})`;
const sand = (a: number) => `rgba(245, 241, 232, ${a})`;
const stone = (a: number) => `rgba(236, 230, 218, ${a})`;
const white = (a: number) => `rgba(255, 255, 255, ${a})`;
const shade = (a: number) => `rgba(10, 24, 17, ${a})`;
const black = (a: number) => `rgba(0, 0, 0, ${a})`;

export const colors = {
  // ── Signature Palette ──
  sand: SAND,
  white: WHITE,
  ivory: IVORY,
  stone: STONE,
  stoneDivider: STONE_DIVIDER,
  pineBrand: PINE,
  pineForest: PINE_FOREST,
  goldAccent: GOLD,
  snow: SNOW,
  crestSlate: CREST_SLATE,
  splashCanvas: SPLASH_CANVAS,
  splashMuted: SPLASH_MUTED,

  // ── Light surfaces (Warm Alabaster canvas) ──
  paper: SAND,
  card: WHITE,
  cardUnselected: STONE,
  frame: WHITE,
  mark: pine(0.08),
  ink: PINE,
  ink2: pine(0.85),
  muted: pine(0.60),
  line: STONE_DIVIDER,
  lineStrong: pine(0.24),
  navGlass: sand(0.92),
  navBorder: pine(0.15),
  softSage: PINE_FOREST, // solid second headline line — never a faded grey

  // ── Forest Pine surfaces (hero cards, dock, dark sections) ──
  night: PINE,
  night2: PINE_FOREST,
  dusk0: PINE,
  dusk1: PINE,
  dusk2: PINE_FOREST,
  dusk3: snow(0.55),
  charcoal: PINE,
  sage: snow(0.75),
  glow: GOLD,
  onNight: SNOW,
  onNightMuted: snow(0.80),
  onNightDim: snow(0.55),
  lineNight: snow(0.18),
  glassNight: pine(0.72),
  trackNight: snow(0.20),
  dockSurface: WHITE,
  dockActivePill: PINE,
  dockBorder: GOLD,
  dockActiveBorder: snow(0.42),
  dockInactive: pine(0.6),

  // ── Champagne Gold accents ──
  gold: GOLD,
  goldBright: GOLD,
  goldText: PINE_FOREST, // readable on Alabaster; gold itself is reserved for dark surfaces and badges
  goldSoft: gold(0.14),
  goldBadge: GOLD,
  goldLine: gold(0.35),
  onGold: PINE,

  // ── Semantic aliases ──
  bg: SAND,
  surface: WHITE,
  surfaceAlt: IVORY,
  text: PINE,
  textMuted: pine(0.60),
  textDim: pine(0.45),
  border: STONE_DIVIDER,
  borderStrong: pine(0.24),
  glass: snow(0.75),
  glassStrong: WHITE,
  track: stone(0.5),
  pine: PINE,
  pineSoft: pine(0.12),
  moss: PINE,
  emerald: PINE,

  // ── Status ──
  success: "#1D7348",
  successSoft: "rgba(29, 115, 72, 0.14)",
  warning: "#9A5507",
  warningSoft: "rgba(154, 85, 7, 0.14)",
  danger: "#B42318",
  dangerSoft: "rgba(180, 35, 24, 0.14)",
  info: "#1D5FB8",
  infoSoft: "rgba(29, 95, 184, 0.14)",
  neutralSoft: pine(0.08),

  whatsapp: "#25D366",
  overlay: pine(0.72),
  // Photos keep their true colours: only a light neutral edge fade, never a tint.
  scrimMid: black(0),
  scrim: black(0.35),
  clear: black(0),
  white16: snow(0.16),
  /** Translucent dark-glass pill over photography. */
  photoGlass: black(0.4),
  photoGlassBorder: white(0.25),
  shadow: "#000000",
  glowPine: pine(0.50),
} as const;

export const shadows = {
  card: {
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardElevated: {
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  dock: {
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 12,
  },
  cta: {
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

/** Text / line tokens for content sitting on a Pine surface. */
export const dark = {
  text: colors.onNight,
  muted: colors.onNightMuted,
  dim: colors.onNightDim,
  line: colors.lineNight,
  accent: colors.gold,
  soft: colors.sage,
} as const;

export const gradients = {
  /** Subtle light-to-shade wash laid over a solid Pine card. */
  forest: [snow(0.06), shade(0.24)] as const,
  gold: [colors.gold, colors.gold] as const,
  /** Cinematic multi-stop scrim over photography. Pair with SCRIM_STOPS. */
  heroScrim: [colors.clear, colors.scrimMid, colors.scrim] as const,
  tabBar: [colors.pineBrand, colors.pineBrand] as const,
};

export const SCRIM_STOPS = [0, 0.55, 1] as const;
/** Bottom clearance so scroll content never hides under the floating tab dock. */
export const CLEARANCE = 150;
/** Segment tones for the five Nathia Gali room types: Snow stepping down in opacity on Pine. */
/** The same five segment tones, as Pine on the Alabaster canvas. */
export const roomColorsLight = [pine(1), pine(0.78), pine(0.58), pine(0.4), pine(0.24)] as const;
export const roomColors = [snow(1), snow(0.78), snow(0.58), snow(0.4), snow(0.24)] as const;

/** Typography: Cormorant Garamond for editorial display, Plus Jakarta Sans for UI and numerals. */
export const fonts = {
  display: "CormorantGaramond_600SemiBold",
  displayMedium: "CormorantGaramond_500Medium",
  displaySemi: "CormorantGaramond_600SemiBold",
  displayBold: "CormorantGaramond_700Bold",
  displayItalic: "CormorantGaramond_500Medium_Italic",
  ui: "PlusJakartaSans_400Regular",
  uiMedium: "PlusJakartaSans_500Medium",
  uiSemi: "PlusJakartaSans_600SemiBold",
  uiBold: "PlusJakartaSans_700Bold",
} as const;
/** Text at or above this size is set in the serif display face. */
export const DISPLAY_MIN_SIZE = 28;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 20, xl: 24, xxl: 32, hero: 56 } as const;
export const radius = { sm: 8, md: 12, lg: 20, xl: 24, pill: 999 } as const;
export const font = { xs: 11, sm: 13, md: 15, lg: 18, xl: 24, xxl: 32, display: 40 } as const;
export const icon = { md: 22, xl: 40 } as const;
export const letter = { eyebrow: 1.6, display: -0.6, tight: -0.3 } as const;

export type Tone = "neutral" | "gold" | "pine" | "success" | "warning" | "danger" | "info";

export const toneColors: Record<Tone, { fg: string; bg: string }> = {
  neutral: { fg: colors.muted, bg: colors.neutralSoft },
  gold: { fg: colors.goldText, bg: colors.goldSoft },
  pine: { fg: colors.pineBrand, bg: colors.pineSoft },
  success: { fg: colors.success, bg: colors.successSoft },
  warning: { fg: colors.warning, bg: colors.warningSoft },
  danger: { fg: colors.danger, bg: colors.dangerSoft },
  info: { fg: colors.info, bg: colors.infoSoft },
};
