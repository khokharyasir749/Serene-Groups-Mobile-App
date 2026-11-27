import { StyleSheet, Text as RNText, type StyleProp, type TextStyle } from 'react-native';

import { Text } from '@/features/bookings/guest/components/Text';
import { C, FONTS } from '@/features/bookings/guest/theme';

/**
 * A heading set as Serene Groups sets its chapter titles: the last word in italic gold on the same baseline. A single word
 * stays upright. `dark` takes the brighter gold, for headings on Pine or on a photograph.
 */
export default function Title({ children, style, dark }: { children: string; style?: StyleProp<TextStyle>; dark?: boolean }) {
  const words = children.trim().split(' ');
  const last = words.length > 1 ? words.pop() : null;
  return (
    <Text style={style} accessibilityRole="header" accessibilityLabel={children}>
      {last ? `${words.join(' ')} ` : children}
      {last ? <RNText style={[styles.soft, dark && styles.onDark]}>{last}</RNText> : null}
    </Text>
  );
}

const styles = StyleSheet.create({
  soft: { fontFamily: FONTS.displayItalic, color: C.goldInk },
  onDark: { color: C.goldBright },
});
