import { HEX } from '@/features/bookings/guest/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

/** Clear glass, shared by the dock's ball, the up-arrow and every pill on a photo: light at the rims, see-through in the middle. */
export const GLASS = ['rgba(255,255,255,0.38)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.24)'] as const;

/** The glass body. Goes first inside a container that spreads `glassEdge` and sets its own radius. */
export default function ClearGlass() {
  return <LinearGradient pointerEvents="none" colors={GLASS} locations={[0, 0.62, 1]} style={StyleSheet.absoluteFill} />;
}

/** Container half of the glass. No fill and no elevation: on Android an elevated see-through view paints a dark box. */
export const glassEdge = { overflow: 'hidden', backgroundColor: 'transparent', borderWidth: 1.25, borderColor: 'rgba(255, 255, 255, 0.9)', elevation: 0, shadowOpacity: 0 } as const;

/** White text or icon on clear glass over a photo: the soft dark shadow keeps it readable on bright areas. */
export const glassInk = { color: HEX.white, textShadowColor: 'rgba(0, 0, 0, 0.7)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 5 } as const;
