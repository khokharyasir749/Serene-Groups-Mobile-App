import { memo, useMemo, useRef, useState, type ComponentRef, type ReactNode } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/core/constants/theme";
import { isReduced } from "@/features/services/components/motion";
import { Headline, SceneGroup, useScene } from "@/features/services/components/scroll";
import { Press } from "@/features/services/components/surface";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";

const BAR = 56; // HeroPage's small title bar; panels hold just under it
const LIP = 28;
/** Gap between the blocks of a HeroPage. */
const GAP = 44;

export type CurtainPanel = { key: string; photo?: ImageSource; over: string; name: string; lines?: string[]; cta: string; ctaLabel?: string; onOpen: () => void; onCta?: () => void };

type PanelProps = { panel: CurtainPanel; index: number; h: number; /** Scroll position at which this panel reaches the bar. */ pin: number | null; win: number; last: boolean; loose?: boolean };

function Panel({ panel, index, h, pin, win, last, loose }: PanelProps) {
  const scene = useScene();
  const m = useMemo(() => {
    if (!scene || pin === null || isReduced()) return null;
    const at = (inputRange: number[], outputRange: number[]) => scene.y.interpolate({ inputRange, outputRange, extrapolate: "clamp" });
    return {
      // The last one lets go early, so it never hangs below a short page.
      hold: last ? (loose ? null : at([pin, pin + h * 0.45], [0, h * 0.45])) : at([pin, pin + h], [0, h]),
      // In: the picture eases back as the panel rises. Held: it keeps moving slowly while the next one is drawn over it.
      zoom: at([pin - win, pin, pin + h], [1.24, 1.04, 1.14]),
      slide: at([pin - win, pin, pin + h], [-70, 0, -34]),
      dim: at([pin, pin + h], [0, 0.66]),
      // A panel already in sight when the page opens shows its words at once.
      words: pin - h * 0.78 < 60 ? null : at([pin - h * 0.78, pin - h * 0.3], [0, 1]),
      leave: at([pin + h * 0.26, pin + h * 0.52], [1, 0]),
      lift: at([pin + h * 0.2, pin + h], [0, -64]),
    };
  }, [scene, pin, h, win, last, loose]);
  return (
    <Animated.View style={[styles.panel, { top: index * h, height: h + LIP }, index > 0 && styles.lip, m?.hold ? { transform: [{ translateY: m.hold }] } : null]}>
      <Press onPress={panel.onOpen} accessibilityLabel={`${panel.name}. ${panel.over}`} style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.photo, m ? { transform: [{ translateY: m.slide }, { scale: m.zoom }] } : null]}>
          <Image cachePolicy="memory-disk" source={panel.photo} style={StyleSheet.absoluteFill} contentFit="cover" transition={120} />
        </Animated.View>
        <LinearGradient pointerEvents="none" colors={tone.panelFade} locations={[0, 0.34, 0.66, 1]} style={StyleSheet.absoluteFill} />
      </Press>
      <Animated.View pointerEvents="box-none" style={[styles.words, m ? { opacity: m.leave, transform: [{ translateY: m.lift }] } : null]}>
        <View pointerEvents="none">
          <Animated.View style={m?.words ? { opacity: m.words } : null}>
            <View style={styles.rule} />
            <Text style={styles.over}>{panel.over}</Text>
          </Animated.View>
          <Headline text={panel.name} style={styles.name} progress={m?.words ?? null} />
          {panel.lines?.length ? (
            <Animated.View style={[styles.lines, m?.words ? { opacity: m.words } : null]}>
              {panel.lines.map((x) => (
                <View key={x} style={styles.line}>
                  <Ionicons name="checkmark-outline" size={16} color={tone.champagne} />
                  <Text style={styles.lineText}>{x}</Text>
                </View>
              ))}
            </Animated.View>
          ) : null}
        </View>
        <Animated.View style={[styles.act, m?.words ? { opacity: m.words } : null]}>
        <Press onPress={panel.onCta ?? panel.onOpen} accessibilityLabel={panel.ctaLabel ?? `${panel.cta} ${panel.name}`} style={styles.cta}>
          {/* Clear glass on the photograph: a breath of white, light along the top, a bright rim. */}
          <LinearGradient pointerEvents="none" colors={tone.deskGlass} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <LinearGradient pointerEvents="none" colors={tone.deskGlassSheen} style={styles.ctaSheen} />
          <Text style={styles.ctaText} maxFontSizeMultiplier={1.1}>
            {panel.cta}
          </Text>
          <Ionicons name="arrow-forward-outline" size={17} color={colors.white} />
        </Press>
        </Animated.View>
      </Animated.View>
      {m ? <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.dim, { opacity: m.dim }]} /> : null}
    </Animated.View>
  );
}

