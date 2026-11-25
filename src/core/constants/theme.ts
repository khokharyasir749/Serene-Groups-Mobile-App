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
  /** Light ivory glass over a light blur. */
  dockGlass: "rgba(255, 253, 249, 0.16)",
  dockActivePill: white(0.32),
  /** Specular glass hairline (no gold outline on the dock). */
  dockBorder: white(0.55),
  dockActiveBorder: snow(0.42),
  dockInactive: pine(0.78),

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

// ── Serene Groups look: a soft pine-and-champagne mesh under ivory plates ────────────────────────
export const groups = {
  base: "#F3EEE3",
  meshPine: "#2F5546",
  meshGold: "#D9B67E",
  meshLight: "#FFFDF6",
  plate: "#F6F3EB",
  plateEdge: "rgba(47, 74, 62, 0.26)",
  plateShadow: "0px 6px 18px rgba(24, 48, 38, 0.12)",
  pine: "#27483B",
  pineEdge: "rgba(216, 193, 150, 0.4)",
  champagne: "#C2A47B",
  /** Overdue figures on Pine. */
  alert: "#FFB4A8",
  goldInk: "#9A7746",
  dock: [white(0.72), "rgba(233, 231, 222, 0.6)"] as const,
  dockEdge: white(0.7),
  dockInk: "#2B4338",
  badge: "rgba(39, 72, 59, 0.82)",
  badgeEdge: "rgba(222, 202, 165, 0.35)",
  heroEdge: "#CDB084",
  heroFade: [black(0.22), black(0), black(0), black(0.74)] as const,
  art: gold(0.5),
  artSoft: gold(0.18),
  artLine: "rgba(47, 74, 62, 0.34)",
} as const;

// ── Serene Services module (src/features/services) ──────────────────────────────────────────────
export const svc = {
  /** Warm light at the top, plain alabaster below. */
  canvas: ["#F3EAD9", SPLASH_CANVAS, SPLASH_CANVAS] as const,
  canvasStops: [0, 0.42, 1] as const,
  page: SPLASH_CANVAS,
  /** Page colour fading out under the pinned header. */
  headerFade: ["rgba(243, 235, 219, 0.9)", "rgba(243, 235, 219, 0)"] as const,
  panel: CREST_SLATE,
  surface: WHITE,
  surfaceEdge: "#E6E0D4",
  darkSurface: white(0.08),
  darkEdge: white(0.16),
  /** Full-bleed hero: shade for the status bar, clear middle, shade for the caption. */
  heroFade: [black(0.46), black(0.08), black(0.04), black(0.6)] as const,
  /** Neutral fade so captions read on photos; no colour tint. */
  photoFade: [black(0), black(0.04), black(0.68)] as const,
  // Glass: header, search, dock and anything on a photo. Cards stay plain.
  glass: [white(0.86), white(0.46), white(0.62)] as const,
  glassEdge: white(0.95),
  glassShadow: "0px 4px 14px rgba(49, 74, 67, 0.07)",
  glassClear: [white(0.34), white(0.06), white(0.18)] as const,
  clearEdge: white(0.6),
  /** Brighter clear glass for the main button on a photo or Pine. */
  frost: white(0.2),
  frostSheen: [white(0.34), white(0.06), white(0.26)] as const,
  frostEdge: white(0.85),
  /** Tinted glass for the main button on a light page. */
  pineGlass: "rgba(49, 74, 67, 0.84)",
  pineSheen: [white(0.26), white(0), white(0.1)] as const,
  pineGlassEdge: white(0.5),
  goldEdge: gold(0.45),
  // Dock.
  dockGlass: [white(0.46), white(0.08), white(0.26)] as const,
  dockEdge: white(0.75),
  /** Faint outer line, so the clear bar still shows on white cards. */
  dockHair: "0px 0px 0px 0.6px rgba(49, 74, 67, 0.16)",
  dockPill: ["rgba(63, 92, 83, 0.88)", "rgba(49, 74, 67, 0.92)"] as const,
  dockPillGlow: [white(0.3), white(0)] as const,
  dockPillRim: [white(0.2), white(0.95), white(0.2)] as const,
  dockPillEdge: white(0.5),
  dockPillShadow: "0px 6px 16px rgba(49, 74, 67, 0.26)",
  dockMuted: CREST_SLATE,
} as const;

/** Materials for the shaded service icons: highlight, body, shade. */
export const iconInk = {
  linen: ["#FFFFFF", "#F6F0E4", "#D9CFBC"], brass: ["#F3DDAE", "#CFA563", "#96703A"], pine: ["#5B8074", CREST_SLATE, "#1E322C"], steel: ["#FBFCFC", "#C7CED1", "#8E999E"],
  wood: ["#B98A5E", "#8A5E3B", "#5D3D25"], water: ["#CDE7F2", "#7DB8D3", "#3F86A8"], stone: ["#8E9592", "#5E6663", "#363C3A"], lamp: ["#FFFBE8", "#FBE3A0", "#E0B45A"],
  seam: "#BFB39C", steelEdge: "#7C878C", coffee: "#4A2E1E", dark: "#1B2421", white: WHITE, led: "#3FB57A",
} as const;

