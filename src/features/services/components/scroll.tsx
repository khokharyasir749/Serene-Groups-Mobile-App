import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, StyleSheet, View, useWindowDimensions, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { Enter, isReduced } from "@/features/services/components/motion";
import { sf } from "@/features/services/components/fonts";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";

/**
 * Scroll choreography. One native-driven value (`y`) moves everything on a page, so nothing here runs on the JS thread while
 * scrolling. A page provides ScrollScene; Reveal measures a block; Parallax inside it follows the block's place on screen.
 */
type SceneValue = { y: Animated.Value; sheetTop: number; /** The scroll position, kept in step on the JS side. */ offset?: { current: number } };
const Scene = createContext<SceneValue | null>(null);
const Block = createContext<number | null>(null);

export function ScrollScene({ y, sheetTop, offset, children }: { y: Animated.Value; sheetTop: number; offset?: { current: number }; children: ReactNode }) {
  const value = useMemo(() => ({ y, sheetTop, offset }), [y, sheetTop, offset]);
  return <Scene.Provider value={value}>{children}</Scene.Provider>;
}

/** Follows this block from entering at the foot of the screen (0) to leaving at the top (1). Null until measured, or with Reduce Motion. */
function useTravel(at: number, height: number, outputRange: [number, number]) {
  const scene = useContext(Scene);
  const top = useContext(Block);
  const win = useWindowDimensions();
  return useMemo(() => {
    if (!scene || top === null || isReduced()) return null;
    const start = top + at - win.height;
    return scene.y.interpolate({ inputRange: [start, top + at + height], outputRange, extrapolate: "clamp" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, top, at, height, win.height, outputRange[0], outputRange[1]]);
}

type RevealProps = { children: ReactNode; style?: StyleProp<ViewStyle>; /** Only measures: its items rise one by one (see Rise). */ plain?: boolean };

/** A block of the page that comes into place as it scrolls into view. Use as a direct child of the page's content. */
export function Reveal({ children, style, plain }: RevealProps) {
  const scene = useContext(Scene);
  const { height } = useWindowDimensions();
  const [local, setLocal] = useState<number | null>(null);
  const top = scene && local !== null ? scene.sheetTop + local : null;
  const start = top !== null ? top - height : 0;
  // Already on screen at rest, or Reduce Motion: shown as is.
  const moving = !plain && scene && top !== null && start > -60 && !isReduced();
  const p = useMemo(() => (moving ? scene.y.interpolate({ inputRange: [start + 20, start + 180], outputRange: [0, 1], extrapolate: "clamp" }) : null), [moving, scene, start]);
  const motion = p ? { opacity: p, transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] } : null;
  return (
    <Animated.View onLayout={(e) => setLocal(e.nativeEvent.layout.y)} style={[style, motion]}>
      <Block.Provider value={top}>{children}</Block.Provider>
    </Animated.View>
  );
}

/** One item of a plain Reveal: fades up as it enters the screen, a little after the one before it. */
/** Content whose place on the page moves (a fold that opens): its pictures and items hold still. */
export function Still({ children }: { children: ReactNode }) {
  return <Block.Provider value={null}>{children}</Block.Provider>;
}

/** Inside an opening dropdown: items play in one after another as it opens, rather than following the scroll. */
export const Unfolding = createContext(false);

export function Rise({ children, at = 0, order = 0, seq, style }: { children: ReactNode; /** Distance below the top of the block. */ at?: number; order?: number; /** Place in the stagger when a dropdown opens. */ seq?: number; style?: StyleProp<ViewStyle> }) {
  const scene = useContext(Scene);
  const top = useContext(Block);
  const unfolding = useContext(Unfolding);
  const { height } = useWindowDimensions();
  const motion = useMemo(() => {
    if (!scene || top === null || isReduced()) return null;
    const start = top + at - height + order * 44;
    // Already on screen when the page opens: shown as is.
    if (start < -60) return null;
    const p = scene.y.interpolate({ inputRange: [start + 16, start + 170], outputRange: [0, 1], extrapolate: "clamp" });
    return { opacity: p, transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [34, 0] }) }, { scale: p.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }] };
  }, [scene, top, at, height, order]);
  if (unfolding)
    return (
      <Enter order={(seq ?? order) + 1} dy={16} style={style}>
        {children}
      </Enter>
    );
  return <Animated.View style={[style, motion]}>{children}</Animated.View>;
}

