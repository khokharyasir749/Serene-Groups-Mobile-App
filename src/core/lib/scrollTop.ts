import { create } from "zustand";

/** Past this many pixels of scroll the dock shows its up-arrow. */
export const SCROLL_TOP_THRESHOLD = 140;

type State = { fn: (() => void) | null; visible: boolean; register: (fn: (() => void) | null) => void; setVisible: (v: boolean) => void };

/** The focused scrolling screen registers how to scroll itself to the top and whether it is scrolled down. */
export const useScrollTopStore = create<State>((set) => ({
  fn: null,
  visible: false,
  register: (fn) => set({ fn }),
  setVisible: (visible) => set((s) => (s.visible === visible ? s : { visible })),
}));

/** Called by the floating dock's up-arrow. */
export const scrollActiveToTop = () => useScrollTopStore.getState().fn?.();
