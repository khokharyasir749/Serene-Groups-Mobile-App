import type { Ionicons } from "@expo/vector-icons";
import type { ImageSource } from "expo-image";
import type { ServiceIconName } from "@/features/services/components/ServiceIcon";

export type Glyph = keyof typeof Ionicons.glyphMap;

/** Two sides of the concierge: extras go on the room bill; care is always complimentary. */
export type Kind = "extra" | "care";
export type GroupSlug = "dining" | "wellness" | "comfort" | "issue";

export type Group = { slug: GroupSlug; kind: Kind; label: string; short: string; line: string; icon: ServiceIconName };

export type Choice = { label: string; /** Overrides the service's Management code. */ code?: string };

export type Service = {
  slug: string;
  kind: Kind;
  /** null for packages, which have their own tab. */
  group: GroupSlug | null;
  /** Serene Management code (charge code, housekeeping task or maintenance category), for a later sync. */
  code?: string;
  icon: ServiceIconName;
  name: string;
  line: string;
  description: string;
  /** What the guest can pick: menu sections, treatments, or what is wrong. */
  choices: Choice[];
  choiceTitle: string;
  /** Button on extras. */
  verb?: "Order" | "Request";
  /** Bookable times. Care only has them when a time is the point (wake-up call). */
  slots?: string[];
  includes?: string[];
  /** Extras and packages only. */
  photo?: ImageSource;
};

// Existing resort photography, shared with Serene Bookings (no copies).
const PHOTO = {
  rooftop: require("../../../../assets/bookings/photos/dining/rooftop-restaurant.jpg"),
  nook: require("../../../../assets/bookings/photos/interiors/dining-nook-arch.jpg"),
  daylight: require("../../../../assets/bookings/photos/interiors/dining-daylight.jpg"),
  kitchen: require("../../../../assets/bookings/photos/interiors/kitchenette-evening.jpg"),
  tower: require("../../../../assets/bookings/photos/resort/tower-day.jpg"),
  corridor: require("../../../../assets/bookings/photos/interiors/corridor.jpg"),
  guests: require("../../../../assets/bookings/photos/interiors/guests-lounge.jpg"),
  sauna: require("../../../../assets/services/sauna.jpg"),
  road: require("../../../../assets/services/road.jpg"),
  morningBed: require("../../../../assets/services/morning-bed.jpg"),
} as const;

export const RECEPTION: ImageSource = require("../../../../assets/services/reception.jpg");
export const PROFILE_COVER: ImageSource = require("../../../../assets/bookings/photos/resort/hero-tower-mist.jpg");

export const GROUPS: Group[] = [
  { slug: "dining", kind: "extra", label: "In-Room Dining & Food", short: "Dining", line: "Served at your table or your door", icon: "dining" },
  { slug: "wellness", kind: "extra", label: "Wellness & Transfers", short: "Wellness", line: "Spa, cars and laundry", icon: "spa" },
  { slug: "comfort", kind: "care", label: "Housekeeping & Comfort", short: "Housekeeping", line: "Complimentary, any time of your stay", icon: "pillow" },
  { slug: "issue", kind: "care", label: "Report a Room Issue", short: "Room Issue", line: "No charge, our team comes to you", icon: "maintenance" },
];
export const GROUP_PHOTO: Partial<Record<GroupSlug, ImageSource>> = { dining: PHOTO.rooftop, wellness: PHOTO.sauna };

const list = (...labels: string[]): Choice[] => labels.map((label) => ({ label }));