/** The page's scroll value and where its content starts, for choreography that measures itself. */
export const useScene = () => useContext(Scene);

/** Part of the page that measures itself, so Reveals can sit inside it. */
export function SceneGroup({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const scene = useContext(Scene);
  const [local, setLocal] = useState<number | null>(null);
  const value = useMemo(() => (scene && local !== null ? { y: scene.y, sheetTop: scene.sheetTop + local, offset: scene.offset } : null), [scene, local]);
  return (
    <View onLayout={(e) => setLocal(e.nativeEvent.layout.y)} style={style}>
      <Scene.Provider value={value}>{children}</Scene.Provider>
    </View>
  );
}

type HeadlineProps = { text: string; style: StyleProp<TextStyle>; /** The last words set apart in italic gold, as Serene Groups does. */ soft?: number; softStyle?: StyleProp<TextStyle>; /** Plays by itself when the page opens. */ mount?: boolean; /** Driven from outside, 0 to 1. */ progress?: Animated.AnimatedInterpolation<number> | null };

/** A heading whose words rise one after another from behind their own baseline: with the scroll, or once on opening. */
export function Headline({ text, style, mount, progress, soft = 0, softStyle }: HeadlineProps) {
  const scene = useContext(Scene);
  const top = useContext(Block);
  const { height } = useWindowDimensions();
  const auto = useRef(new Animated.Value(0)).current;
  const words = text.split(" ");
  const line = StyleSheet.flatten(style)?.lineHeight ?? 40;
  useEffect(() => {
    if (!mount) return;
    const a = Animated.timing(auto, { toValue: 1, delay: 180, duration: 1150, easing: Easing.bezier(0.2, 0.8, 0.2, 1), useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [auto, mount]);
  const p = useMemo(() => {
    if (isReduced()) return null;
    if (progress !== undefined) return progress;
    if (mount) return auto.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    if (!scene || top === null) return null;
    const start = top - height;
    return start > -60 ? scene.y.interpolate({ inputRange: [start + 24, start + 250], outputRange: [0, 1], extrapolate: "clamp" }) : null;
  }, [auto, height, mount, progress, scene, top]);
  const share = 0.5 / Math.max(1, words.length - 1);
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={text} style={styles.words}>
      {words.map((w, i) => {
        const from = words.length > 1 ? i * share : 0;
        return (
          <View key={i} style={styles.mask}>
            <Animated.View style={p ? { opacity: p.interpolate({ inputRange: [from, from + 0.25], outputRange: [0, 1], extrapolate: "clamp" }), transform: [{ translateY: p.interpolate({ inputRange: [from, from + 0.5], outputRange: [line, 0], extrapolate: "clamp" }) }] } : null}>
              <Text style={[style, i >= words.length - soft && [styles.soft, softStyle]]} maxFontSizeMultiplier={1.15}>
                {i < words.length - 1 ? `${w} ` : w}
              </Text>
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
}

type ParallaxProps = { source?: ImageSource; height: number; /** Distance below the top of the block. */ at?: number; depth?: number; zoom?: boolean; style?: StyleProp<ViewStyle>; children?: ReactNode; position?: "center" | "top" | "bottom" };

/** A photograph behind a window: it slides slower than the page, and can ease back as it rises. */
export function Parallax({ source, height, at = 0, depth = 34, zoom, style, children, position = "center" }: ParallaxProps) {
  const shift = useTravel(at, height, [-depth, depth]);
  const scale = useTravel(at, height, [1.16, 1]);
  return (
    <View style={[styles.window, { height }, style]}>
      <Animated.View style={[styles.photo, { top: -depth, bottom: -depth }, shift ? { transform: zoom && scale ? [{ translateY: shift }, { scale }] : [{ translateY: shift }] } : null]}>
        <Image cachePolicy="memory-disk" source={source} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={position} transition={120} />
      </Animated.View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  words: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline" },
  soft: { fontFamily: sf.displayItalic },
  mask: { overflow: "hidden" },
  window: { overflow: "hidden", backgroundColor: tone.pine },
  photo: { position: "absolute", left: 0, right: 0 },
});
