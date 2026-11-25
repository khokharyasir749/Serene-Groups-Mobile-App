import { useCallback, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Animated, RefreshControl, StyleSheet, View, useWindowDimensions, type ScrollViewInstance } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, explore, groups, spacing } from "@/core/constants/theme";
import { SCROLL_TOP_THRESHOLD, useScrollTopStore } from "@/core/lib/scrollTop";
import { useReduceMotion } from "../hooks/useReduceMotion";
import { ExploreHeader, HEADER_HEIGHT } from "./ExploreHeader";
import { HeroStage } from "./HeroStage";
import { PageScroll } from "./pageScroll";
import { ScrollTargets } from "./scrollTarget";

/** The dock, its offset and a little air. */
const DOCK = 96;
const PEEK = 16;

type Props = {
  scrollRef: RefObject<ScrollViewInstance | null>;
  /** Pull to refresh, when there is something to refresh. */
  onRefresh?: () => void;
  refreshing?: boolean;
  /** A tab page's own opening; Explore's stay search without one. */
  hero?: (height: number) => ReactNode;
  /** Height of that opening, as a share of the screen. */
  share?: number;
  children: ReactNode;
};

/** The shell of every Groups tab: an edge-to-edge hero that runs under the status bar, with the header pinned over it. */
export function ExploreScreen({ scrollRef, refreshing = false, onRefresh, hero: ownHero, share = 0.7, children }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const still = useReduceMotion();
  // The whole first view, with a sliver of the page below it to say there is more.
  const hero = ownHero ? Math.round(Math.max(380, height * share)) : Math.round(Math.max(560, height - PEEK));
  const top = insets.top + HEADER_HEIGHT;
  const solidAt = hero - top;
  const y = useRef(new Animated.Value(0)).current;
  const last = useRef(0);
  const [solid, setSolid] = useState(false);
  const page = useMemo(() => ({ y, view: height, top, still }), [y, height, top, still]);

  // While this page is focused, the dock's up-arrow scrolls it back to the top and shows once it is scrolled down.
  useFocusEffect(
    useCallback(() => {
      const store = useScrollTopStore.getState();
      store.register(() => scrollRef.current?.scrollTo({ y: 0, animated: true }));
      store.setVisible(last.current > SCROLL_TOP_THRESHOLD);
      return () => {
        const s = useScrollTopStore.getState();
        s.register(null);
        s.setVisible(false);
      };
    }, [scrollRef]),
  );

  return (
    <ScrollTargets scrollRef={scrollRef} offset={top + spacing.md}>
      <PageScroll value={page}>
        <View style={styles.root}>
          <Animated.ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
              useNativeDriver: true,
              listener: (e: { nativeEvent: { contentOffset: { y: number } } }) => {
                last.current = e.nativeEvent.contentOffset.y;
                useScrollTopStore.getState().setVisible(last.current > SCROLL_TOP_THRESHOLD);
                setSolid(last.current > solidAt - spacing.xxl);
              },
            })}
            refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={top} tintColor={colors.white} colors={[groups.pine]} /> : undefined}
          >
            {ownHero ? ownHero(hero) : <HeroStage height={hero} dock={insets.bottom + DOCK - PEEK} passed={solid} />}
            {children}
          </Animated.ScrollView>
          <ExploreHeader y={y} solidAt={solidAt} solid={solid} />
        </View>
      </PageScroll>
    </ScrollTargets>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: explore.canvas },
  content: { paddingHorizontal: spacing.lg, gap: spacing.hero + spacing.sm },
});
