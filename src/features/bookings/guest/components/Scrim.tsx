import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

/**
 * A natural scrim for text over photography: neutral black (never a colour tint), so architecture keeps its true
 * colours. `top` darkens just the first third (logos, status bar); `bottom` darkens the lower half, eased in so it
 * never forms a visible band. Pass 0.35–0.55 for typical white text.
 */
export default function Scrim({ top = 0, bottom = 0 }: { top?: number; bottom?: number }) {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[`rgba(0,0,0,${top})`, `rgba(0,0,0,${top * 0.35})`, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', `rgba(0,0,0,${bottom * 0.4})`, `rgba(0,0,0,${bottom})`]}
      locations={[0, 0.14, 0.34, 0.5, 0.76, 1]}
      style={StyleSheet.absoluteFill}
    />
  );
}
