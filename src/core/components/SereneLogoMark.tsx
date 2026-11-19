import Svg, { ClipPath, Defs, G, Path, Polygon, Rect } from "react-native-svg";
import { colors } from "@/core/constants/theme";

type Props = {
  /** Pixel width; height follows the crest's 34 : 42 proportion. Legacy sizes: "sm" = 34, "md" = 44. */
  width?: number;
  /** Emblem body colour; defaults to the logo's deep pine-slate. */
  fill?: string;
  /** Mountain / snow colour; defaults to the logo's soft off-white. */
  snow?: string;
};

const VB_W = 34;
const VB_H = 42;

/**
 * Serene Heights crest, ported verbatim from the Serene Management app: thin outer capsule outline, a narrow
 * gap, then a solid capsule carrying a ridge line, a snow-capped central peak and a smaller right ridge.
 * Geometry is identical; only the size is a prop.
 */
export function SereneLogoMark({ width = VB_W, fill = colors.crestSlate, snow = colors.snow }: Props) {
  const height = (width * VB_H) / VB_W;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
      <Defs>
        <ClipPath id="serene-crest-inner">
          <Rect x="3.6" y="3.6" width="26.8" height="34.8" rx="13.4" />
        </ClipPath>
      </Defs>
      <Rect x="0.75" y="0.75" width="32.5" height="40.5" rx="16.25" fill="none" stroke={fill} strokeWidth={1.5} />
      <Rect x="3.6" y="3.6" width="26.8" height="34.8" rx="13.4" fill={fill} />
      <G clipPath="url(#serene-crest-inner)">
        <Path d="M3 27.5 L8.8 21 L12 24.2 L18 13.5" fill="none" stroke={snow} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M18 13.5 L22.2 22 L26 19 L31 26" fill="none" stroke={snow} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Polygon points="18,13.5 13.2,22.2 19.2,24.6" fill={snow} />
      </G>
    </Svg>
  );
}
