import { create } from "zustand";

export type DeskSheetState = { type: "message" } | { type: "care"; slug: string };

/** `id` changes on every open, so each sheet starts fresh. */
export const useDeskSheet = create<{ sheet: DeskSheetState | null; id: number }>(() => ({ sheet: null, id: 0 }));

const open = (sheet: DeskSheetState) => useDeskSheet.setState((s) => ({ sheet, id: s.id + 1 }));
export const openCare = (slug: string) => open({ type: "care", slug });
export const openMessage = () => open({ type: "message" });
export const closeDesk = () => useDeskSheet.setState({ sheet: null });
