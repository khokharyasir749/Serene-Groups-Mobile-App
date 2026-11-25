import { StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { groups } from "@/core/constants/theme";

const FLOORS = [0, 1, 2, 3, 4, 5, 6];

/** Quiet drawings under each figure: a ridgeline, contour lines, a tower, and a wall of windows. Decoration, not data. */
export function StatArt({ kind }: { kind: 0 | 1 | 2 | 3 }) {
  return (
    <Svg width="100%" height={62} viewBox="0 0 160 62" preserveAspectRatio="xMidYMax slice" style={styles.art}>
      <Defs>
        <LinearGradient id={`stat-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={groups.champagne} stopOpacity={0.6} />
          <Stop offset="1" stopColor={groups.champagne} stopOpacity={0.12} />
        </LinearGradient>
      </Defs>
      {kind === 0 ? (
        <>
          <Path d="M0 62V48L20 34l12 8L58 16l18 20 14-10 22 20 16-12 32 20v10z" fill={`url(#stat-0)`} />
          <Path d="M0 48 20 34l12 8L58 16l18 20 14-10 22 20 16-12 32 20" fill="none" stroke={groups.champagne} strokeWidth={1.4} strokeLinejoin="round" />
          <Path d="M50 24 58 16l8 9-5-1-3 4-3-4z" fill={groups.plate} />
        </>
      ) : null}
      {kind === 1
        ? ["M-4 20C20 4 44 30 70 18s40-18 94 2", "M-4 32C22 14 46 42 74 30s42-16 90 4", "M-4 44C26 26 48 54 78 42s44-14 86 4", "M-4 56C28 38 52 66 82 54s42-12 82 4", "M96 34c8-6 24-4 26 3s-12 12-22 9-10-8-4-12z", "M103 37c5-3 12-2 13 1s-6 6-11 4-5-3-2-5z"].map((d) => <Path key={d} d={d} fill="none" stroke={groups.artLine} strokeWidth={0.9} />)
        : null}
      {kind === 2 ? (
        <>
          <Rect x="62" y="4" width="38" height="60" rx="3" fill="url(#stat-2)" stroke={groups.champagne} strokeWidth={1.2} />
          <Rect x="38" y="26" width="24" height="40" rx="2" fill={groups.artSoft} stroke={groups.art} strokeWidth={1} />
          <Rect x="100" y="34" width="26" height="30" rx="2" fill={groups.artSoft} stroke={groups.art} strokeWidth={1} />
          {FLOORS.map((f) => (
            <Path key={f} d={`M66 ${11 + f * 8}h30`} stroke={groups.champagne} strokeWidth={1.1} />
          ))}
        </>
      ) : null}
      {kind === 3
        ? FLOORS.flatMap((c) => [0, 1, 2].map((r) => <Rect key={`${c}-${r}`} x={10 + c * 21} y={6 + r * 20} width={13} height={14} rx={6.5} fill={(c + r) % 3 === 0 ? groups.champagne : groups.artSoft} stroke={groups.art} strokeWidth={0.9} />))
        : null}
    </Svg>
  );
}

const styles = StyleSheet.create({ art: { position: "absolute", left: 0, right: 0, bottom: 0 } });
