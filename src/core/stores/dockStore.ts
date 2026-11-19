import { create } from "zustand";
import type { DockProps } from "@/core/components/FloatingDock";

type State = { props: DockProps | null; signature: string };

/** Latest tab-bar props from the navigator, so the dock can render outside the blurred area. */
export const useDockStore = create<State>(() => ({ props: null, signature: "" }));

// The navigator hands over a fresh props object on every render, so keep the newest one outside React state
// and let the stable wrappers below always call through to it.
let latest: DockProps | null = null;

const signatureOf = (p: DockProps) =>
  `${p.state.index}|${p.state.routes.map((r) => r.key).join(",")}|${p.state.routes.map((r) => p.descriptors[r.key]?.options.title ?? "").join(",")}`;

/** Updates the dock only when the active tab, the route keys or the titles actually change; otherwise a complete no-op. */
export function setDockProps(next: DockProps) {
  latest = next;
  const signature = signatureOf(next);
  if (signature === useDockStore.getState().signature) return;
  useDockStore.setState({
    signature,
    props: {
      state: next.state,
      descriptors: next.descriptors,
      emitter: { emit: (e) => (latest ?? next).emitter.emit(e) },
      navigateToTab: (key) => (latest ?? next).navigateToTab(key),
    },
  });
}
