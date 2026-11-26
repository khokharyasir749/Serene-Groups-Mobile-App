import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, type StyleProp, type ViewStyle } from "react-native";

type Page = {
  /** Live scroll position (native-driven). */
  y: Animated.Value;
  /** Height of the screen. */
  view: number;
  /** Height covered by the pinned header, status bar included. */
  top: number;
  /** Less motion was asked for. */
  still: boolean;
};

const Ctx = createContext<Page | null>(null);
export const PageScroll = Ctx.Provider;

export function usePage(): Page {
  const page = useContext(Ctx);
  if (!page) throw new Error("usePage must be used inside ExploreScreen");
  return page;
}

/** Rises into place as it enters the view. Direct child of the page content. */
export function Reveal({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { y, view, still } = usePage();
  const [at, setAt] = useState<number | null>(null);
  const range = at === null ? null : [at - view * 0.96, at - view * 0.7];
  const motion =
    range && !still
      ? {
          opacity: y.interpolate({ inputRange: range, outputRange: [0, 1], extrapolate: "clamp" }),
          transform: [{ translateY: y.interpolate({ inputRange: range, outputRange: [46, 0], extrapolate: "clamp" }) }],
        }
      : null;
  return (
    <Animated.View onLayout={(e) => setAt(Math.round(e.nativeEvent.layout.y))} style={[style, motion]}>
      {children}
    </Animated.View>
  );
}

/** True from the first time the page is scrolled to `at` (less `lead` of the screen). */
export function useReached(at: number | null, lead = 0.6) {
  const { y, view } = usePage();
  const [reached, setReached] = useState(false);
  const done = useRef(false);
  useEffect(() => {
    if (at === null || done.current) return undefined;
    const id = y.addListener(({ value }) => {
      if (done.current || value < at - view * lead) return;
      done.current = true;
      setReached(true);
    });
    return () => y.removeListener(id);
  }, [at, lead, view, y]);
  return reached;
}
