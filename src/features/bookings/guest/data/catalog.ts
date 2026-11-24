import { pine } from '@/features/bookings/guest/theme';
import { AMENITIES } from '@/features/bookings/guest/data/resort';

// Local mock data mirroring serene-booking-web (server/prisma/seed.js, inventory.js, property.data.js).
// Rates, seasons, occupancy and the sample reviews are placeholders, as on the web project.

export type RoomType = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bedType: string;
  outdoorSpace: string;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  baseRate: number;
  images: string[];
  features: string[];
};

export type RatePlan = {
  code: 'FLEX' | 'FLEX_BB' | 'SAVER';
  name: string;
  description: string;
  refundable: boolean;
  freeCancelHours: number | null;
  breakfastIncluded: boolean;
  breakfastPerGuest: number;
  discountPercent: number;
};

export type Apartment = { number: string; floor: number; floorLabel: string; areaSqft: number | null; slug: string };

const commonFeatures = [
  'Fully furnished one-bedroom apartment',
  'Separate sitting room with kitchenette',
  'En-suite bathroom with shower',
  'Central heating & heated floors',
  'High-speed Wi-Fi',
  'Daily housekeeping',
  '24/7 room service',
];

export const ROOM_TYPES: RoomType[] = [
  {
    slug: 'classic-one-bedroom',
    name: 'Classic One-Bedroom Apartment',
    tagline: 'A cosy mountain base with its own balcony',
    description:
      'A compact, fully furnished one-bedroom apartment with a bedroom, sitting room with kitchenette, en-suite bathroom and a private balcony. Ideal for couples and short getaways.',
    bedType: '1 double bed',
    outdoorSpace: 'Private balcony',
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    baseRate: 18000,
    images: ['/images/interiors/living-room-sofa.jpg', '/images/interiors/bedroom-arch-window.jpg', '/images/interiors/kitchenette.jpg', '/images/interiors/dining-daylight.jpg', '/images/resort/tower-front.jpg', '/images/floor-plans/floor-1.png'],
    features: ['Private balcony', ...commonFeatures],
  },
  {
    slug: 'premier-one-bedroom',
    name: 'Premier One-Bedroom Apartment',
    tagline: 'More room to unwind after a day in the pines',
    description:
      'A roomier one-bedroom apartment with a larger sitting room, kitchenette, en-suite bathroom and private balcony. A sofa bed in the sitting room makes space for the family.',
    bedType: '1 double bed + sofa bed',
    outdoorSpace: 'Private balcony',
    maxAdults: 3,
    maxChildren: 2,
    maxOccupancy: 4,
    baseRate: 22000,
    images: ['/images/interiors/lounge-art.jpg', '/images/interiors/bedroom.jpg', '/images/interiors/dining-window.jpg', '/images/interiors/kitchenette-evening.jpg', '/images/resort/tower-day.jpg', '/images/floor-plans/floor-2.png'],
    features: ['Private balcony', 'Sofa bed in sitting room', ...commonFeatures],
  },
  {
    slug: 'grand-one-bedroom',
    name: 'Grand One-Bedroom Apartment',
    tagline: 'Our most spacious standard layout',
    description:
      'A generous one-bedroom apartment with a large bedroom, spacious sitting room with kitchenette, en-suite bathroom and a wide private balcony facing the Galiyat.',
    bedType: '1 double bed + sofa bed',
    outdoorSpace: 'Private balcony',
    maxAdults: 3,
    maxChildren: 2,
    maxOccupancy: 4,
    baseRate: 26000,
    images: ['/images/interiors/living-room-wide.jpg', '/images/interiors/bedroom-morning.jpg', '/images/interiors/dining-nook-arch.jpg', '/images/interiors/living-kitchen-evening.jpg', '/images/resort/tower-top.jpg', '/images/floor-plans/floor-6.png'],
    features: ['Wide private balcony', 'Sofa bed in sitting room', ...commonFeatures],
  },
  {
    slug: 'signature-corner-suite',
    name: 'Signature Corner Suite',
    tagline: 'Corner living with views on two sides',
    description:
      'Our largest apartments, set on the corners of the building with windows on two sides, an oversized sitting room, kitchenette, en-suite bathroom and private balcony.',
    bedType: '1 double bed + sofa bed',
    outdoorSpace: 'Private balcony',
    maxAdults: 3,
    maxChildren: 2,
    maxOccupancy: 4,
    baseRate: 34000,
    images: ['/images/interiors/window-view.jpg', '/images/interiors/guests-lounge.jpg', '/images/interiors/bedside-evening.jpg', '/images/interiors/sofa-detail.jpg', '/images/resort/aerial-rooftop-pool.jpg', '/images/floor-plans/floor-3.png'],
    features: ['Corner position, dual aspect', 'Sofa bed in sitting room', ...commonFeatures],
  },
  {
    slug: 'terrace-apartment',
    name: 'Terrace Apartment',
    tagline: 'Top-floor living with your own terrace',
    description:
      'One-bedroom apartments on the 8th floor, each opening onto a private terrace in place of a balcony. Closest to the sky for stargazing at 7,906 ft.',
    bedType: '1 double bed + sofa bed',
    outdoorSpace: 'Private terrace',
    maxAdults: 3,
    maxChildren: 2,
    maxOccupancy: 4,
    baseRate: 30000,
    images: ['/images/resort/rooftop-crown.jpg', '/images/interiors/sunrise-balcony.jpg', '/images/interiors/bedroom-arch-window.jpg', '/images/interiors/decor-dining-detail.jpg', '/images/resort/rooftop-sunset.jpg', '/images/floor-plans/floor-8.png'],
    features: ['Private terrace', 'Top floor', 'Sofa bed in sitting room', ...commonFeatures],
  },
];

