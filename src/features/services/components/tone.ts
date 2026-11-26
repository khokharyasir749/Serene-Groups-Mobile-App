import { colors, explore, groups } from "@/core/constants/theme";

/**
 * Serene Services palette. The page, plates, hairlines, Pine, champagne and ink are the Serene Groups tokens themselves (read from
 * the shared theme, never changed), so moving between Groups and Services feels like one app. Module-only shades follow below.
 */
export const tone = {
  page: explore.canvas,
  pageFade: ["rgba(244, 239, 229, 0.98)", "rgba(244, 239, 229, 0)"] as const,
  plate: explore.sheet,
  /** 1 px edge on every plate. */
  line: explore.line,
  /** Soft disc behind an icon. */
  badge: "rgba(49, 74, 67, 0.08)",
  badgeEdge: "rgba(202, 174, 131, 0.42)",
  badgeWash: ["rgba(202, 174, 131, 0.16)", "rgba(49, 74, 67, 0.06)"] as const,
  shadow: groups.plateShadow,
  tileEdge: explore.line,
  tileShadow: "0px 2px 8px rgba(44, 62, 50, 0.05)",
  pine: groups.pine,
  pineDeep: explore.deep,
  veil: "rgb(8, 16, 13)",
  /** Gold on dark surfaces and photographs (Groups: explore.gold). */
  champagne: explore.gold,
  /** Gold for words on the light page (Groups: explore.goldDeep). */
  goldText: explore.goldDeep,
  onDark: explore.onDark,
  onDarkSoft: explore.onDarkSoft,
  /** Champagne dark enough to read on sand. */
  bronze: explore.goldDeep,
  pineSide: ["rgba(37, 66, 54, 1)", "rgba(37, 66, 54, 0.94)", "rgba(37, 66, 54, 0.4)", "rgba(37, 66, 54, 0.06)"] as const,
  pineFoot: ["rgba(20, 38, 31, 0)", "rgba(20, 38, 31, 0.5)"] as const,
  photoFoot: ["rgba(12, 20, 17, 0)", "rgba(12, 20, 17, 0.28)", "rgba(12, 20, 17, 0.7)"] as const,
  panelFade: ["rgba(10, 18, 15, 0.74)", "rgba(10, 18, 15, 0.46)", "rgba(10, 18, 15, 0.04)", "rgba(10, 18, 15, 0.2)"] as const,
  heroFade: ["rgba(10, 18, 15, 0.5)", "rgba(10, 18, 15, 0.04)", "rgba(10, 18, 15, 0.1)", "rgba(10, 18, 15, 0.76)"] as const,
  sentVeil: ["rgba(49, 74, 67, 0.5)", "rgba(30, 48, 43, 0.9)", "rgba(24, 40, 35, 0.98)"] as const,
  /** Over a photograph behind clear glass: dark enough for white words, light enough to keep the picture. */
  glassVeil: ["rgba(10, 18, 15, 0.34)", "rgba(10, 18, 15, 0.22)", "rgba(10, 18, 15, 0.58)"] as const,
  deskHead: ["rgba(49, 74, 67, 0.72)", "rgba(24, 40, 35, 0.9)"] as const,
  // The reception photo keeps its own colour; only a light neutral veil sits behind the words.
  deskShade: ["rgba(0, 0, 0, 0.34)", "rgba(0, 0, 0, 0.12)", "rgba(0, 0, 0, 0)"] as const,
  deskFoot: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.42)"] as const,
  deskGlass: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)"] as const,
  smokeGlass: ["rgba(14, 22, 19, 0.38)", "rgba(14, 22, 19, 0.24)"] as const,
  deskGlassStrong: ["rgba(255, 255, 255, 0.42)", "rgba(255, 255, 255, 0.16)"] as const,
  deskGlassSheen: ["rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0)"] as const,
  deskGlassEdge: "rgba(255, 255, 255, 0.62)",
  glassOnPine: "rgba(255, 255, 255, 0.24)",
  glassOnPineEdge: "rgba(255, 255, 255, 0.62)",
  /** The dock's pill brightens as it is lifted and moved. */
  dockPillGlow: "rgba(255, 255, 255, 0.4)",
  ink: colors.ink,
  soft: colors.muted,
  hair: explore.line,
} as const;