/**
 * Sticky curtains: each photograph holds under the title bar while the next one is drawn over it, darkening and still drifting as it
 * is covered. Use as a direct child of a HeroPage, followed by CurtainEnd, which is drawn over the last one.
 */
export const Curtain = memo(function Curtain({ panels, tall = 0.9, loose, release }: { panels: CurtainPanel[]; /** Nothing follows to cover the last panel: it scrolls on with the page. */ release?: boolean; /** Share of the screen under the bar each panel fills. */ tall?: number; /** Placed inside other content (a dropdown): finds its own place on the page, and the last panel simply scrolls on. */ loose?: boolean }) {
  const insets = useSafeAreaInsets();
  const { height: win } = useWindowDimensions();
  const scene = useScene();
  const [local, setLocal] = useState<number | null>(null);
  const [found, setFound] = useState<number | null>(null);
  const ref = useRef<ComponentRef<typeof View>>(null);
  const bar = insets.top + BAR;
  const h = Math.round((win - bar) * tall);
  const top = loose ? found : scene && local !== null ? scene.sheetTop + local : null;
  // Where it sits in the scroll: its place on screen plus how far the page has scrolled. Measured once the dropdown has settled.
  const place = () => {
    if (!loose) return;
    setTimeout(() => ref.current?.measureInWindow((_x: number, y: number) => setFound(y + (scene?.offset?.current ?? 0))), 650);
  };
  return (
    <View ref={ref} onLayout={(e) => (loose ? place() : setLocal(e.nativeEvent.layout.y))} style={[styles.stack, loose && styles.inset, { height: panels.length * h + LIP }]}>
      {panels.map((p, i) => (
        <Panel key={p.key} panel={p} index={i} h={h} win={win} last={i === panels.length - 1} loose={loose || release} pin={top === null ? null : top + i * h - bar} />
      ))}
    </View>
  );
});

/** The rest of the page, as a sheet drawn over the last curtain. */
export function CurtainEnd({ children, minHeight }: { children: ReactNode; /** For a short page: keeps the sheet tall enough to cover the last panel. */ minHeight?: number }) {
  return <SceneGroup style={[styles.end, minHeight ? { minHeight } : null]}>{children}</SceneGroup>;
}

const styles = StyleSheet.create({
  stack: { marginHorizontal: -spacing.lg, marginTop: -20 },
  inset: { marginTop: 0 },
  panel: { position: "absolute", left: 0, right: 0, overflow: "hidden", backgroundColor: tone.pineDeep },
  lip: { borderTopLeftRadius: LIP, borderTopRightRadius: LIP },
  photo: { position: "absolute", left: 0, right: 0, top: -20, bottom: -20 },
  // At the head of the panel: the first thing to come into sight, and the last to be covered.
  words: { position: "absolute", top: 48, left: 24, right: 24, gap: 22 },
  rule: { width: 30, height: 1.5, marginBottom: 12, backgroundColor: tone.champagne },
  over: { ...type.eyebrow, color: tone.champagne, marginBottom: 6 },
  name: { ...type.hero, fontSize: 50, lineHeight: 52, letterSpacing: -1, color: colors.white },
  lines: { marginTop: 12, gap: 7 },
  line: { flexDirection: "row", alignItems: "center", gap: 10 },
  lineText: { ...type.label, fontSize: 14.5, lineHeight: 20, color: colors.white, flexShrink: 1 },
  act: { alignSelf: "flex-start" },
  cta: { flexDirection: "row", alignItems: "center", gap: 10, height: 50, paddingHorizontal: 24, borderRadius: 25, overflow: "hidden", borderWidth: 1, borderColor: tone.deskGlassEdge, boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.18)" },
  ctaSheen: { position: "absolute", top: 0, left: 0, right: 0, height: "55%" },
  ctaText: { ...type.button, color: colors.white },
  dim: { backgroundColor: tone.veil },
  // Tall enough to cover the last panel as it lets go.
  end: { minHeight: 320, marginHorizontal: -spacing.lg, marginTop: -(GAP + LIP), paddingHorizontal: spacing.lg, paddingTop: 34, gap: GAP, borderTopLeftRadius: LIP, borderTopRightRadius: LIP, backgroundColor: tone.page },
});
