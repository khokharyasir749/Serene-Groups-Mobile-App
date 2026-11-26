/** Serene Services palette: sand page, alabaster plates, one Pine, a thread of champagne. Local to the module, so the shared theme stays as it is. */
export const tone = {
  page: "rgb(245, 242, 235)",
  pageFade: ["rgba(245, 242, 235, 0.98)", "rgba(245, 242, 235, 0)"] as const,
  plate: "rgb(250, 248, 244)",
  /** 1 px edge on every plate. */
  line: "rgb(228, 221, 208)",
  /** Soft disc behind an icon. */
  badge: "rgba(49, 74, 67, 0.08)",
  badgeEdge: "rgba(202, 174, 131, 0.42)",
  badgeWash: ["rgba(202, 174, 131, 0.16)", "rgba(49, 74, 67, 0.06)"] as const,
  shadow: "0px 8px 24px rgba(72, 60, 38, 0.07)",
  tileEdge: "rgb(228, 221, 208)",
  tileShadow: "0px 2px 8px rgba(44, 62, 50, 0.05)",
  pine: "rgb(49, 74, 67)",
  pineDeep: "rgb(30, 48, 43)",
  veil: "rgb(8, 16, 13)",
  champagne: "rgb(202, 174, 131)",
  /** Champagne dark enough to read on sand. */
  bronze: "rgb(122, 92, 50)",
  pineSide: ["rgba(37, 66, 54, 1)", "rgba(37, 66, 54, 0.94)", "rgba(37, 66, 54, 0.4)", "rgba(37, 66, 54, 0.06)"] as const,
  pineFoot: ["rgba(20, 38, 31, 0)", "rgba(20, 38, 31, 0.5)"] as const,
  photoFoot: ["rgba(12, 20, 17, 0)", "rgba(12, 20, 17, 0.28)", "rgba(12, 20, 17, 0.7)"] as const,
  panelFade: ["rgba(10, 18, 15, 0.74)", "rgba(10, 18, 15, 0.46)", "rgba(10, 18, 15, 0.04)", "rgba(10, 18, 15, 0.2)"] as const,
  heroFade: ["rgba(10, 18, 15, 0.5)", "rgba(10, 18, 15, 0.04)", "rgba(10, 18, 15, 0.1)", "rgba(10, 18, 15, 0.76)"] as const,
  sentVeil: ["rgba(49, 74, 67, 0.5)", "rgba(30, 48, 43, 0.9)", "rgba(24, 40, 35, 0.98)"] as const,
  deskHead: ["rgba(49, 74, 67, 0.72)", "rgba(24, 40, 35, 0.9)"] as const,
  // The reception photo keeps its own colour; only a light neutral veil sits behind the words.
  deskShade: ["rgba(0, 0, 0, 0.34)", "rgba(0, 0, 0, 0.12)", "rgba(0, 0, 0, 0)"] as const,
  deskFoot: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.42)"] as const,
  deskGlass: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)"] as const,
  deskGlassStrong: ["rgba(255, 255, 255, 0.42)", "rgba(255, 255, 255, 0.16)"] as const,
  deskGlassSheen: ["rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0)"] as const,
  deskGlassEdge: "rgba(255, 255, 255, 0.62)",
  glassOnPine: "rgba(255, 255, 255, 0.24)",
  glassOnPineEdge: "rgba(255, 255, 255, 0.62)",
  // Dock: frosted glass, with just enough white for Pine line icons to stay clear over a dark photo.
  dockGlass: ["rgba(22, 32, 28, 0.42)", "rgba(22, 32, 28, 0.5)"] as const,
  /** iOS materials already carry their own white. */
  dockGlassIos: ["rgba(22, 32, 28, 0.28)", "rgba(22, 32, 28, 0.36)"] as const,
  dockRim: "rgba(255, 255, 255, 0.16)",
  dockShadow: "0px 10px 28px rgba(10, 18, 15, 0.28)",
  onPine: "rgb(250, 248, 244)",
  dockInk: "rgba(250, 248, 244, 0.78)",
  dockEdge: "inset 0px 1px 0px rgba(255, 255, 255, 0.12)",
  /** The open tab: a lighter pane of glass on the dark glass, with a bright rim and a sheen. */
  dockPill: "rgba(255, 255, 255, 0.16)",
  /** The capsule brightens as it is lifted and moved, like a lens catching light. */
  dockPillSheen: ["rgba(255, 255, 255, 0.24)", "rgba(255, 255, 255, 0)"] as const,
  dockPillGlow: "rgba(255, 255, 255, 0.12)",
  dockPillEdge: "rgba(255, 255, 255, 0.34)",
  ink: "rgb(33, 50, 42)",
  soft: "rgba(33, 50, 42, 0.66)",
  hair: "rgba(33, 50, 42, 0.12)",
} as const;