export const RATE_PLANS: RatePlan[] = [
  { code: 'FLEX', name: 'Flexible rate', description: 'Room only. Free cancellation until 48 hours before check-in. Pay at the property.', refundable: true, freeCancelHours: 48, breakfastIncluded: false, breakfastPerGuest: 0, discountPercent: 0 },
  { code: 'FLEX_BB', name: 'Flexible with breakfast', description: 'Breakfast at the rooftop restaurant for every guest. Free cancellation until 48 hours before check-in.', refundable: true, freeCancelHours: 48, breakfastIncluded: true, breakfastPerGuest: 1500, discountPercent: 0 },
  { code: 'SAVER', name: 'Non-refundable saver', description: "Save 10%. Room only. This rate can't be refunded if you cancel or change your stay.", refundable: false, freeCancelHours: null, breakfastIncluded: false, breakfastPerGuest: 0, discountPercent: 10 },
];

export const SEASONS = [
  { name: 'Snow season 2026-27', startDate: '2026-12-20', endDate: '2027-02-15', multiplierPct: 115 },
  { name: 'Summer peak 2027', startDate: '2027-06-01', endDate: '2027-08-31', multiplierPct: 125 },
];

export const CONFIG = { currency: 'PKR', taxPercent: 16, weekendUpliftPercent: 10, maxStayNights: 30, maxRooms: 5 };

// ── Apartment inventory (official floor plans) ───────────────────────────
const FLOORS: { floor: number; label: string; areas: (number | null)[]; g?: boolean; terrace?: boolean; types?: string[] }[] = [
  { floor: 0, label: 'G1 floor', g: true, areas: [771, 574, 593, 593, 481, 544, 501, 674] },
  { floor: 1, label: '1st floor', areas: [771, 573, 593, 594, 480, 544, 501, 627, 666, 673, 681, 739, 770, 681, 621, 744] },
  { floor: 2, label: '2nd floor', areas: [771, 573, 593, 594, 480, 544, 501, 627, 667, 674, 680, 691, 673, 734, 727, 671, 720, 681, 621, 744] },
  { floor: 3, label: '3rd floor', areas: [771, 572, 593, 594, 480, 544, 501, 629, 666, 672, 681, 690, 673, 734, 923, 993, 727, 671, 720, 681, 621, 744] },
  { floor: 5, label: '5th floor', areas: [null, null, null, null], types: ['grand-one-bedroom', 'classic-one-bedroom', 'premier-one-bedroom', 'grand-one-bedroom'] },
  { floor: 6, label: '6th floor', areas: [770, 573, 593, 544, 480, 544, 501, 627, 666, 673, 680, 693, 673, 791, 784, 671, 720, 681, 621, 744] },
  { floor: 7, label: '7th floor', areas: [766, 574, 593, 593, 480, 544, 501, 627, 664, 673, 679, 693, 671, 849, 840, 671, 720, 679, 621, 743] },
  { floor: 8, label: '8th floor', terrace: true, areas: [854, 620, 631, 604, 510, 626, 501, 640, 680, 689, 696, 709, 684, 983, 969, 684, 737, 696, 641, 733] },
];

