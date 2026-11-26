import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { tone } from "@/features/services/components/tone";

type Glyph = keyof typeof Ionicons.glyphMap;

/**
 * Each icon as a fine outline, and the filled form used for the open tab. Ionicons is the set the rest of the app's arrows,
 * chevrons and contact buttons already use, so every icon on a screen shares one hand: thin strokes, round ends, iOS proportions.
 */
const ICONS = {
  home: ["home-outline", "home"],
  calendar: ["calendar-outline", "calendar"],
  gift: ["gift-outline", "gift"],
  user: ["person-outline", "person"],
  towels: ["layers-outline", "layers"],
  pillow: ["bed-outline", "bed"],
  turndown: ["moon-outline", "moon"],
  "wake-up": ["alarm-outline", "alarm"],
  "ac-heating": ["snow-outline", "snow"],
  plumbing: ["water-outline", "water"],
  electrical: ["wifi-outline", "wifi"],
  furniture: ["key-outline", "key"],
  message: ["chatbubble-ellipses-outline", "chatbubble-ellipses"],
  dining: ["restaurant-outline", "restaurant"],
  restaurant: ["restaurant-outline", "restaurant"],
  "room-service": ["notifications-outline", "notifications"],
  minibar: ["wine-outline", "wine"],
  breakfast: ["cafe-outline", "cafe"],
  spa: ["flower-outline", "flower"],
  transfer: ["car-outline", "car"],
  maintenance: ["construct-outline", "construct"],
  "valet-laundry": ["shirt-outline", "shirt"],
} as const satisfies Record<string, readonly [Glyph, Glyph]>;

export type ServiceIconName = keyof typeof ICONS;

type Props = { name: ServiceIconName; size?: number; color?: string; /** The filled form, for the open tab. */ filled?: boolean };

export const ServiceIcon = memo(function ServiceIcon({ name, size = 24, color = tone.pine, filled }: Props) {
  return <Ionicons name={ICONS[name][filled ? 1 : 0]} size={size} color={color} />;
});
