import { memo } from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { iconInk as K } from "@/core/constants/theme";

// Shaded object icons, drawn as one set on a 48 grid: light from the top left, soft contact shadow, shared materials.
const grad = (id: string, a: string, b: string, c: string) => `<linearGradient id="${id}" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="0.55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;

const DEFS = `<defs>${[
  grad("linen", K.linen[0], K.linen[1], K.linen[2]),
  grad("brass", K.brass[0], K.brass[1], K.brass[2]),
  grad("pine", K.pine[0], K.pine[1], K.pine[2]),
  grad("steel", K.steel[0], K.steel[1], K.steel[2]),
  grad("wood", K.wood[0], K.wood[1], K.wood[2]),
  grad("water", K.water[0], K.water[1], K.water[2]),
  grad("stone", K.stone[0], K.stone[1], K.stone[2]),
].join("")}<radialGradient id="glow" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="${K.lamp[0]}"/><stop offset="0.6" stop-color="${K.lamp[1]}"/><stop offset="1" stop-color="${K.lamp[2]}"/></radialGradient></defs>`;

const shadow = (cx = 24, cy = 43, rx = 15) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="1.9" fill="${K.dark}" opacity="0.14"/>`;
const line = (d: string, w = 0.9, c: string = K.seam, o = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"/>`;
const fill = (d: string, f: string, extra = "") => `<path d="${d}" fill="${f}" ${extra}/>`;
const rect = (x: number, y: number, w: number, h: number, r: number, f: string, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${extra}/>`;
const ell = (cx: number, cy: number, rx: number, ry: number, f: string, extra = "") => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${extra}/>`;
const EDGE = `stroke="${K.seam}" stroke-width="0.6"`;
const m = (name: string) => `url(#${name})`;

const towel = (x: number, y: number, w: number, body: string, seam: string, band: string) =>
  rect(x, y, w, 9.6, 4.8, body, EDGE) + line(`M${x + 5} ${y + 4.8}H${x + w - 6}`, 0.8, seam, 0.8) + rect(x + 7, y + 0.4, 2.6, 8.8, 0.6, band, 'opacity="0.9"') + line(`M${x + w - 3} ${y + 2.4}c-2 0.6-2.600 4-0.400 4.900`, 0.8, seam, 0.9);

const PILLOW = "M8 17.500C6.200 13.600 9.500 12.200 12.800 13.200Q24 15.600 35.200 13.200C38.500 12.200 41.800 13.600 40 17.500Q38 24.500 40 31.500C41.800 35.400 38.500 37 35.200 35.800Q24 33.400 12.800 35.800C9.500 37 6.200 35.400 8 31.500Q10 24.500 8 17.500Z";
const PLATE =
  shadow(24, 39, 14) + ell(24, 24, 13.5, 13.5, m("linen"), EDGE) + ell(24, 24, 9, 9, K.linen[0], `stroke="${K.linen[2]}" stroke-width="0.9"`) +
  fill("M4.500 10v6.500a3.200 3.200 0 0 0 2.200 3V38a1.500 1.500 0 0 0 3 0V19.500a3.200 3.200 0 0 0 2.200-3V10h-1.300v6h-1.500v-6H7.600v6H6v-6z", m("steel"), `stroke="${K.steelEdge}" stroke-width="0.4"`) +
  fill("M42.500 9.500c-3.300 1.800-4.800 7-4.600 12.500 0 1.200 0.800 1.800 1.800 1.800V38a1.500 1.500 0 0 0 3 0z", m("steel"), `stroke="${K.steelEdge}" stroke-width="0.4"`);

const ART = {
  towels: shadow(24, 42.5, 16) + towel(7, 31, 34, m("linen"), K.seam, m("brass")) + towel(8, 21.200, 32, m("pine"), K.pine[0], m("brass")) + towel(9.500, 11.400, 29, m("linen"), K.seam, m("brass")),
  pillow: shadow(25, 41, 15) + `<g transform="rotate(-7 24 24) translate(2.500 -4) scale(0.94)">${fill(PILLOW, m("pine"))}</g>` + `<g transform="translate(-1 4) scale(0.96)">${fill(PILLOW, m("linen"), `stroke="${K.brass[1]}" stroke-width="0.9"`)}${line("M13.500 17.500c2.500 1.500 3.500 3 4 5M34.500 17.500c-2.500 1.500-3.500 3-4 5M14 31.500c2-1 3-2.200 3.500-3.600M34 31.500c-2-1-3-2.200-3.500-3.600", 0.8, K.seam, 0.9)}</g>`,
  turndown:
    shadow(24, 42.5, 17) + rect(6.2, 13, 35.6, 20, 5, m("wood")) + rect(8.500, 15.500, 31, 14, 3.500, K.wood[0], 'opacity="0.35"') + rect(10, 20, 12.500, 8, 3.500, m("linen"), EDGE) + rect(25.500, 20, 12.500, 8, 3.500, m("linen"), EDGE) +
    rect(5, 26.500, 38, 12, 3.500, m("linen"), EDGE) + fill("M5 30.500h38V36a3.500 3.500 0 0 1-3.500 3.500h-31A3.500 3.500 0 0 1 5 36z", m("pine")) + fill("M5 30.200h38v2.600H5z", K.linen[0], 'opacity="0.9"') + rect(7.500, 39, 3, 3, 0.8, m("wood")) + rect(37.500, 39, 3, 3, 0.8, m("wood")) +
    fill("M38.500 9.800A5.200 5.200 0 1 1 32.600 3.200a4.200 4.200 0 0 0 5.900 6.600z", m("brass")),
  "wake-up":
    shadow(24, 43, 12) + line("M14.500 38 11 42.500M33.500 38l3.500 4.500", 3, K.brass[2]) + fill("M6.500 16.500a7 7 0 0 1 11-7.200z", m("brass")) + fill("M41.500 16.500a7 7 0 0 0-11-7.200z", m("brass")) + rect(22.800, 6, 2.400, 6, 1, K.brass[2]) + ell(24, 6, 2.600, 1.700, m("brass")) +
    ell(24, 26.500, 15, 15, m("brass")) + ell(24, 26.500, 11.800, 11.800, K.linen[0], `stroke="${K.brass[2]}" stroke-width="0.7"`) + line("M24 16.700v1.800M24 34.500v1.800M14.200 26.500H16M32 26.500h1.800", 1.100, K.pine[2]) + line("M24 19.500v7l5 3.200", 1.700, K.pine[2]) + ell(24, 26.500, 1.400, 1.400, K.brass[2]) + line("M14.500 20a11 11 0 0 1 5-4.800", 1, K.white, 0.8),
  "ac-heating":
    rect(4, 11, 40, 16.500, 4.500, m("linen"), `stroke="${K.steelEdge}" stroke-width="0.6"`) + rect(5.500, 12.200, 37, 3, 1.500, K.white, 'opacity="0.8"') + line("M4.500 20.200h39", 0.6, K.steelEdge, 0.7) + rect(8, 22.200, 32, 3.200, 1.600, K.dark, 'opacity="0.72"') + line("M9.500 23.200h29", 0.5, K.white, 0.5) + ell(38.500, 17.700, 1, 1, K.led) + line("M33 17.700h3", 0.9, K.steelEdge) +
    line("M13 31.500c2.200 2-2.200 4.200 0 7M24 31.500c2.200 2-2.200 4.200 0 8M35 31.500c2.200 2-2.200 4.200 0 7", 1.900, K.water[1], 0.85),
  plumbing:
    shadow(22, 43, 13) + rect(9, 38.500, 15, 4, 1.600, m("steel"), `stroke="${K.steelEdge}" stroke-width="0.4"`) + fill("M12 39V22.500A10 10 0 0 1 22 12.500h4.500a10 10 0 0 1 10 10V27H29v-4.500a2.500 2.500 0 0 0-2.500-2.500H22a2.500 2.500 0 0 0-2.500 2.500V39z", m("steel"), `stroke="${K.steelEdge}" stroke-width="0.5"`) +
    line("M14 37V22.500a8 8 0 0 1 8-8h4", 1.300, K.white, 0.85) + rect(27.800, 26, 9.900, 2.800, 1, K.steel[2]) + rect(20.500, 7.500, 4, 6, 1, K.steel[2]) + rect(14, 4.200, 17, 4.400, 2.200, m("brass")) +
    fill("M32.800 31.500c2.700 3.300 4 5.200 4 7.200a4 4 0 0 1-8 0c0-2 1.300-3.900 4-7.200z", m("water")) + line("M30.800 38.800a2 2 0 0 0 1.600 2", 0.9, K.white, 0.9),
  electrical:
    shadow(20, 44, 8) + ell(20, 19, 13.500, 13.500, m("glow")) + fill("M20 5.500a13.500 13.500 0 0 1 8.500 24c-1.800 1.500-2.500 3-2.700 5H14.200c-0.200-2-0.900-3.500-2.700-5A13.500 13.500 0 0 1 20 5.500z", m("glow"), `stroke="${K.brass[2]}" stroke-width="0.6"`) + line("M16 34l-1.500-11 3 2 2.500-2.500 2.500 2.500 3-2L24 34", 1, K.brass[2]) + line("M11.500 15.500a9.500 9.500 0 0 1 4.500-5.700", 1.500, K.white, 0.9) +
    rect(14, 34, 12, 2.600, 1.200, m("steel")) + rect(14.600, 37, 10.800, 2.600, 1.200, m("steel")) + rect(16, 39.600, 8, 3, 1.500, K.steel[2]) + line("M32.500 14.500a9 9 0 0 1 11.500 0M35 18.300a5.200 5.200 0 0 1 6.500 0", 1.900, K.pine[1]) + ell(38.250, 22.300, 1.500, 1.500, K.pine[1]),
  furniture:
    shadow(24, 43, 17) + rect(10, 37, 3.200, 5.500, 1, m("wood")) + rect(34.800, 37, 3.200, 5.500, 1, m("wood")) + rect(9.500, 9, 29, 24, 8, m("pine")) + line("M24 12v14", 0.7, K.pine[0], 0.7) + ell(18, 18, 0.9, 0.9, K.brass[1]) + ell(30, 18, 0.9, 0.9, K.brass[1]) + rect(13, 24.500, 22, 9, 3, K.pine[0]) +
    fill("M5 24a4.500 4.500 0 0 1 9 0v7.500h20V24a4.500 4.500 0 0 1 9 0v11a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z", m("pine"), `stroke="${K.pine[2]}" stroke-width="0.5"`) + line("M7 24a2.500 2.500 0 0 1 4-1.800", 1, K.white, 0.35) + `<g transform="rotate(12 28 25)">${rect(23, 19.500, 10, 10, 2.500, m("brass"))}</g>`,
  message:
    shadow(24, 43, 12) + fill("M10 8h28a5 5 0 0 1 5 5v17a5 5 0 0 1-5 5H24l-8.500 7v-7H10a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5z", m("pine")) + line("M8 14a3.500 3.500 0 0 1 3.500-3.500H24", 1, K.white, 0.35) + rect(12, 16.500, 24, 2.400, 1.200, K.linen[0]) + rect(12, 22, 24, 2.400, 1.200, K.linen[0], 'opacity="0.8"') + rect(12, 27.500, 14, 2.400, 1.200, K.brass[1]),
  dining: PLATE,
  restaurant: PLATE,
  "room-service":
    shadow(24, 42, 18) + ell(24, 37, 20, 3.600, m("steel"), `stroke="${K.steelEdge}" stroke-width="0.5"`) + fill("M7.500 34.500a16.500 16.500 0 0 1 33 0c-4 1.800-29 1.800-33 0z", m("steel"), `stroke="${K.steelEdge}" stroke-width="0.5"`) + line("M12 30a12.500 12.500 0 0 1 8-8.500", 1.800, K.white, 0.9) + fill("M8 33.300c5 1.500 27 1.500 32 0v1.400c-5 1.600-27 1.600-32 0z", K.brass[1], 'opacity="0.75"') + rect(22.800, 14.500, 2.400, 4, 1, K.brass[2]) + ell(24, 13, 2.900, 2.900, m("brass")) + ell(23.100, 12.100, 0.9, 0.9, K.white, 'opacity="0.8"'),
  minibar:
    shadow(23, 43, 14) + fill("M15 4h6v9c0 2.500 5 4 5 9v18a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V22c0-5 5-6.500 5-9z", m("pine"), `stroke="${K.pine[2]}" stroke-width="0.5"`) + rect(14.500, 3.200, 7, 3.600, 1, m("brass")) + rect(10, 26, 16, 9.500, 0.6, m("linen")) + line("M13 29.300h10M14.500 32.200h7", 0.9, K.brass[2]) + line("M12.500 23c0-2.500 3-4 4-6.500", 1.200, K.white, 0.4) +
    fill("M28 25h13l-1.500 15.500a2.500 2.500 0 0 1-2.500 2.300h-5a2.500 2.500 0 0 1-2.500-2.300z", K.white, `opacity="0.75" stroke="${K.steelEdge}" stroke-width="0.6"`) + fill("M28.800 32.500h11.400l-0.800 8a2 2 0 0 1-2 1.800h-5.800a2 2 0 0 1-2-1.800z", m("water"), 'opacity="0.75"') + rect(31.500, 29.800, 5, 5, 1, K.white, 'opacity="0.75" transform="rotate(14 34 32)"'),
  breakfast:
    shadow(22, 43, 17) + ell(21.500, 39.500, 17.500, 3.200, m("linen"), EDGE) + `<path d="M34 23.500h3a5.500 5.500 0 0 1 0 11h-4.500" fill="none" stroke="${K.linen[2]}" stroke-width="3"/>` + fill("M7 19.500h29V28c0 6.500-5 11-11 11h-7C12 39 7 34.500 7 28z", m("linen"), EDGE) + ell(21.500, 19.500, 14.500, 3.400, K.linen[0], EDGE) + ell(21.500, 19.800, 12.300, 2.500, K.coffee) + ell(19.500, 19.500, 4.500, 0.9, K.wood[0], 'opacity="0.7"') + line("M10 24c0 5 1.500 8 4.500 10.500", 1.300, K.white, 0.9) + rect(7.200, 25, 28.600, 1.200, 0.6, K.brass[1], 'opacity="0.8"') +
    line("M16.500 14.500c-2-2.500 2-4 0-7M22 13.500c-2-2.500 2-4 0-7.500M27.500 14.500c-2-2.500 2-4 0-7", 1.300, K.steelEdge, 0.6),
  spa:
    shadow(24, 43, 17) + ell(24, 38, 17, 5, m("stone")) + ell(23.500, 30.300, 12.500, 4.200, m("stone")) + ell(24.200, 23.600, 8.800, 3.500, m("stone")) + line("M12 37c3-1.600 7-2.200 10-2.200M15 29.200c2-1.200 4.500-1.700 7-1.700M18.500 22.700c1.500-0.900 3-1.200 4.500-1.200", 1, K.white, 0.5) +
    fill("M24 19.500c-3.500-2.500-4.500-7-3.500-11 2 1 3.500 3 3.500 6 0-3 1.500-5 3.500-6 1 4 0 8.500-3.500 11z", m("linen"), EDGE) + fill("M23 19.500c-5 0.500-9-2-10.500-6 4-1 8 0.500 10.500 6z", m("linen"), EDGE) + fill("M25 19.500c5 0.500 9-2 10.500-6-4-1-8 0.500-10.500 6z", m("linen"), EDGE) + ell(24, 18.600, 2, 1.500, m("brass")),
  transfer:
    shadow(24, 41.5, 19) + rect(7, 33, 6.500, 8, 2, K.dark) + rect(34.500, 33, 6.500, 8, 2, K.dark) + fill("M12.500 10.500A4.500 4.500 0 0 1 16.500 8h15a4.500 4.500 0 0 1 4 2.500L40 21H8z", m("pine")) + fill("M14.500 12.500A2.500 2.500 0 0 1 16.800 11h14.400a2.500 2.500 0 0 1 2.300 1.500L36.500 20h-25z", m("water"), 'opacity="0.9"') + line("M16 18.500l3-6", 1.500, K.white, 0.6) +
    fill("M8 20h32a4 4 0 0 1 4 4v9.500a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V24a4 4 0 0 1 4-4z", m("pine"), `stroke="${K.pine[2]}" stroke-width="0.5"`) + line("M7 23.200c10-1.200 24-1.200 34 0", 0.9, K.white, 0.35) + ell(10.500, 27, 3.500, 2.500, m("glow")) + ell(37.500, 27, 3.500, 2.500, m("glow")) + rect(17, 25, 14, 4.500, 1.500, m("steel")) + line("M19 27.200h10", 0.7, K.dark, 0.5) + rect(18.500, 31.800, 11, 3, 0.8, K.linen[0]) + ell(3.800, 18.500, 2.200, 1.600, K.pine[1]) + ell(44.200, 18.500, 2.200, 1.600, K.pine[1]),
  maintenance:
    shadow(24, 43, 15) + `<g transform="rotate(45 24 24)">${fill("M19.500 4.500v7.500h9V4.500a9.500 9.500 0 0 1 0 17.800V41a4.500 4.500 0 0 1-9 0V22.300a9.500 9.500 0 0 1 0-17.800z", m("steel"), `stroke="${K.steelEdge}" stroke-width="0.6"`)}${line("M21 23.500V40", 1.200, K.white, 0.8)}${ell(24, 40.500, 1.700, 1.700, K.steelEdge, 'opacity="0.7"')}</g>` +
    `<g transform="rotate(-45 24 24)">${rect(22.700, 3, 2.600, 20, 0.8, m("steel"), `stroke="${K.steelEdge}" stroke-width="0.4"`)}${fill("M22 3h4l-0.700-2.500h-2.600z", K.steel[2])}${rect(20, 22.500, 8, 20, 3.600, m("brass"), `stroke="${K.brass[2]}" stroke-width="0.5"`)}${line("M22.200 26v13M25.800 26v13", 0.8, K.brass[2], 0.8)}</g>`,
  "valet-laundry":
    shadow(24, 44, 12) + `<path d="M24 11.500V9.500c2.200-0.500 3.200-1.700 3.200-3.300A3.200 3.200 0 0 0 20.900 5.600" fill="none" stroke="${K.steelEdge}" stroke-width="1.600" stroke-linecap="round"/>` + fill("M17 12h14l10 6-3.500 9-4.500-2v18H15V25l-4.500 2L7 18z", m("linen"), `stroke="${K.seam}" stroke-width="0.7" stroke-linejoin="round"`) + fill("M17 12l7 6.500L31 12l-2.500-1.500h-9z", K.linen[2]) + fill("M17 12l7 6.500-4.500 4L14.500 14z", K.linen[0], EDGE) + fill("M31 12l-7 6.500 4.500 4 5-8.500z", K.linen[0], EDGE) + fill("M24 18.500l2.200 2.500-1.200 2 2 12-3 4-3-4 2-12-1.200-2z", m("pine")) + line("M15 25.500v-4M33 25.500v-4", 0.8, K.seam),
} satisfies Record<string, string>;

export type ServiceIconName = keyof typeof ART;

const XML = Object.fromEntries(Object.entries(ART).map(([k, art]) => [k, `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">${DEFS}${art}</svg>`])) as Record<ServiceIconName, string>;

/** Realistic object icon. */
export const ServiceIcon = memo(function ServiceIcon({ name, size = 40 }: { name: ServiceIconName; size?: number }) {
  return (
    <View>
      <SvgXml xml={XML[name]} width={size} height={size} />
    </View>
  );
});