function classify(area: number | null, terrace?: boolean) {
  if (terrace) return 'terrace-apartment';
  const a = area ?? 0;
  if (a >= 800) return 'signature-corner-suite';
  if (a >= 700) return 'grand-one-bedroom';
  if (a >= 600) return 'premier-one-bedroom';
  return 'classic-one-bedroom';
}

export const APARTMENTS: Apartment[] = FLOORS.flatMap((f) =>
  f.areas.map((areaSqft, i) => ({
    number: f.g ? `G-${i + 1}` : `${f.floor}${String(i + 1).padStart(2, '0')}`,
    floor: f.floor,
    floorLabel: f.label,
    areaSqft,
    slug: f.types ? f.types[i] : classify(areaSqft, f.terrace),
  })),
);

export const apartmentsOf = (slug: string) => APARTMENTS.filter((a) => a.slug === slug);
export function areaRangeOf(slug: string) {
  const areas = apartmentsOf(slug).map((a) => a.areaSqft).filter((a): a is number => a != null);
  const min = Math.min(...areas);
  const max = Math.max(...areas);
  return min === max ? `${min} sq ft` : `${min}–${max} sq ft`;
}
export const roomType = (slug: string) => ROOM_TYPES.find((t) => t.slug === slug);
export const ratePlan = (code: string) => RATE_PLANS.find((r) => r.code === code);

// ── Property content ─────────────────────────────────────────────────────
export const PROPERTY = {
  name: 'Serene Heights Nathia Gali',
  headline: "Pakistan's first & largest winter resort",
  description:
    'A fully managed hotel-apartment resort at 7,906 ft in the Galiyat, beside PAF Airbase Nathia Gali. Fully furnished one-bedroom apartments with private balconies, a heated infinity pool, rooftop dining and 50+ resort facilities, two hours from Islamabad.',
  address: '1.5 KM, Kala Bagh Air Base Road, Nathia Gali, Khyber Pakhtunkhwa, Pakistan',
  phone: '042-111-111-744',
  developer: 'DM Consortium',
  distances: [
    { place: 'PAF Airbase Nathia Gali', distance: '50 m' },
    { place: 'Main Nathia Gali Road', distance: '1.5 km', drive: '3 min drive' },
    { place: 'Main Bazar Nathia Gali', distance: '5 km', drive: '10 min drive' },
    { place: 'Abbottabad city centre', distance: '35 km', drive: '50 min drive' },
    { place: 'Islamabad', distance: '80 km', drive: '2 hr drive' },
  ],
  policies: [
    { label: 'Check-in', value: 'From 2:00 PM' },
    { label: 'Check-out', value: 'Until 12:00 PM' },
    { label: 'Cancellation', value: 'Free cancellation up to 48 hours before check-in on flexible rates. Non-refundable saver rates can’t be refunded. No prepayment: pay at the property.' },
    { label: 'Children & beds', value: 'Children of all ages are welcome. Children under 5 stay free using existing beds.' },
    { label: 'ID required', value: 'A valid CNIC or passport is required for every adult guest at check-in.' },
    { label: 'Smoking', value: 'Non-smoking apartments. Smoking is allowed in designated outdoor areas only.' },
    { label: 'Pets', value: 'Pets are not allowed.' },
    { label: 'Payment', value: 'Pay at the property by cash or card. Online payment is coming soon.' },
  ],
  amenities: AMENITIES,
  experiences: [
    { title: 'Rooftop restaurant', image: '/images/dining/rooftop-restaurant.jpg' },
    { title: 'Glass-roof pool', image: '/images/resort/glass-roof-pool.jpg' },
    { title: 'Ski slope', image: '/images/activities/ski-slope.jpg' },
    { title: 'Sky lounge', image: '/images/dining/sky-lounge.jpg' },
    { title: 'Archery range', image: '/images/activities/archery.jpg' },
    { title: 'Mini golf', image: '/images/activities/mini-golf.jpg' },
    { title: 'Adventure park', image: '/images/activities/adventure-park.jpg' },
    { title: 'Sunset terrace', image: '/images/dining/sunset-terrace.jpg' },
    { title: 'Winter trails', image: '/images/activities/winter-trails.jpg' },
    { title: 'Snowy slopes', image: '/images/activities/ski-slope-aerial.jpg' },
    { title: 'Rooftop dining', image: '/images/dining/rooftop-dining-glass.jpg' },
    { title: 'Daily housekeeping', image: '/images/interiors/housekeeping.jpg' },
  ],
  gallery: [
    '/images/interiors/living-room-wide.jpg',
    '/images/interiors/sunrise-balcony.jpg',
    '/images/interiors/corridor.jpg',
    '/images/interiors/artwork.jpg',
    '/images/interiors/decor-detail.jpg',
    '/images/resort/hero-tower-mist.jpg',
    '/images/resort/aerial-snow-resort.jpg',
    '/images/resort/glass-roof-pool.jpg',
    '/images/resort/tower-snow-night.jpg',
    '/images/resort/night-facade-portrait.jpg',
    '/images/resort/tower-sunset-forest.jpg',
    '/images/resort/aerial-pool-portrait.jpg',
  ],
};

