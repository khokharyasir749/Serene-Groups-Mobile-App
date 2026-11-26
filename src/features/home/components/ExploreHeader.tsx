import { useCallback, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AccountButton } from "@/core/components/AccountButton";
import { GroupsMenu } from "@/core/components/GroupsMenu";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { Text } from "@/core/components/Text";
import { colors, explore, fonts, groups, spacing } from "@/core/constants/theme";

const ROW = 56;
const PAD = 6;
/** Height of the pinned header below the status bar. */
export const HEADER_HEIGHT = ROW + PAD * 2;

function Brand({ light }: { light?: boolean }) {
  return (
    <View style={styles.brand}>
      <SereneLogoMark width={40} fill={light ? colors.snow : groups.pine} snow={light ? groups.pine : groups.plate} />
      <View style={styles.words}>
        <Text style={[styles.name, light && styles.nameLight]} numberOfLines={1} adjustsFontSizeToFit>
          SERENE GROUP
        </Text>
        <Text style={[styles.sub, light && styles.subLight]} numberOfLines={1}>
          BY DM CONSORTIUM
        </Text>
      </View>
    </View>
  );
}

type Props = {
  /** Page scroll position. */
  y: Animated.Value;
  /** Scroll position where the hero has passed and the header is fully solid. */
  solidAt: number;
  /** Whether the page is past the hero (drives the status bar). */
  solid: boolean;
};

/** Clear over the hero photo; turns into a solid ivory bar with Pine lettering once the hero has scrolled past. */
export function ExploreHeader({ y, solidAt, solid }: Props) {
  const insets = useSafeAreaInsets();
  const [focused, setFocused] = useState(false);
  // Tabs stay mounted: only the page in front may set the status bar.
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );
  const range = [solidAt - 70, solidAt];
  const on = y.interpolate({ inputRange: range, outputRange: [0, 1], extrapolate: "clamp" });
  const off = y.interpolate({ inputRange: range, outputRange: [1, 0], extrapolate: "clamp" });
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingTop: insets.top + PAD }]}>
      {focused ? <StatusBar style={solid ? "dark" : "light"} /> : null}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.bar, { opacity: on }]} />
      <View pointerEvents="box-none" style={styles.row}>
        <View pointerEvents="none" style={styles.brandBox}>
          <Animated.View style={{ opacity: off }}>
            <Brand light />
          </Animated.View>
          {/* The same words in Pine: screen readers skip this copy. */}
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: on }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <Brand />
          </Animated.View>
        </View>
        <AccountButton glass={!solid} />
        <GroupsMenu glass={!solid} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", top: 0, left: 0, right: 0, paddingBottom: PAD },
  bar: { backgroundColor: explore.header, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: groups.plateEdge },
  row: { height: ROW, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: spacing.lg },
  brandBox: { flex: 1 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  words: { flex: 1, gap: 1 },
  name: { color: groups.pine, fontFamily: fonts.display, fontSize: 20, lineHeight: 26, letterSpacing: 1.4 },
  nameLight: { color: colors.white },
  sub: { color: groups.goldInk, fontSize: 10.5, lineHeight: 14, letterSpacing: 0.9, fontFamily: fonts.uiMedium },
  subLight: { color: explore.gold },
});
