import { create } from "zustand";

export type MiniApp = "Serene Bookings" | "Serene Services" | "Serene Groups";

type State = { id: number; target: MiniApp | null; go: (() => void) | null };

export const useSwitchStore = create<State>(() => ({ id: 0, target: null, go: null }));

/** Covers the screen with "Switching to …", runs `go` underneath, then reveals the destination. Ignored while a switch is already running. */
export function switchTo(target: MiniApp, go: () => void) {
  const s = useSwitchStore.getState();
  if (s.target) return;
  useSwitchStore.setState({ id: s.id + 1, target, go });
}

export const endSwitch = () => useSwitchStore.setState({ target: null, go: null });
