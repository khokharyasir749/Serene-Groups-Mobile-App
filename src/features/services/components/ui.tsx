import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, spacing, svc } from "@/core/constants/theme";
import BrandLockup from "@/features/bookings/guest/components/BrandLockup";
import { Surface, SurfacePress, Press, type Finish } from "@/features/services/components/surface";
import type { Glyph } from "@/features/services/data/catalog";
import { exitToGroups, goBack } from "@/features/services/lib/nav";

export { Canvas, Surface, SurfacePress, Press } from "@/features/services/components/surface";

export function GroupsBack({ onPhoto }: { onPhoto?: boolean }) {
  return (
    <SurfacePress finish={onPhoto ? "clear" : "glass"} radius={21} onPress={exitToGroups} hitSlop={6} accessibilityLabel="Back to Serene Groups" style={styles.groups}>
      <Ionicons name="arrow-back-outline" size={14} color={onPhoto ? colors.white : colors.goldAccent} />
      <Text style={[styles.groupsText, onPhoto && styles.onPhotoText]}>Groups</Text>
    </SurfacePress>
  );
}

export function RoundButton({ icon, label, onPress, finish = "glass", size = 44 }: { icon: Glyph; label: string; onPress: () => void; finish?: Finish; size?: number }) {
  const ink = finish === "clear" || finish === "frost" || finish === "pine" ? colors.white : colors.ink;
  return (
    <SurfacePress finish={finish} radius={size / 2} onPress={onPress} hitSlop={6} accessibilityLabel={label} style={[styles.center, { width: size, height: size }, finish === "clear" && styles.onPhoto]}>
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
        <GroupsBack />
      </View>
      {!back && title ? words : null}
      <LinearGradient pointerEvents="none" colors={svc.headerFade} style={styles.fade} />
    </View>
  );
}

type ButtonFinish = "pine" | "ivory" | "dark" | "clear" | "frost" | "pineGlass";
const BUTTON_INK: Record<ButtonFinish, string> = { frost: colors.white, pineGlass: colors.white, pine: colors.white, ivory: colors.crestSlate, dark: colors.white, clear: colors.white };

/** The module's button: frost (on photos and Pine) or pineGlass (on light) for the main action, Pine for rows, ivory for the rest. */
export function ActionButton({ label, onPress, icon, finish = "pine", small, danger, style, accessibilityLabel }: { label: string; onPress: () => void; icon?: Glyph; finish?: ButtonFinish; small?: boolean; danger?: boolean; style?: StyleProp<ViewStyle>; accessibilityLabel?: string }) {
  const h = small ? 38 : 52;
  const ink = danger ? colors.danger : BUTTON_INK[finish];
  return (
    <SurfacePress finish={finish} radius={finish === "pine" || finish === "ivory" ? (small ? 12 : 16) : h / 2} onPress={onPress} hitSlop={small ? 6 : 0} accessibilityLabel={accessibilityLabel ?? label} style={[styles.button, { height: h, paddingHorizontal: small ? 17 : spacing.lg }, style]}>
      {icon ? <Ionicons name={icon} size={18} color={ink} /> : null}
      <Text style={[styles.buttonText, { color: ink, fontSize: small ? font.sm : font.md }]} numberOfLines={1} maxFontSizeMultiplier={1.15}>
        {label}
      </Text>
    </SurfacePress>
  );
}

/** Sub-heading with an optional quiet link on the right. */
export function Heading({ children, action, onAction }: { children: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.headRow}>
      <Text style={styles.heading} numberOfLines={1}>
        {children}
      </Text>
      {action && onAction ? (
        <Press onPress={onAction} hitSlop={10} style={styles.action}>
          <Text style={styles.actionText}>{action}</Text>
          <Ionicons name="chevron-forward-outline" size={14} color={colors.crestSlate} />
        </Press>
      ) : null}
    </View>
  );
}

/** Page section: serif title with a quiet label saying how it is charged. */
export function SectionTitle({ title, label, free }: { title: string; label: string; free?: boolean }) {
  return (
    <View style={styles.section}>
      <View style={styles.eyebrowRow}>
        <View style={styles.rule} />
        <Text style={[styles.eyebrow, free && styles.free]} numberOfLines={1}>
          {label.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

/** Short label in clear glass on a photo. */
export function PhotoBadge({ label }: { label: string }) {
  return (
    <Surface finish="clear" radius={8} style={styles.badge}>
      {/* Android under-measures this short run and wraps it; the reserved width keeps it on one line. */}
      <Text style={[styles.badgeText, { width: Math.ceil(label.length * 6.1) + 8 }]} numberOfLines={1} maxFontSizeMultiplier={1}>
        {label}
      </Text>
    </Surface>
  );
}

/** Photo filling its card, bled 2 px so the rounded clip never shows an edge line, with a neutral fade for captions. */
export function CardPhoto({ source }: { source?: ImageSource }) {
  return (
    <>
      <Image source={source} style={styles.photo} contentFit="cover" transition={250} />
      <LinearGradient colors={svc.photoFade} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
    </>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  onPhoto: { backgroundColor: colors.photoGlass },
  groups: { flexDirection: "row", alignItems: "center", gap: 6, height: 42, paddingHorizontal: 14 },
  groupsText: { color: colors.crestSlate, fontSize: font.sm, fontFamily: fonts.uiBold },
  onPhotoText: { color: colors.white },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  pinned: { zIndex: 2 },
  fade: { position: "absolute", left: 0, right: 0, bottom: -16, height: 16 },
  below: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  pageTitle: { color: colors.ink, fontSize: 32, lineHeight: 39, fontFamily: fonts.display },
  headTitle: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  headSub: { color: colors.muted, fontSize: 12 },
  button: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  buttonText: { fontFamily: fonts.uiBold },
  headRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 26 },
  section: { gap: 4 },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  rule: { width: 22, height: 1.5, backgroundColor: colors.goldAccent },
  eyebrow: { flex: 1, color: colors.goldText, fontSize: 10.5, letterSpacing: 1.5, fontFamily: fonts.uiBold },
  free: { color: colors.success },
  sectionTitle: { color: colors.ink, fontSize: 30, lineHeight: 37, fontFamily: fonts.display },
  heading: { flex: 1, color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  action: { flexDirection: "row", alignItems: "center", gap: 3 },
  actionText: { color: colors.crestSlate, fontSize: font.sm, fontFamily: fonts.uiSemi },
  badge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, height: 28, paddingHorizontal: 11, backgroundColor: colors.photoGlass },
  badgeText: { color: colors.white, fontSize: 11, textAlign: "center", fontFamily: fonts.uiSemi },
  photo: { position: "absolute", top: -2, left: -2, right: -2, bottom: -2 },
});
