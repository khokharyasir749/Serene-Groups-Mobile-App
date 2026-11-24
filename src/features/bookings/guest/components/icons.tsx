import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

// Outline Ionicons behind the icon names the screens already use, so the whole app shares one icon set.
type Glyph = ComponentProps<typeof Ionicons>['name'];
type Props = { size?: number; color?: string; strokeWidth?: number; fill?: string; style?: StyleProp<TextStyle> };

function make(outline: Glyph, solid?: Glyph) {
  function Icon({ size = 18, color, fill, style }: Props) {
    const filled = !!solid && !!fill && fill !== 'transparent';
    return <Ionicons name={filled ? solid : outline} size={Math.round(size * 1.08)} color={color} style={style} />;
  }
  return Icon;
}

export const Check = make('checkmark-outline');
export const ChevronRight = make('chevron-forward-outline');
export const ChevronLeft = make('chevron-back-outline');
export const ChevronDown = make('chevron-down-outline');
export const ChevronUp = make('chevron-up-outline');
export const CalendarPlus = make('calendar-outline');
export const CalendarDays = make('calendar-outline');
export const Lock = make('lock-closed-outline');
export const Clock = make('time-outline');
export const MapPin = make('location-outline');
export const Phone = make('call-outline');
export const ShieldCheck = make('shield-checkmark-outline');
export const Users = make('people-outline');
export const Coffee = make('cafe-outline');
export const Tag = make('pricetag-outline');
export const Building = make('business-outline');
export const Car = make('car-outline');
export const Dumbbell = make('barbell-outline');
export const Star = make('star-outline', 'star');
export const Utensils = make('restaurant-outline');
export const Waves = make('water-outline');
export const Wifi = make('wifi-outline');
export const X = make('close-outline');
export const BedDouble = make('bed-outline');
export const Compass = make('compass-outline');
export const Images = make('images-outline');
export const Search = make('search-outline');
export const Minus = make('remove-outline');
export const Plus = make('add-outline');
export const Mail = make('mail-outline');
export const Globe = make('globe-outline');
export const WhatsApp = make('logo-whatsapp');
export const Person = make('person-circle-outline');
export const ArrowUp = make('arrow-up-outline');
