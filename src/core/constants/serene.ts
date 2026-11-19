// Single source of truth for Serene Heights Group facts.
// Mirrors serene-group-web/client/global/constants/site.ts — keep the two in sync.
// All plan / unit magic numbers live here and nowhere else (enforced by scripts/check.mjs).

export const GROUP = {
  name: "Serene Heights Group",
  short: "Serene Heights",
  developer: "DM Consortium",
  founded: 2017,
  ceo: "Fahad Masud Lone",
  uan: "042-111-111-744",
  whatsapp: "+92 300 8497999",
  whatsappDigits: "923008497999",
  office: "H. No. 71 C3, Gulberg III, Park View Lane, Lahore",
} as const;

export const PROJECT_SLUGS = ["nathia-gali", "lahore"] as const;
export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export type ProjectInfo = {
  slug: ProjectSlug;
  name: string;
  place: string;
  status: string;
  since: string;
  kind: string;
  email: string;
  phone: string;
  summary: string;
  facts: readonly string[];
};

export const PROJECTS: readonly ProjectInfo[] = [
  {
    slug: "nathia-gali",
    name: "Nathia Gali",
    place: "Kala Bagh Air Base Road, Nathia Gali, KPK",
    status: "Under construction",
    since: "Since 2021",
    kind: "Hotel & Resort",
    email: "info@sereneheightsnathiagali.com",
    phone: "042-111-111-744",
    summary:
      "Pakistan's first and largest winter resort — fully furnished hotel apartments in the pines at 7,906 ft, two hours from Islamabad.",
    facts: ["7,906 ft", "30+ kanals", "3 towers", "150+ apartments", "50+ amenities"],
  },
  {
    slug: "lahore",
    name: "Lahore",
    place: "Gulberg Main Boulevard, Lahore",
    status: "Now selling · 2-year delivery",
    since: "LDA approved",
    kind: "Mixed-use tower",
    email: "info@sereneheightslahore.com",
    phone: "0304-1111106",
    summary:
      "A 21-storey address beside the CBD — retail, offices, co-working, parking and serviced hotel apartments under one in-house management.",
    facts: ["21 storeys", "7 office floors", "2 co-working floors", "Hotel apartments", "Helipad"],
  },
] as const;

export const COMPLETED_PROJECTS = [
  { name: "Serene Farms", place: "Barki Road, Lahore", note: "Completed horizontal development" },
] as const;

export const projectName = (slug: ProjectSlug) => PROJECTS.find((p) => p.slug === slug)?.name ?? slug;

// ── Nathia Gali inventory (official floor-plan counts) ──────────────────────────────────────────
export const ROOMS = [
  { slug: "classic-one-bedroom", tagline: "A cosy mountain base with its own balcony",name: "Classic One-Bedroom", size: "Under 600 sq ft", guests: "Up to 3 guests", units: 37 },
  { slug: "premier-one-bedroom", tagline: "More room, with a sofa bed for the family",name: "Premier One-Bedroom", size: "600–699 sq ft", guests: "Up to 4 guests", units: 44 },
  { slug: "grand-one-bedroom", tagline: "A wide balcony facing the Galiyat",name: "Grand One-Bedroom", size: "700–799 sq ft", guests: "Up to 4 guests", units: 25 },
  { slug: "signature-corner-suite", tagline: "Corner living with views on two sides",name: "Signature Corner Suite", size: "800+ sq ft", guests: "Up to 4 guests", units: 4 },
  { slug: "terrace-apartment", tagline: "Eighth floor, with a private terrace",name: "Terrace Apartment", size: "500–980 sq ft", guests: "Up to 4 guests", units: 20 },
] as const;

export const NATHIA_GALI_TOTAL_UNITS = 130;
/** Marketing figure on the web site ("150+ apartments"); distinct from the 130 bookable room units. */
export const NATHIA_GALI_MARKETING_APARTMENTS = "150+";

// ── Copy from the web site (Intro / Investors / site.ts) ────────────────────────────────────────
export const COPY = {
  headline: "Built for the heights ahead",
  tagline: "Pakistan's first winter resort",
  investorsEyebrow: "Serene Investors",
  investorsHeadline: "Own a share of the heights.",
  investorsLede:
    "Smart Property Units let you own part of a working hotel — fully managed, with profit shared every quarter. Or own a whole apartment, with nights reserved for you each year.",
  investorReasons: [
    { t: "Managed as one hotel", d: "DM Consortium runs rentals, upkeep and returns in-house — no unions, no third-party operators." },
    { t: "Quarterly profit share", d: "Smart Property owners in Nathia Gali share in hotel revenue every quarter." },
    { t: "Low entry", d: "Own a share of a hotel from PKR 2 million, with 30% down and 36 monthly instalments." },
    { t: "Owner stays", d: "Nathia Gali owners get 28 free nights a year and zero maintenance fees." },
  ],
} as const;

