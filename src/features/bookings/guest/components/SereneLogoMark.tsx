import { SereneLogoMark as CoreMark } from '@/core/components/SereneLogoMark';
import { HEX } from '@/features/bookings/guest/theme';

export const BRAND_SLATE = HEX.slate;
export const BRAND_SNOW = HEX.snow;

/** The Groups app's crest, sized by height as the booking screens expect (34 : 42). */
export default function SereneLogoMark({ size = 42, color = BRAND_SLATE, snow = BRAND_SNOW }: { size?: number; color?: string; snow?: string }) {
  return <CoreMark width={(size * 34) / 42} fill={color} snow={snow} />;
}
