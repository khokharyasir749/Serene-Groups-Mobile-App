// Resort content mirrored from serene-booking-web: server/modules/property/property.data.js (amenities, floors, access)
// and client/app/{amenities,floor-plans,contact} (group blurbs, copy).

export type Amenity = { key: string; name: string; group: string; description?: string };

export const AMENITIES: Amenity[] = [
  { key: 'pool', name: 'Heated infinity pool', group: 'Wellness', description: 'Heated year-round with lifeguard service and towels.' },
  { key: 'spa', name: 'Sauna, jacuzzi & massage', group: 'Wellness', description: 'Steam room, sauna, jacuzzi and massage rooms.' },
  { key: 'gym', name: 'Fitness gym', group: 'Wellness' },
  { key: 'restaurant', name: 'Rooftop restaurant', group: 'Dining', description: 'Breakfast, lunch and dinner at 7,906 ft, plus room service.' },
  { key: 'roomService', name: 'Room service', group: 'Dining' },
  { key: 'housekeeping', name: 'Daily housekeeping & laundry', group: 'Services' },
  { key: 'concierge', name: '24/7 front desk & concierge', group: 'Services', description: 'Express check-in/out and luggage storage.' },
  { key: 'business', name: 'Business & executive centre', group: 'Services', description: 'High-speed Wi-Fi and printing.' },
  { key: 'conference', name: 'Conference room', group: 'Events' },
  { key: 'banquet', name: 'Banquet hall', group: 'Events' },
  { key: 'lawn', name: 'Dedicated lawn', group: 'Events' },
  { key: 'golf', name: '18-hole mini golf', group: 'Activities' },
  { key: 'zipline', name: 'Zipline', group: 'Activities' },
  { key: 'climbing', name: 'Rock climbing', group: 'Activities' },
  { key: 'archery', name: 'Archery', group: 'Activities' },
  { key: 'shooting', name: 'Air gun shooting range', group: 'Activities' },
  { key: 'telescope', name: 'Refractor telescope stargazing', group: 'Activities' },
  { key: 'sports', name: 'Sports room', group: 'Activities', description: 'Table tennis, snooker and video games.' },
  { key: 'heating', name: 'Central & floor heating', group: 'Comfort', description: 'Italian-made central heating; heated floors in apartments and common areas.' },
  { key: 'power', name: '24/7 power backup', group: 'Comfort' },
  { key: 'parking', name: 'Climate-controlled parking floor', group: 'Comfort' },
  { key: 'security', name: '24/7 CCTV & fire safety', group: 'Comfort' },
  { key: 'mosque', name: 'Mosque', group: 'Comfort' },
  { key: 'wifi', name: 'High-speed Wi-Fi', group: 'Comfort' },
];

export const GROUP_BLURB: Record<string, string> = {
  Wellness: 'Unwind after a day in the pines.',
  Dining: 'Meals with a view at 7,906 ft.',
  Services: 'A full hotel team, around the clock.',
  Events: 'Space for weddings, retreats and meetings.',
  Activities: 'Something for every age, every season.',
  Comfort: 'Warm, safe and powered all year.',
};

export const AMENITY_HIGHLIGHTS = ['Glass-roof pool', 'Rooftop dining', 'Ski slope', 'Spa & sauna', '24/7 concierge'];

/** Ionicons (outline) for each amenity key. */
export const AMENITY_ICON: Record<string, string> = {
  pool: 'water-outline',
  spa: 'flower-outline',
  gym: 'barbell-outline',
  restaurant: 'restaurant-outline',
  roomService: 'cafe-outline',
  housekeeping: 'sparkles-outline',
  concierge: 'business-outline',
  business: 'briefcase-outline',
  conference: 'easel-outline',
  banquet: 'balloon-outline',
  lawn: 'leaf-outline',
  golf: 'golf-outline',
  zipline: 'trail-sign-outline',
  climbing: 'trending-up-outline',
  archery: 'locate-outline',
  shooting: 'locate-outline',
  telescope: 'planet-outline',
  sports: 'game-controller-outline',
  heating: 'flame-outline',
  power: 'flash-outline',
  parking: 'car-outline',
  security: 'shield-checkmark-outline',
  mosque: 'moon-outline',
  wifi: 'wifi-outline',
};

export type Floor = { key: string; label: string; summary: string; plan: string };

export const FLOORS: Floor[] = [
  { key: 'ground', label: 'Ground floor', summary: 'Banquet hall, two conference rooms and the main lift lobby.', plan: '/images/floor-plans/ground-2.png' },
  { key: 'g1', label: 'G1 floor', summary: '8 one-bedroom apartments (G-1 to G-8).', plan: '/images/floor-plans/ground-1.png' },
  { key: '1', label: '1st floor', summary: '16 one-bedroom apartments (101 to 116).', plan: '/images/floor-plans/floor-1.png' },
  { key: '2', label: '2nd floor', summary: '20 one-bedroom apartments (201 to 220).', plan: '/images/floor-plans/floor-2.png' },
  { key: '3', label: '3rd floor', summary: '22 one-bedroom apartments (301 to 322), including two corner suites.', plan: '/images/floor-plans/floor-3.png' },
  { key: '5', label: '5th floor', summary: 'Hotel lobby and waiting area, restaurant, and 4 apartments (501 to 504).', plan: '/images/floor-plans/floor-5.png' },
  { key: '6', label: '6th floor', summary: '20 one-bedroom apartments (601 to 620).', plan: '/images/floor-plans/floor-6.png' },
  { key: '7', label: '7th floor', summary: '20 one-bedroom apartments (701 to 720).', plan: '/images/floor-plans/floor-7.png' },
  { key: '8', label: '8th floor', summary: '20 terrace apartments (801 to 820) with private terraces.', plan: '/images/floor-plans/floor-8.png' },
];

export const ACCESS = ['Murree Expressway', 'Hazara Expressway', 'Havelian Interchange'];