// ── Home-page copy, word for word from serene-group-web (_components/*, site.ts) ─────────────────
export const NATHIA_GALI_URL = "https://serene-nathiagali.vercel.app/";
export const LAHORE_URL = "https://serene-heights-lahore-five.vercel.app/";
export const PROJECT_URL: Record<ProjectSlug, string> = { "nathia-gali": NATHIA_GALI_URL, lahore: LAHORE_URL };

export const CONTACT = {
  uan: "042-111-111-744",
  uanHref: "tel:+9242111111744",
  whatsapp: "+92 300 8497999",
  whatsappHref: "https://wa.me/923008497999",
  office: "H. No. 71 C3, Gulberg III, Park View Lane, Lahore",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/sereneheightshotelsandresorts" },
    { label: "Facebook", href: "https://www.facebook.com/sereneheightshotelsandresorts" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/serene-heights-hotel-resort" },
    { label: "YouTube", href: "https://www.youtube.com/@sereneheightsnathiagali5573" },
  ],
} as const;

export const WEB = {
  hero: {
    title: ["Built for the", "heights ahead"],
    caption: ["Nathia Gali", "7,906 ft"],
    lede: "One group, from the pines of the Galiyat to Gulberg Main Boulevard. Explore our projects, book a stay, or own a share of what we build.",
    trust: "Developed by DM Consortium · since 2017",
    note: "Serene Heights is the umbrella for our hotel, resort and city developments — each one built, sold and managed in-house.",
  },
  marquee: ["Pakistan's first winter resort", "21 storeys on Gulberg Boulevard", "Places that hold their value"],
  about: {
    label: "About the group",
    caption: "Real elevation of the Galiyat · 18 km across · contours every 100 m",
    p1: "Serene Heights Group is home to the developments of DM Consortium — hotels, resorts and city addresses that are planned, built, sold and then managed by the same team.",
    p2: "Led by Chief Executive Fahad Masud Lone, the group started in the Galiyat with Pakistan's first winter resort, and now rises on Gulberg Main Boulevard. Before both came Serene Farms on Barki Road, Lahore.",
    pins: [
      { name: "Serene Heights Nathia Gali", sub: "Kala Bagh Road · 7,906 ft" },
      { name: "Serene Heights Lahore", sub: "300 km this way · Gulberg" },
    ],
    stats: [
      { n: 2017, label: "DM Consortium founded", pad: "" },
      { n: 7906, label: "ft — Nathia Gali altitude", pad: "," },
      { n: 21, label: "storeys on Gulberg Boulevard", pad: "" },
      { n: 150, label: "hotel apartments in the pines", pad: "+" },
    ],
  },
  projects: {
    eyebrow: "Ongoing projects",
    title: "Two addresses.",
    soft: "One standard.",
    p: "Every Serene Heights project is designed, delivered and run by the same in-house team — so what you see at launch is what you live with for decades.",
    visit: "Visit project site",
    completedNext: "Next on the map: see what we are preparing beyond the mountains.",
  },
  stays: {
    eyebrow: "Serene Booking",
    title: "Stay at",
    soft: "7,906 ft",
    p: "Book a fully furnished hotel apartment at Serene Heights Nathia Gali — heated glass-roof pool, rooftop dining, ski slope and trails through the pines, two hours from Islamabad.",
    roomsEyebrow: "Room types",
    roomsTitle: "Five ways",
    roomsSoft: "to stay",
    ask: "Ask about availability",
  },
  upcoming: {
    eyebrow: "Upcoming projects",
    title: "Beyond mountains",
    soft: "and borders.",
    p: "The next Serene Heights addresses are being planned now. Register your interest and hear about them before they are announced.",
    cta: { eyebrow: "Early access", title: "Be first in line.", p: "Investors and owners in existing Serene Heights projects hear about new launches first — with launch pricing.", button: "Register interest" },
    teasers: [
      { n: "03", title: "Announcing soon", note: "Our next destination is in planning." },
      { n: "04", title: "In planning", note: "Details will be shared with registered investors first." },
    ],
    interest: "Hello Serene Heights, I'd like early updates on your upcoming projects.",
  },
  investors: {
    eyebrow: "Serene Investors",
    title: "Own a share",
    soft: "of the heights.",
    p: "Smart Property Units let you own part of a working hotel — fully managed, with profit shared every quarter. Or own a whole apartment, with nights reserved for you each year.",
    planTitle: "Payment plan",
    planP: "Published plans for Serene Heights Nathia Gali — 30% down, then 36 monthly instalments.",
    spuLabel: "Smart Property Units (50 sq ft each)",
    cta: "Get this plan on WhatsApp",
    note: "Figures as published by the sales team. Smart Property returns of 13–15% a year are the developer's projection and are not guaranteed. Serene Heights Lahore smart property starts from PKR 2 million — ask for the current plan.",
    reasons: [
      { t: "Managed as one hotel", d: "DM Consortium runs rentals, upkeep and returns in-house — no unions, no third-party operators." },
      { t: "Quarterly profit share", d: "Smart Property owners in Nathia Gali share in hotel revenue every quarter." },
      { t: "Low entry", d: "Own a share of a hotel from PKR 2 million, with 30% down and 36 monthly instalments." },
      { t: "Owner stays", d: "Nathia Gali owners get 28 free nights a year and zero maintenance fees." },
      { t: "Assured delivery", d: "Serene Heights Lahore carries a 2-year delivery commitment and LDA approval." },
      { t: "Shariah-compliant", d: "Every transaction is structured to be Shariah-compliant and legally secure." },
    ],
  },
  finale: {
    title: "Rise above",
    soft: "the ordinary",
    p: "Talk to the Serene Heights team about a project, a stay or an investment. We reply on WhatsApp and by phone, seven days a week.",
    whatsapp: "Enquire on WhatsApp",
  },
  footer: {
    brand: "Serene Heights Group — hotels, resorts and city addresses developed and managed by DM Consortium, since 2017.",
  },
} as const;

