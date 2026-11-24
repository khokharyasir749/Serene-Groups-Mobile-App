// Contact details. WhatsApp + social match serene-groups-app (constants/serene.ts) and the web's property data
// (server/modules/property/property.data.js); the Serene Bookings site is the web client's production URL
// (serene-booking-web/client/.env.example: SITE_URL); Serene Groups is that same group site's home page. Reservations phone and email are the resort's own.

export type Glyph = string;

export const MAPS_QUERY = 'Serene Heights, Kala Bagh Air Base Road, Nathia Gali';
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
export const HEAD_OFFICE = 'DM Consortium, H. No. 71 C3 Gulberg III, Park View Lane, Lahore';
export const UAN = { value: '042-111-111-744', href: 'tel:+9242111111744' };

export const CONTACT = {
  lines: [
    { icon: 'logo-whatsapp', label: 'WhatsApp', value: '+92 300 8497999', href: 'https://wa.me/923008497999', cta: 'Message us' },
    { icon: 'call-outline', label: 'Reservations', value: '+92 321 4979447', href: 'tel:+923214979447', cta: 'Call now' },
    { icon: 'mail-outline', label: 'Email', value: 'reservations@sereneheightsnathiagali.com', href: 'mailto:reservations@sereneheightsnathiagali.com', cta: 'Write to us' },
  ],
  sites: [
    { icon: 'calendar-outline', label: 'Serene Bookings', value: 'sereneheightsgroup.com/booking', href: 'https://www.sereneheightsgroup.com/booking' },
    { icon: 'globe-outline', label: 'Serene Groups', value: 'sereneheightsgroup.com', href: 'https://www.sereneheightsgroup.com' },
  ],
  social: [
    { label: 'Instagram', icon: 'logo-instagram', href: 'https://www.instagram.com/sereneheightshotelsandresorts' },
    { label: 'Facebook', icon: 'logo-facebook', href: 'https://www.facebook.com/sereneheightshotelsandresorts' },
    { label: 'YouTube', icon: 'logo-youtube', href: 'https://www.youtube.com/@sereneheightsnathiagali5573' },
  ],
} as const;
