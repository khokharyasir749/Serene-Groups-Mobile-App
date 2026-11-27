import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/features/services/components/Text";
import { colors, font, spacing, svc } from "@/core/constants/theme";
import BrandLockup from "@/features/bookings/guest/components/BrandLockup";
import { Surface, SurfacePress, Press, type Finish } from "@/features/services/components/surface";
import { Headline } from "@/features/services/components/scroll";
import { tone } from "@/features/services/components/tone";
import type { Glyph } from "@/features/services/data/catalog";
import { exitToGroups, goBack } from "@/features/services/lib/nav";
import { type } from "@/features/services/components/type";
import { sf } from "@/features/services/components/fonts";

export { Canvas, Surface, SurfacePress, Press } from "@/features/services/components/surface";

export function GroupsBack({ onPhoto }: { onPhoto?: boolean }) {
  return (
    <SurfacePress finish={onPhoto ? "clear" : "glass"} radius={22} onPress={exitToGroups} hitSlop={6} accessibilityLabel="Back to Serene Groups" style={styles.groups}>
      <Ionicons name="arrow-back-outline" size={14} color={onPhoto ? colors.white : tone.ink} />
      <Text style={[styles.groupsText, onPhoto && styles.onPhotoText]}>Groups</Text>
    </SurfacePress>
  );
}

export function RoundButton({ icon, label, onPress, finish = "glass", size = 44 }: { icon: Glyph; label: string; onPress: () => void; finish?: Finish; size?: number }) {
  const ink = finish === "clear" || finish === "frost" || finish === "pine" ? colors.white : colors.ink;
  return (
    <SurfacePress finish={finish} radius={size * 0.32} onPress={onPress} hitSlop={6} accessibilityLabel={label} style={[styles.center, { width: size, height: size }, finish === "clear" && styles.onPhoto]}>
      <Ionicons name={icon} size={20} color={ink} />
    </SurfacePress>
  );
}

/** Pinned header, clear of the status bar. Tabs carry the same brand lockup as Serene Bookings (title below it); pushed pages show a back button. */
export function ServicesHeader({ title, overline, back }: { title?: string; overline?: string; back?: boolean }) {
  const insets = useSafeAreaInsets();
  const words = (
    <View style={back ? styles.fill : styles.below}>
      <Text style={back ? styles.headTitle : styles.pageTitle} numberOfLines={1}>
        {title}
      </Text>
      {overline ? (
        <Text style={styles.headSub} numberOfLines={1}>
          {overline}
        </Text>
      ) : null}
    </View>
  );
  return (
    <View style={[styles.pinned, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        {back ? (
          <>
            <RoundButton icon="chevron-back-outline" label="Back" onPress={goBack} />
            {words}
          </>
        ) : (
          <View style={styles.fill}>
            <BrandLockup sub="SERVICES" />
          </View>
        )}
        {back ? null : <GroupsBack />}
      </View>
      {!back && title ? words : null}
      <LinearGradient pointerEvents="none" colors={tone.pageFade} style={styles.fade} />
    </View>
  );
}

type ButtonFinish = "pine" | "ivory" | "dark" | "clear" | "frost" | "pineGlass";
const BUTTON_INK: Record<ButtonFinish, string> = { frost: colors.white, pineGlass: colors.white, pine: colors.white, ivory: tone.ink, dark: colors.white, clear: colors.white };

/** The module's button: frost (on photos and Pine) or pineGlass (on light) for the main action, Pine for rows, ivory for the rest. */
export function ActionButton({ label, onPress, icon, finish = "pine", small, danger, style, accessibilityLabel }: { label: string; onPress: () => void; icon?: Glyph; finish?: ButtonFinish; small?: boolean; danger?: boolean; style?: StyleProp<ViewStyle>; accessibilityLabel?: string }) {
  const h = small ? 38 : 52;
  const ink = danger ? colors.danger : BUTTON_INK[finish];
  return (
    <SurfacePress finish={finish} radius={h / 2} onPress={onPress} hitSlop={small ? 6 : 0} accessibilityLabel={accessibilityLabel ?? label} style={[styles.button, { height: h, paddingHorizontal: small ? 17 : spacing.lg }, style]}>
      {icon ? <Ionicons name={icon} size={18} color={ink} /> : null}
      <Text style={[styles.buttonText, { color: ink, fontSize: small ? font.sm : font.md }]} numberOfLines={1} maxFontSizeMultiplier={1.15}>
        {label}
      </Text>
    </SurfacePress>
  );
}

/** Serif title over each group, with an optional line beneath and a quiet link behind. */
export function Heading({ children, note, action, onAction, light, small }: { children: string; note?: string; action?: string; onAction?: () => void; /** On Pine. */ light?: boolean; /** Inside a form. */ small?: boolean }) {
  return (
    <View style={styles.headRow}>
      <View style={styles.fill}>
        {small ? null : <View style={styles.rule} />}
        <Headline text={children} soft={small || !children.includes(" ") ? 0 : 1} softStyle={light ? styles.softDark : styles.soft} style={[styles.heading, small && styles.headingSmall, light && styles.onPhotoText]} />
        {note ? <Text style={styles.headNote}>{note}</Text> : null}
      </View>
      {action && onAction ? (
        <Press onPress={onAction} hitSlop={10} style={styles.action}>
          <Text style={[styles.actionText, light && styles.onPhotoText]}>{action}</Text>
          <Ionicons name="arrow-forward-outline" size={14} color={light ? colors.white : tone.ink} />
        </Press>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  onPhoto: { backgroundColor: colors.photoGlass },
  groups: { flexDirection: "row", alignItems: "center", gap: 5, height: 40, paddingHorizontal: 15 },
  groupsText: { ...type.label, fontSize: 13.5, color: tone.ink },
  onPhotoText: { color: colors.white },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  pinned: { zIndex: 2 },
  fade: { position: "absolute", left: 0, right: 0, bottom: -16, height: 16 },
  below: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  pageTitle: { ...type.page, color: tone.ink },
  headTitle: { color: tone.ink, fontSize: 16.5, lineHeight: 22, letterSpacing: -0.2, fontFamily: sf.uiSemi },
  headSub: { ...type.label, color: tone.soft },
  button: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  buttonText: { fontFamily: sf.uiSemi, letterSpacing: 0.3 },
  headRow: { flexDirection: "row", alignItems: "flex-end", gap: 10, minHeight: 26 },
  soft: { color: tone.goldText },
  softDark: { color: tone.champagne },
  rule: { width: 28, height: 1.5, marginBottom: 10, backgroundColor: tone.goldText },
  heading: { ...type.title, color: tone.ink },
  headingSmall: { fontSize: 21, lineHeight: 28, letterSpacing: -0.2 },
  headNote: { ...type.label, color: tone.soft, marginTop: 2 },
  action: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionText: { ...type.label, fontSize: 13.5, color: tone.pine },
});
