import { APARTMENTS, CONFIG, RATE_PLANS, ROOM_TYPES, SEASONS, type RatePlan, type RoomType } from '@/features/bookings/guest/data/catalog';

export type Stay = { checkIn: string; checkOut: string; adults: number; children: number; rooms: number };

// ── Dates (ISO yyyy-mm-dd, local calendar days) ──────────────────────────
const pad = (n: number) => String(n).padStart(2, '0');
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISO = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (iso: string, n: number) => {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};
export const today = () => toISO(new Date());
export const nightsBetween = (a: string, b: string) => Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / 86_400_000);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const monthName = (m: number) => MONTHS[m];
export const fmtDate = (iso: string) => {
  const d = fromISO(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
};
/** "4 Dec" — compact, for tight pills. */
export const fmtDay = (iso: string) => {
  const d = fromISO(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
};
export const fmtShort = (iso: string) => {
  const d = fromISO(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
};

// ── Formatting ───────────────────────────────────────────────────────────
export const money = (n: number) => `PKR ${Math.round(n).toLocaleString('en-US')}`;
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
export const guestsLabel = (adults: number, children: number) =>
  children ? `${plural(adults, 'adult')}, ${plural(children, 'child', 'children')}` : plural(adults, 'adult');

export const defaultStay = (): Stay => {
  const ci = addDays(today(), 14);
  return { checkIn: ci, checkOut: addDays(ci, 2), adults: 2, children: 0, rooms: 1 };
};

// ── Pricing (server/lib/pricing.js) ──────────────────────────────────────
// per night, per room: baseRate × seasonal multiplier × weekend uplift (Fri & Sat nights)
export type Quote = {
  nights: number;
  nightly: { date: string; rate: number }[];
  roomSubtotal: number;
  discountTotal: number;
  breakfastTotal: number;
  taxPercent: number;
  taxTotal: number;
  grandTotal: number;
  undiscountedTotal: number;
};

export function nightlyRate(type: RoomType, iso: string) {
  let pct = 100;
  for (const s of SEASONS) if (iso >= s.startDate && iso <= s.endDate) pct = Math.max(pct, s.multiplierPct);
  const day = fromISO(iso).getDay();
  const weekend = day === 5 || day === 6 ? 100 + CONFIG.weekendUpliftPercent : 100;
  return Math.round((type.baseRate * pct * weekend) / 10_000);
}

export function quote(type: RoomType, plan: RatePlan, stay: Stay): Quote {
  const n = Math.max(0, nightsBetween(stay.checkIn, stay.checkOut));
  const nightly = Array.from({ length: n }, (_, i) => {
    const date = addDays(stay.checkIn, i);
    return { date, rate: nightlyRate(type, date) };
  });
  const roomSubtotal = nightly.reduce((s, x) => s + x.rate, 0) * stay.rooms;
  const discountTotal = Math.round((roomSubtotal * plan.discountPercent) / 100);
  const breakfastTotal = plan.breakfastIncluded ? plan.breakfastPerGuest * (stay.adults + stay.children) * n : 0;
  const taxable = roomSubtotal - discountTotal + breakfastTotal;
  const taxTotal = Math.round((taxable * CONFIG.taxPercent) / 100);
  const grandTotal = taxable + taxTotal;
  return {
    nights: n,
    nightly,
    roomSubtotal,
    discountTotal,
    breakfastTotal,
    taxPercent: CONFIG.taxPercent,
    taxTotal,
    grandTotal,
    undiscountedTotal: grandTotal + Math.round(discountTotal * (1 + CONFIG.taxPercent / 100)),
  };
}

// ── Mock availability: a stable pseudo-occupancy per type and date ───────
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
};

export function availability(type: RoomType, stay: Stay) {
  const total = APARTMENTS.filter((a) => a.slug === type.slug).length;
  const n = Math.max(1, nightsBetween(stay.checkIn, stay.checkOut));
  let minFree = total;
  for (let i = 0; i < n; i++) {
    const date = addDays(stay.checkIn, i);
    const booked = Math.round(total * (0.35 + hash(`${type.slug}${date}`) * 0.6));
    minFree = Math.min(minFree, total - booked);
  }
  const available = Math.max(0, minFree);
  const perRoom = Math.ceil((stay.adults + stay.children) / stay.rooms);
  const fitsParty = perRoom <= type.maxOccupancy && Math.ceil(stay.adults / stay.rooms) <= type.maxAdults;
  return {
    total,
    available,
    soldOut: available < stay.rooms,
    fitsParty,
    bookedPercent: Math.round(((total - available) / total) * 100),
  };
}

export const lowestQuote = (type: RoomType, stay: Stay) =>
  RATE_PLANS.map((p) => ({ plan: p, q: quote(type, p, stay) })).sort((a, b) => a.q.grandTotal - b.q.grandTotal)[0];

export const fromRate = (type: RoomType) => type.baseRate;
export const allTypes = ROOM_TYPES;
