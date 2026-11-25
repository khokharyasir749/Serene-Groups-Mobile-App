// Photography copied from serene-group-web/client/public/media into assets/media.
import type { ImageSource } from "expo-image";
import { ROOM_INTERIOR_GENERATED } from "./roomInterior.generated";
import type { ProjectSlug } from "@/core/constants/serene";

export const MEDIA = {
  loginHero: require("../../../assets/media/login-hero.jpg") as ImageSource,
  logoWhite: require("../../../assets/media/logo-white.png") as ImageSource,
  nathiaGali: require("../../../assets/media/ng-hero.webp") as ImageSource,
  nathiaGaliSky: require("../../../assets/media/ng-sky.webp") as ImageSource,
  nathiaGaliNight: require("../../../assets/media/ng-night.webp") as ImageSource,
  lahore: require("../../../assets/media/lhr-hero.jpg") as ImageSource,
  lahoreTower: require("../../../assets/media/lhr-tower.jpg") as ImageSource,
  farms: require("../../../assets/media/serene-farms.jpg") as ImageSource,
};

export const WEB_MEDIA = {
  logoBlue: require("../../../assets/media/logo-blue.png") as ImageSource,
  pool: require("../../../assets/media/stay-pool.jpg") as ImageSource,
  upClouds: require("../../../assets/media/up-clouds.webp") as ImageSource,
  upSnow: require("../../../assets/media/up-snow.webp") as ImageSource,
};

/** Photos that drift behind the Serene Booking panel (web .stays__img). */
export const STAY_FLOATERS: ImageSource[] = [
  require("../../../assets/media/f-pool.jpg") as ImageSource,
  require("../../../assets/media/f-snow.jpg") as ImageSource,
  require("../../../assets/media/f-adventure.jpg") as ImageSource,
  require("../../../assets/media/f-golf.jpg") as ImageSource,
  require("../../../assets/media/f-dining.jpg") as ImageSource,
  require("../../../assets/media/f-mist.jpg") as ImageSource,
];

/** Gallery photos with the captions the web uses. */
export const NG_GALLERY: { src: ImageSource; caption: string }[] = [
  { src: STAY_FLOATERS[0], caption: "Rooftop infinity pool from above" },
  { src: STAY_FLOATERS[1], caption: "The resort under snow" },
  { src: STAY_FLOATERS[2], caption: "Adventure park" },
  { src: STAY_FLOATERS[3], caption: "Mini golf course" },
  { src: STAY_FLOATERS[4], caption: "Rooftop restaurant" },
  { src: STAY_FLOATERS[5], caption: "Tower rising out of the mist" },
];

export const LHR_GALLERY: { src: ImageSource; caption: string }[] = [
  { src: MEDIA.lahore, caption: "Gulberg Main Boulevard at dusk" },
  { src: MEDIA.lahoreTower, caption: "The 21-storey tower" },
  { src: require("../../../assets/media/lhr-aerial.jpg") as ImageSource, caption: "Beside the CBD, from above" },
  { src: require("../../../assets/media/lhr-street.jpg") as ImageSource, caption: "Street level" },
];

/**
 * Bedroom / suite INTERIOR photos per room type. None exist in the web repo yet (only exteriors, terraces and
 * amenity renders), so this is empty. Drop files in assets/media/rooms/ and run `npm run rooms` — cards use them first.
 */
export const ROOM_INTERIOR: Partial<Record<string, ImageSource>> = ROOM_INTERIOR_GENERATED;

const ROOM_EXTERIOR: Record<string, ImageSource> = {
  "classic-one-bedroom": require("../../../assets/media/room-classic.webp") as ImageSource,
  "premier-one-bedroom": require("../../../assets/media/room-premier.jpg") as ImageSource,
  "grand-one-bedroom": require("../../../assets/media/room-grand.webp") as ImageSource,
  "signature-corner-suite": require("../../../assets/media/room-signature.jpg") as ImageSource,
  "terrace-apartment": require("../../../assets/media/room-terrace.jpg") as ImageSource,
};

/** Photo for a room type: the interior when we have one, otherwise the building render. */
export const ROOM_MEDIA: Record<string, ImageSource> = new Proxy(ROOM_EXTERIOR, {
  get: (target, key: string) => ROOM_INTERIOR[key] ?? target[key],
});

export const PROJECT_MEDIA: Record<ProjectSlug, ImageSource> = {
  "nathia-gali": MEDIA.nathiaGali,
  lahore: MEDIA.lahore,
};

/** Photo for any unit type (room slug, SPU, 1-BHK preset, Lahore unit kind). */
export function unitImage(project: ProjectSlug, unitType: string): ImageSource {
  if (ROOM_MEDIA[unitType]) return ROOM_MEDIA[unitType];
  if (project === "lahore") return unitType === "office" || unitType === "co-working" ? MEDIA.lahoreTower : MEDIA.lahore;
  if (unitType.startsWith("1bhk")) return ROOM_MEDIA["premier-one-bedroom"];
  return MEDIA.nathiaGaliNight; // Smart Property Unit
}
