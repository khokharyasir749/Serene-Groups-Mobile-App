import { C, HEX } from '@/features/bookings/guest/theme';
import { StyleSheet, View } from 'react-native';

/** The body of a pill over a photo: a quiet dark veil, so white text reads on any picture. Goes first inside a container that spreads `glassEdge`. */
export default function ClearGlass() {
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: C.glassDark }]} />;
}

/** Container half. No elevation: on Android an elevated see-through view paints a dark box. */
export const glassEdge = { overflow: 'hidden', backgroundColor: 'transparent', borderWidth: 1, borderColor: C.glassEdge, elevation: 0, shadowOpacity: 0 } as const;

/** White text or icon over a photo. */
export const glassInk = { color: HEX.white } as const;
