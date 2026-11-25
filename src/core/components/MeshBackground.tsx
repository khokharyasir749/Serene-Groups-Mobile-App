import { memo, useId } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { groups } from "@/core/constants/theme";

type Blob = { id: string; color: string; cx: string; cy: string; rx: string; ry: string; o: number };

// Pine from the top right and the lower page, champagne light between them. Kept soft enough for ink text anywhere.
const BLOBS: Blob[] = [
  { id: "p1", color: groups.meshPine, cx: "104%", cy: "2%", rx: "72%", ry: "27%", o: 0.82 },
  { id: "g1", color: groups.meshGold, cx: "98%", cy: "25%", rx: "46%", ry: "17%", o: 0.75 },
  { id: "l1", color: groups.meshLight, cx: "8%", cy: "10%", rx: "70%", ry: "26%", o: 0.8 },
  { id: "g2", color: groups.meshGold, cx: "-4%", cy: "50%", rx: "42%", ry: "20%", o: 0.5 },
  { id: "p2", color: groups.meshPine, cx: "96%", cy: "86%", rx: "86%", ry: "32%", o: 0.46 },
  { id: "p3", color: groups.meshPine, cx: "0%", cy: "102%", rx: "80%", ry: "28%", o: 0.4 },
  { id: "l2", color: groups.meshLight, cx: "44%", cy: "62%", rx: "52%", ry: "18%", o: 0.55 },
];

/** The Groups canvas: one still, full-screen drawing behind the scrolling page. */
export const MeshBackground = memo(function MeshBackground() {
  // Unique per page: several meshes can be mounted at once.
  const id = `m${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.base]}>
      <Svg width="100%" height="100%">
        <Defs>
          {BLOBS.map((b) => (
            <RadialGradient key={b.id} id={`${id}-${b.id}`} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fx={b.cx} fy={b.cy}>
              <Stop offset="0" stopColor={b.color} stopOpacity={b.o} />
              <Stop offset="0.5" stopColor={b.color} stopOpacity={b.o * 0.42} />
              <Stop offset="1" stopColor={b.color} stopOpacity={0} />
            </RadialGradient>
          ))}
          <RadialGradient id={`${id}-dot`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={groups.meshLight} stopOpacity={0.85} />
            <Stop offset="0.6" stopColor={groups.meshLight} stopOpacity={0.4} />
            <Stop offset="1" stopColor={groups.meshLight} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id={`${id}-coin`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={groups.meshGold} stopOpacity={0.7} />
            <Stop offset="1" stopColor={groups.meshGold} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {BLOBS.map((b) => (
          <Rect key={b.id} width="100%" height="100%" fill={`url(#${id}-${b.id})`} />
        ))}
        <Circle cx="80%" cy="21%" r="30" fill={`url(#${id}-dot)`} />
        <Circle cx="2%" cy="70%" r="34" fill={`url(#${id}-coin)`} />
        <Circle cx="14%" cy="73%" r="16" fill={`url(#${id}-dot)`} />
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({ base: { backgroundColor: groups.base } });