/** Coordinates the web uses for its structured data (global/lib/structuredData.ts). */
export const PROJECT_GEO: Record<ProjectSlug, { lat: number; lon: number }> = {
  "nathia-gali": { lat: 34.0745, lon: 73.379 },
  lahore: { lat: 31.5154, lon: 74.3487 },
};

// ── Serene Group super app: the four pillars + destination detail (facts from site.ts / web components) ──
export const SUPER_APP = { name: "Serene Group", wordmark: "SERENE GROUP", tagline: "Hospitality, investment and landmark destinations — one ecosystem." } as const;

export type PillarId = "booking" | "investors" | "nathia-gali" | "lahore";

export const PILLARS: readonly { id: PillarId; title: string; tagline: string; route: "/bookings" | "/payments" | "/nathia-gali" | "/lahore" }[] = [
  { id: "booking", title: "Serene Booking", tagline: "Stay at 7,906 ft", route: "/bookings" },
  { id: "investors", title: "Serene Investors", tagline: "Own a share of the heights", route: "/payments" },
  { id: "nathia-gali", title: "Serene Nathia Gali", tagline: "Pakistan's first winter resort", route: "/nathia-gali" },
  { id: "lahore", title: "Serene Lahore", tagline: "Own the address", route: "/lahore" },
] as const;

export const AMENITIES: readonly string[] = [
  "Heated glass-roof pool",
  "Rooftop sky lounge",
  "Rooftop dining",
  "Ski slope beside the resort",
  "Winter trails through the pines",
  "Archery range",
  "Adventure park",
  "Mini golf course",
];

export const DESTINATIONS: Record<
  "nathia-gali" | "lahore",
  { eyebrow: string; title: string; lede: string; specs: readonly { k: string; v: string }[]; highlights: readonly string[]; ctaLabel: string; enquiry: string }
