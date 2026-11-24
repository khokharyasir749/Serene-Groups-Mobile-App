import { create } from "zustand";
import { SAMPLE_ROOM } from "@/features/services/data/catalog";
import { slotLabel, todayISO } from "@/features/services/lib/schedule";

export type RequestKind = "extra" | "care" | "message";

export type GuestRequest = {
  reference: string;
  kind: RequestKind;
  /** null for a message to the desk. */
  slug: string | null;
  name: string;
  /** Serene Management code, when there is one. */
  code: string | null;
  choices: string[];
  date: string;
  /** null = as soon as possible. */
  slot: string | null;
  room: string;
  note: string;
  status: "sent" | "cancelled";
  createdAt: string;
};

type State = {
  room: string;
  setRoom: (room: string) => void;
  requests: GuestRequest[];
  /** Records a request for the current room and returns it. */
  add: (r: Pick<GuestRequest, "kind" | "slug" | "name" | "code" | "choices" | "date" | "slot" | "note">) => GuestRequest;
  cancel: (reference: string) => void;
};

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newReference = () => `SV-${Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")}`;

/**
 * Guest requests, kept on this phone for this session. Nothing is sent to Serene Management yet: `add` is the one place to post
 * each record to the desk once its API is available.
 */
export const useServicesStore = create<State>((set, get) => ({
  room: SAMPLE_ROOM,
  setRoom: (room) => set({ room }),
  requests: [],
  add: (r) => {
    const made: GuestRequest = { ...r, note: r.note.trim(), room: get().room.trim(), reference: newReference(), status: "sent", createdAt: new Date().toISOString() };
    set((s) => ({ requests: [made, ...s.requests] }));
    return made;
  },
  cancel: (reference) => set((s) => ({ requests: s.requests.map((r) => (r.reference === reference ? { ...r, status: "cancelled" } : r)) })),
}));

export const isActive = (r: GuestRequest) => r.status === "sent" && r.date >= todayISO();

/** One-line summary, for WhatsApp. */
export const describe = (r: GuestRequest) =>
  [r.kind === "message" ? null : r.name, r.choices.join(", "), r.slot ? `${r.date} ${slotLabel(r.slot)}` : null, r.note, `Ref ${r.reference}`].filter(Boolean).join(" · ");
