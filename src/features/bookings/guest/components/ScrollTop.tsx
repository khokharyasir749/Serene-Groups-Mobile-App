import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useSyncExternalStore } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

/** Past this many pixels of scroll the dock shows its up-arrow (as in the Serene Groups app). */
export const SCROLL_TOP_THRESHOLD = 140;

// Tiny store: the focused tab screen registers how to scroll itself to the top and whether it is scrolled down.
let state = { visible: false, fn: null as null | (() => void) };
const listeners = new Set<() => void>();
const set = (next: Partial<typeof state>) => {
  const merged = { ...state, ...next };
  if (merged.visible === state.visible && merged.fn === state.fn) return;
  state = merged;
  listeners.forEach((l) => l());
};

export const useScrollTopVisible = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    () => state.visible,
  );

export const scrollActiveToTop = () => state.fn?.();

type Scrollable = { scrollTo?: (o: { y: number; animated: boolean }) => void; scrollToOffset?: (o: { offset: number; animated: boolean }) => void };

/** ScrollView / FlatList wiring for tab screens: a ref and a light onScroll that only flips state at the threshold. */
export function useScrollTop() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const y = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const fn = () => {
        const r = ref.current as Scrollable | null;
        if (r?.scrollToOffset) r.scrollToOffset({ offset: 0, animated: true });
        else r?.scrollTo?.({ y: 0, animated: true });
      };
      set({ fn, visible: y.current > SCROLL_TOP_THRESHOLD });
      // The next tab may already have registered itself; only clear what is ours.
      return () => {
        if (state.fn === fn) set({ fn: null, visible: false });
      };
    }, []),
  );

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    y.current = e.nativeEvent.contentOffset.y;
    const visible = y.current > SCROLL_TOP_THRESHOLD;
    if (visible !== state.visible) set({ visible });
  }, []);

  return { ref, onScroll };
}