> = {
  "nathia-gali": {
    eyebrow: "Destination · Galiyat, KPK",
    title: "Serene Heights Nathia Gali",
    lede: "Pakistan's first and largest winter resort — fully furnished hotel apartments in the pines at 7,906 ft, two hours from Islamabad.",
    specs: [
      { k: "Elevation", v: "7,906 ft" },
      { k: "Land", v: "30+ kanals" },
      { k: "Towers", v: "3 towers" },
      { k: "Apartments", v: "150+" },
      { k: "Amenities", v: "50+" },
      { k: "Residences", v: "5 tiers" },
    ],
    highlights: [
      "Fully furnished hotel apartments, managed as one hotel by DM Consortium",
      "Owner stays: 28 free nights a year and zero maintenance fees",
      "Smart Property owners share in hotel revenue every quarter",
      "Kala Bagh Air Base Road, Nathia Gali — two hours from Islamabad",
    ],
    ctaLabel: "Visit Official Nathia Gali Website ↗",
    enquiry: "Hello Serene Heights, I'd like to know more about Serene Heights Nathia Gali.",
  },
  lahore: {
    eyebrow: "Destination · Gulberg, Lahore",
    title: "Serene Heights Lahore",
    lede: "A 21-storey address beside the CBD — retail, offices, co-working, parking and serviced hotel apartments under one in-house management.",
    specs: [
      { k: "Height", v: "21 storeys" },
      { k: "Offices", v: "7 floors" },
      { k: "Co-working", v: "2 floors" },
      { k: "Residences", v: "Hotel apartments" },
      { k: "Rooftop", v: "Helipad" },
      { k: "Delivery", v: "2 years" },
    ],
    highlights: [
      "LDA approved mixed-use tower on Gulberg Main Boulevard",
      "Serviced hotel apartments under one in-house management",
      "7 office floors and 2 co-working floors beside the CBD",
      "Assured delivery: a 2-year delivery commitment",
    ],
    ctaLabel: "Visit Official Lahore Website ↗",
    enquiry: "Hello Serene Heights, I'd like to know more about Serene Heights Lahore.",
  },
};

// ── Payment-plan rule: 30% down + 36 monthly instalments = 100% ─────────────────────────────────
export const PLAN_RULES = { downPercent: 30, months: 36 } as const;

export type PlanPreset = {
  id: string;
  area: number;
  kind: string;
  project: ProjectSlug;
  total: number;
  down: number;
  monthly: number;
};

/** Published plans, figures exactly as issued on the Nathia Gali site. */
export const PLANS: readonly PlanPreset[] = [
  { id: "spu", area: 50, kind: "Smart Property Unit", project: "nathia-gali", total: 2250000, down: 675000, monthly: 43750 },
  { id: "1bhk-667", area: 667, kind: "1 BHK apartment", project: "nathia-gali", total: 26680000, down: 8004000, monthly: 518778 },
  { id: "1bhk-673", area: 673, kind: "1 BHK apartment", project: "nathia-gali", total: 26920000, down: 8076000, monthly: 523444 },
  { id: "1bhk-734", area: 734, kind: "1 BHK apartment", project: "nathia-gali", total: 29360000, down: 8808000, monthly: 570889 },
];

export const CUSTOM_PLAN_ID = "custom";
export const SPU_PLAN_ID = "spu";
/** Smart Property Units are sold in 50 sq ft shares; a booking may hold several. */
export const MAX_UNITS_PER_BOOKING = 20;

export const planLabel = (p: PlanPreset) => `${p.kind} · ${p.area} sq ft`;

// ── Unit types selectable when booking ──────────────────────────────────────────────────────────
export type UnitOption = { id: string; label: string };

export const UNIT_OPTIONS: Record<ProjectSlug, readonly UnitOption[]> = {
  "nathia-gali": [
    { id: SPU_PLAN_ID, label: "Smart Property Unit" },
    ...ROOMS.map((r) => ({ id: r.slug, label: r.name })),
  ],
  lahore: [
    { id: "hotel-apartment", label: "Hotel apartment" },
    { id: "office", label: "Office" },
    { id: "co-working", label: "Co-working" },
    { id: "retail", label: "Retail" },
  ],
};

export const unitLabel = (project: ProjectSlug, unitType: string) =>
  UNIT_OPTIONS[project].find((u) => u.id === unitType)?.label ?? unitType;

// ── Load-time invariants: throw if the data ever drifts ─────────────────────────────────────────
function assertInvariants() {
  const roomTotal = ROOMS.reduce((sum, r) => sum + r.units, 0);
  if (roomTotal !== NATHIA_GALI_TOTAL_UNITS) {
    throw new Error(`serene.ts: Nathia Gali room units sum to ${roomTotal}, expected ${NATHIA_GALI_TOTAL_UNITS}`);
  }
  for (const p of PLANS) {
    const down = Math.round((p.total * PLAN_RULES.downPercent) / 100);
    const remaining = p.total - down;
    const monthly = Math.round(remaining / PLAN_RULES.months);
    if (p.down !== down) throw new Error(`serene.ts: plan ${p.id} down payment ${p.down} !== ${down}`);
    if (p.monthly !== monthly) throw new Error(`serene.ts: plan ${p.id} monthly ${p.monthly} !== ${monthly}`);
  }
}
assertInvariants();
