import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { View, type ScrollViewInstance } from "react-native";

type Api = { register: (id: string, y: number) => void; scrollTo: (id: string) => void };
const Ctx = createContext<Api>({ register: () => {}, scrollTo: () => {} });

/** Lets sections on the Explore page jump to each other ("Upcoming projects →", "Back to top ↑"). */
export function ScrollTargets({ scrollRef, offset = 12, children }: { scrollRef: RefObject<ScrollViewInstance | null>; /** Keeps a section clear of whatever sits over the top of the page. */ offset?: number; children: ReactNode }) {
  const ys = useRef(new Map<string, number>());
  const register = useCallback((id: string, y: number) => void ys.current.set(id, y), []);
  const scrollTo = useCallback(
    (id: string) => {
      const y = id === "top" ? 0 : ys.current.get(id);
      if (y !== undefined) scrollRef.current?.scrollTo({ y: Math.max(0, y - offset), animated: true });
    },
    [scrollRef, offset],
  );
  const api = useMemo(() => ({ register, scrollTo }), [register, scrollTo]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useScrollTo = (id: string) => {
  const { scrollTo } = useContext(Ctx);
  return useCallback(() => scrollTo(id), [scrollTo, id]);
};

/** For a section that measures itself. */
export const useRegisterTarget = () => useContext(Ctx).register;

/** Marks a section so it can be scrolled to. Direct child of the page ScrollView content. */
export function Anchor({ id, children }: { id: string; children: ReactNode }) {
  const { register } = useContext(Ctx);
  return <View onLayout={(e) => register(id, e.nativeEvent.layout.y)}>{children}</View>;
}
