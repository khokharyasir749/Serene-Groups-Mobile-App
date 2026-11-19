import { create } from "zustand";

export type ShowcaseTab = "nathia-gali" | "lahore" | "more";

/** Which tab the property showcase is on, so other sections ("Upcoming projects →") can switch it. */
export const useShowcaseStore = create<{ tab: ShowcaseTab; setTab: (t: ShowcaseTab) => void }>((set) => ({
  tab: "nathia-gali",
  setTab: (tab) => set({ tab }),
}));