// ── Glass navigation bars (src/core/components/NavGlass) ─────────────────────────────────────────
export const navGlass = {
  /** Light wash inside Apple's Liquid Glass, so dark labels stay readable over photos. */
  tint: white(0.3),
  sheen: [white(0.62), white(0.34), white(0.46)] as const,
  rim: white(0.85),
  solid: "#F6F3EB",
  /** The selected tab: a brighter droplet in the bar. */
  pill: white(0.62),
  pillRim: white(0.9),
  ink: "#16382A",
  shadow: "0px 10px 30px rgba(10, 24, 17, 0.2)",
} as const;

// ── Explore page (src/features/home) ────────────────────────────────────────────────────────────
export const explore = {
  canvas: "#F4EFE5",
  sheet: "#FFFDF8",
  /** Deep Pine of the full-bleed dark chapters. */
  deep: "#0E231A",
  deepFade: ["rgba(14, 35, 26, 0)", "rgba(14, 35, 26, 0.72)", "#0E231A"] as const,
  deepTop: ["#0E231A", "rgba(14, 35, 26, 0)"] as const,
  /** Hero photo: shade under the header, clear middle, deep Pine under the headline. */
  heroFade: [shade(0.52), shade(0), shade(0.04), shade(0.58), shade(0.94)] as const,
  heroStops: [0, 0.22, 0.44, 0.7, 1] as const,
  /** Photo cards that carry their own words. */
  cardFade: [shade(0.3), shade(0), shade(0.12), shade(0.9)] as const,
  cardStops: [0, 0.2, 0.42, 1] as const,
  tileFade: [shade(0), shade(0.16), shade(0.88)] as const,
  finaleFade: [shade(0.1), shade(0.1), "#0E231A"] as const,
  header: "#F4EFE5",
  glass: white(0.16),
  glassDark: shade(0.28),
  glassEdge: white(0.34),
  tick: white(0.4),
  gold: "#E0BE86",
  goldDeep: "#8A6736",
  line: pine(0.14),
  lineDark: white(0.14),
  onDark: "#F4EFE5",
  onDarkSoft: "rgba(244, 239, 229, 0.76)",
  contour: "rgba(224, 190, 134, 0.26)",
  contourMajor: "rgba(224, 190, 134, 0.7)",
  contourInk: pine(0.09),
  lift: "0px 18px 40px rgba(14, 35, 26, 0.22)",
} as const;

// ── Serene Bookings module (src/features/bookings/guest) ────────────────────────────────────────
// Its palette shares Pine, Gold, Stone and Snow with the Groups app; only the canvas and card ivories differ slightly.
export const bookingPine = (a: number) => pine(a);
/** Small round wells, avatars and chips in the module. */
export const bookingWell = 36;
export const bookingHex = {
  pine: PINE, white: WHITE, black: BLACK, gold: GOLD, snow: SNOW, slate: CREST_SLATE, forest: PINE_FOREST, stone: STONE, stoneLine: STONE_DIVIDER,
  alabaster: "#FAF8F4", ivory: "#FFFDF9", parchment: "#FBF8F1", bronze: "#9D7638", goldDeep: "#BE9559", goldLight: "#D8B882", goldPale: "#E6CFAB",
  star: "#F2C94C", danger: "#B42318", blush: "#FFB4A8", positive: "#1D7348", night: "#121416", shade: "#0B1F15", deepPine: "#0F2A1E", fg: "#14261C", brandPine: "#143D29",
} as const;
export const bookingColors = {
  sand: explore.canvas, pine: PINE, pineDeep: PINE, forest: PINE_FOREST, snow: STONE, white: explore.sheet, pureWhite: explore.sheet,
  ink: PINE, ink70: pine(0.78), ink55: pine(0.68), ink40: pine(0.52), line: pine(0.12), lineStrong: pine(0.2),
  cream: SNOW, cream70: snow(0.8), cream45: snow(0.45), gold: GOLD, goldSoft: gold(0.16), goldLine: gold(0.45),
  positive: bookingHex.positive, danger: bookingHex.danger,
  goldInk: explore.goldDeep, goldBright: explore.gold, deep: explore.deep, cardFade: explore.cardFade, cardStops: explore.cardStops, tileFade: explore.tileFade,
  heroFade: explore.heroFade, heroStops: explore.heroStops, lift: explore.lift, glass: explore.glass, glassDark: explore.glassDark, glassEdge: explore.glassEdge,
} as const;