export const REASONS = [
  { label: 'Real mountain air', title: '7,906 ft above the noise, two hours from Islamabad', text: 'Set in the pine forests of the Galiyat beside PAF Airbase Nathia Gali, with cool summers, snowy winters and views across the hills from every balcony.', image: '/images/interiors/window-view.jpg' },
  { label: 'Made for every season', title: "Pakistan's first winter resort, open all year", text: 'A heated infinity pool under glass, sauna and massage, a snow slope, mini golf, archery and a rooftop restaurant, all a short walk from your door.', image: '/images/resort/glass-roof-pool.jpg' },
  { label: 'Fully managed living', title: 'A furnished apartment, with a hotel behind it', text: 'Daily housekeeping, a 24/7 front desk and concierge, room service and heated floors. Arrive, unpack and settle in.', image: '/images/interiors/living-room-wide.jpg' },
];

export const FACTS = [
  { label: 'Altitude', value: '7,906 ft' },
  { label: 'Apartments', value: `${APARTMENTS.length} residences` },
  { label: 'On site', value: '50+ facilities' },
  { label: 'From Islamabad', value: 'Two hours' },
  { label: 'Developer', value: 'DM Consortium' },
];

// Sample reviews for the UI (the web shows real guest reviews from its API).
export const REVIEWS = [
  { id: 'r1', rating: 5, title: 'Woke up above the clouds', body: 'The balcony view at sunrise was worth the drive alone. Spotless apartment, warm floors and a very helpful front desk.', author: 'Ayesha K.', country: 'Pakistan', roomType: 'Grand One-Bedroom Apartment', stayed: 'October 2026' },
  { id: 'r2', rating: 5, title: 'Perfect winter weekend', body: 'Snow outside, heated pool inside. The kids loved the slope and the rooftop breakfast was excellent.', author: 'Hamza R.', country: 'Pakistan', roomType: 'Premier One-Bedroom Apartment', stayed: 'January 2026' },
  { id: 'r3', rating: 4, title: 'Calm and well run', body: 'A real apartment with a hotel behind it. Housekeeping every day and the kitchenette made longer stays easy.', author: 'Sara M.', country: 'United Kingdom', roomType: 'Classic One-Bedroom Apartment', stayed: 'August 2026' },
  { id: 'r4', rating: 5, title: 'The terrace at night', body: 'Stargazing from our own terrace on the top floor. Quiet, comfortable and beautifully finished.', author: 'Usman T.', country: 'UAE', roomType: 'Terrace Apartment', stayed: 'June 2026' },
];
export const REVIEW_SCORE = { average: 4.8, count: 126 };

export const ARRIVAL_TIMES = ["I don't know", '2:00 – 3:00 PM', '3:00 – 4:00 PM', '4:00 – 5:00 PM', '5:00 – 6:00 PM', '6:00 – 8:00 PM', '8:00 – 10:00 PM', 'After 10:00 PM'];
