import { useRef, useState, type ReactElement } from "react";
import { Animated, StyleSheet, View, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from "react-native";
import { colors, radius, spacing } from "@/core/constants/theme";

type Ctx = { active: boolean; focus: () => void };

type Props<T> = {
  data: readonly T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number, ctx: Ctx) => ReactElement;
  /** Card width as a fraction of the screen (default 0.66). */
  widthRatio?: number;
  /** Maximum tilt of the side cards in degrees (default 48). */
  tilt?: number;
  onIndexChange?: (index: number) => void;
  /** Show the gold pagination pill (default true). */
  dots?: boolean;
};

/**
 * Drag-around 3D carousel built on the stock Animated + ScrollView (no extra native modules). Every card is driven by its
 * distance from the centre: real perspective, rotateY tilt toward the middle, depth scale and a soft fade on the sides.
 * Touch-and-drag follows the finger and snaps to the nearest card.
 */
export function PerspectiveCarousel3D<T>({ data, keyExtractor, renderItem, widthRatio = 0.66, tilt = 48, onIndexChange, dots = true }: Props<T>) {
  const { width } = useWindowDimensions();
  const itemW = Math.round(width * widthRatio);
  const step = itemW;
  const x = useRef(new Animated.Value(0)).current;
  const scroller = useRef<ScrollViewInstance>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { x } } }], {
    useNativeDriver: true,
    listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const i = Math.max(0, Math.min(data.length - 1, Math.round(e.nativeEvent.contentOffset.x / step)));
      if (i !== indexRef.current) {
        indexRef.current = i;
        setIndex(i);
        onIndexChange?.(i);
      }
    },
  });

  return (
    <View style={styles.wrap}>
      <Animated.ScrollView
        ref={scroller as never}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        style={styles.list}
        contentContainerStyle={{ paddingHorizontal: (width - itemW) / 2, paddingVertical: spacing.md }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {data.map((item, i) => {
          const range = [(i - 1) * step, i * step, (i + 1) * step];
          const rotateY = x.interpolate({ inputRange: range, outputRange: [`${tilt}deg`, "0deg", `-${tilt}deg`], extrapolate: "clamp" });
          const scale = x.interpolate({ inputRange: range, outputRange: [0.82, 1, 0.82], extrapolate: "clamp" });
          const opacity = x.interpolate({ inputRange: range, outputRange: [0.55, 1, 0.55], extrapolate: "clamp" });
          const shift = x.interpolate({ inputRange: range, outputRange: [itemW * 0.1, 0, -itemW * 0.1], extrapolate: "clamp" });
          return (
            <Animated.View key={keyExtractor(item)} style={{ width: itemW, paddingHorizontal: spacing.xs, opacity, transform: [{ perspective: 1000 }, { translateX: shift }, { rotateY }, { scale }] }}>
              {renderItem(item, i, { active: i === index, focus: () => scroller.current?.scrollTo({ x: i * step, animated: true }) })}
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
      {dots ? (
        <View style={styles.dots}>
          {data.map((d, i) => (
            <View key={keyExtractor(d)} style={[styles.dot, i === index && styles.dotOn]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  list: { marginHorizontal: -spacing.lg, flexGrow: 0 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: radius.pill, backgroundColor: colors.lineStrong },
  dotOn: { width: 24, backgroundColor: colors.goldAccent },
});
