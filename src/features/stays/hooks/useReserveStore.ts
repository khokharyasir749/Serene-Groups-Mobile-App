import { create } from "zustand";
import { toISO } from "@/core/lib/plan";

export type ReserveDraft = { roomSlug: string | null; checkIn: string; checkOut: string; adults: number };

const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
};

const ARRIVAL_IN_DAYS = 14;
const NIGHTS = 2;

export const freshDraft = (): ReserveDraft => ({ roomSlug: null, checkIn: plusDays(ARRIVAL_IN_DAYS), checkOut: plusDays(ARRIVAL_IN_DAYS + NIGHTS), adults: 2 });

type State = {
  open: boolean;
  draft: ReserveDraft;
  openReserve: (patch?: Partial<ReserveDraft>) => void;
  close: () => void;
};

/** Global "reserve a stay" sheet: any screen can open it, optionally pre-filled with a room or dates. */
export const useReserveStore = create<State>((set) => ({
  open: false,
  draft: freshDraft(),
  openReserve: (patch) => set({ open: true, draft: { ...freshDraft(), ...patch } }),
  close: () => set({ open: false }),
}));
