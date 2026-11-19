import { create } from "zustand";
import type { Tone } from "@/core/constants/theme";

export type Toast = { id: number; message: string; tone: Tone };

type UiState = {
  toasts: Toast[];
  offline: boolean;
  showToast: (message: string, tone?: Tone) => void;
  dismissToast: (id: number) => void;
  setOffline: (v: boolean) => void;
};

let nextId = 1;

export const useUiStore = create<UiState>((set) => ({
  toasts: [],
  offline: false,
  showToast: (message, tone = "neutral") =>
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id: nextId++, message, tone }] })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setOffline: (offline) => set({ offline }),
}));

export const toast = (message: string, tone?: Tone) => useUiStore.getState().showToast(message, tone);