export const SERVICES: Service[] = [
  // ── Chargeable extras: billed to the room, priced by the team (Management stores no prices for them).
  {
    slug: "room-service", kind: "extra", group: "dining", code: "2010", icon: "room-service", name: "Room Service", line: "Your order, served at your door.", verb: "Order",
    description: "Order from your room or suite. Choose what you are in the mood for, add details in the note, and the desk confirms your order and its price.",
    choiceTitle: "What would you like?", choices: list("Starters & soups", "Main course", "Desserts", "Hot drinks", "Cold drinks"),
    slots: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"], includes: ["Served in your room", "Order and price confirmed first", "Dietary needs noted"], photo: PHOTO.nook,
  },
  {
    slug: "breakfast", kind: "extra", group: "dining", code: "2030", icon: "breakfast", name: "Breakfast in Bed", line: "Start the day unhurried.", verb: "Order",
    description: "Breakfast brought to your room at the time you choose. Tell us how many guests and any dietary needs in the note.",
    choiceTitle: "Breakfast style", choices: list("Continental", "Pakistani", "Eggs to order", "Fruit & yoghurt", "Tea or coffee"),
    slots: ["07:00", "08:00", "09:00", "10:00"], includes: ["Tray service to your room", "Price confirmed first", "Dietary needs noted"], photo: PHOTO.daylight,
  },
  {
    slug: "restaurant", kind: "extra", group: "dining", code: "2000", icon: "restaurant", name: "Restaurant", line: "Request a table.", verb: "Request",
    description: "Ask for a table at the restaurant. Tell us your party size and any occasion in the note; the desk confirms availability.",
    choiceTitle: "Your table", choices: list("Two guests", "Family", "Group", "Window, if available"),
    slots: ["13:00", "14:00", "19:00", "20:00", "21:00"], includes: ["Table confirmed by the desk", "Bill charged to your room on request", "Dietary needs noted"], photo: PHOTO.rooftop,
  },
  {
    slug: "minibar", kind: "extra", group: "dining", code: "2020", icon: "minibar", name: "Minibar Refill", line: "Restocked to your taste.", verb: "Order",
    description: "Have your minibar restocked. Choose what you would like and add anything specific in the note.",
    choiceTitle: "Restock with", choices: list("Water", "Soft drinks", "Juices", "Snacks", "Chocolate"), includes: ["Restocked in your room", "Only what you use is billed"], photo: PHOTO.kitchen,
  },
  {
    slug: "spa", kind: "extra", group: "wellness", code: "3030", icon: "spa", name: "Spa & Massage", line: "Time for yourself.", verb: "Request",
    description: "Request an appointment. The desk confirms the treatment, its length and its price with you before anything is booked.",
    choiceTitle: "Treatment", choices: list("Massage", "Facial", "Sauna", "Couple appointment"),
    slots: ["11:00", "13:00", "15:00", "17:00", "19:00"], includes: ["Appointment confirmed by the desk", "Treatment and price agreed first"], photo: PHOTO.sauna,
  },
  {
    slug: "transfer", kind: "extra", group: "wellness", code: "3020", icon: "transfer", name: "Airport & Sightseeing", line: "A car when you need it.", verb: "Request",
    description: "A car to or from the airport, or for a day in the Galiyat. Add your flight number or route, and passengers, in the note.",
    choiceTitle: "Journey", choices: list("Airport pick-up", "Airport drop-off", "Sightseeing", "Local drive"),
    slots: ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"], includes: ["Time and price confirmed first", "Passengers and luggage noted"], photo: PHOTO.road,
  },
  {
    slug: "laundry", kind: "extra", group: "wellness", code: "3000", icon: "valet-laundry", name: "Valet & Laundry", line: "Collected and pressed.", verb: "Request",
    description: "We collect from your room and return your garments ready to wear. Your bill is itemised by piece.",
    choiceTitle: "Service", choices: list("Wash & press", "Press only", "Dry clean", "Shoe care"), includes: ["Collected from your room", "Itemised to your room bill"], photo: PHOTO.corridor,
  },

  // ── Complimentary: never priced, one tap to the desk.
  {
    slug: "towels", kind: "care", group: "comfort", icon: "towels", name: "Fresh Towels", line: "Brought to your room.", description: "Fresh towels and bathroom linen.",
    choiceTitle: "What do you need?", choices: list("Bath towels", "Hand towels", "Bath mat", "Robes"),
  },
  {
    slug: "room-refresh", kind: "care", group: "comfort", code: "STAY", icon: "turndown", name: "Refresh & Turndown", line: "Day tidy or evening.", description: "A daily room refresh or an evening turndown.",
    choiceTitle: "Which one?", choices: [{ label: "Room refresh", code: "STAY" }, { label: "Evening turndown", code: "TURN" }],
  },
  {
    slug: "pillows", kind: "care", group: "comfort", icon: "pillow", name: "Pillows & Bedding", line: "Sleep your way.", description: "Extra pillows, blankets or different bedding.",
    choiceTitle: "What do you need?", choices: list("Extra pillows", "Foam pillow", "Feather-free bedding", "Extra blanket"),
  },
  {
    slug: "wake-up", kind: "care", group: "comfort", icon: "wake-up", name: "Wake-up Call", line: "Up when you need to be.", description: "We call your room tomorrow at the time you choose.",
    choiceTitle: "Time, tomorrow", choices: [], slots: ["05:00", "06:00", "07:00", "08:00", "09:00"],
  },
  {
    slug: "ac-heating", kind: "care", group: "issue", code: "HVAC", icon: "ac-heating", name: "AC / Heating", line: "Too warm, too cold.", description: "Our engineer comes to your room.",
    choiceTitle: "What is wrong?", choices: list("Not cooling", "Not heating", "Noisy", "Leaking"),
  },
  {
    slug: "plumbing", kind: "care", group: "issue", code: "PLUMB", icon: "plumbing", name: "Plumbing / Water", line: "Leaks, drains, hot water.", description: "Our engineer comes to your room.",
    choiceTitle: "What is wrong?", choices: list("No hot water", "Leak", "Blocked drain", "Toilet"),
  },
  {
    slug: "electrical", kind: "care", group: "issue", code: "ELEC", icon: "electrical", name: "Electrical / Wi-Fi", line: "Lights, sockets, internet.", description: "Our engineer comes to your room.",
    choiceTitle: "What is wrong?", choices: list("Wi-Fi", "Lights", "Socket", "TV"),
  },
  {
    slug: "furniture", kind: "care", group: "issue", code: "FURN", icon: "furniture", name: "Furniture & Room", line: "Doors, safe, fittings.", description: "We check the room and put it right.",
    choiceTitle: "What is wrong?", choices: [{ label: "Door or lock" }, { label: "Furniture" }, { label: "Safe" }, { label: "Full room check", code: "GEN" }],
  },

  // ── Packages: combinations of the extras above, priced on request.
  {
    slug: "slow-morning", kind: "extra", group: null, icon: "breakfast", name: "The Slow Morning", line: "Breakfast in bed, then the spa.", verb: "Request",
    description: "Breakfast in bed followed by a spa appointment, arranged together with a turndown the evening before.",
    choiceTitle: "For", choices: list("One guest", "Two guests"), slots: ["08:00", "09:00", "10:00"], includes: ["Breakfast in Bed", "Spa & Massage appointment", "Complimentary turndown"], photo: PHOTO.morningBed,
  },
  {
    slug: "arrival", kind: "extra", group: null, icon: "transfer", name: "The Arrival", line: "Met, driven, and dinner waiting.", verb: "Request",
    description: "An airport pick-up with dinner in your room when you arrive. Add your flight number in the note.",
    choiceTitle: "For", choices: list("One guest", "Two guests", "Family"), slots: ["12:00", "15:00", "18:00", "21:00"], includes: ["Airport pick-up", "In-room dinner", "Minibar stocked to your taste"], photo: PHOTO.tower,
  },
  {
    slug: "evening-in", kind: "extra", group: null, icon: "room-service", name: "The Evening In", line: "Dinner in your suite.", verb: "Request",
    description: "A private dinner served in your suite, followed by turndown.",
    choiceTitle: "For", choices: list("Two guests", "Family", "Celebration"), slots: ["19:00", "20:00", "21:00"], includes: ["In-room dinner", "Table set in your suite", "Complimentary turndown"], photo: PHOTO.guests,
  },
];

/** Sample room until the guest's stay is connected. */
export const SAMPLE_ROOM = "Suite 4B";

export const PACKAGES = SERVICES.filter((s) => s.group === null);
export const serviceBySlug = (slug?: string | null) => SERVICES.find((s) => s.slug === slug);
export const groupBySlug = (slug?: string) => GROUPS.find((g) => g.slug === slug);
export const inGroup = (slug: GroupSlug) => SERVICES.filter((s) => s.group === slug);

export const BILLED = "Billed to room · On request";
export const FREE_SENT = "Complimentary · Desk Notified";

export function searchServices(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SERVICES.filter((s) => [s.name, s.line, groupBySlug(s.group ?? "")?.label ?? "package", ...s.choices.map((c) => c.label)].join(" ").toLowerCase().includes(q));
}
