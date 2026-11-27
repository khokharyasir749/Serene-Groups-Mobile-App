import { StyleSheet, View } from 'react-native';

import { SereneLogoMark } from '@/core/components/SereneLogoMark';
import { Text } from '@/features/bookings/guest/components/Text';
import { C, FONTS, HEX } from '@/features/bookings/guest/theme';
import { groups } from '@/core/constants/theme';

/**
 * The brand lockup of the Serene Groups header: the crest, "SERENE" in the serif with the product name under it in gold.
 * Same size everywhere. Over dark photos pass `onPhoto`.
 */
export default function BrandLockup({ sub = 'BOOKINGS', onPhoto }: { sub?: string; onPhoto?: boolean }) {
  return (
    <View style={styles.row}>
      <SereneLogoMark width={40} fill={onPhoto ? HEX.white : groups.pine} snow={onPhoto ? groups.pine : groups.plate} />
      <View style={styles.words}>
        <Text style={[styles.name, onPhoto && styles.nameOnPhoto]} numberOfLines={1} adjustsFontSizeToFit>
          SERENE
        </Text>
        <Text style={[styles.sub, onPhoto && styles.subOnPhoto]} numberOfLines={1}>
          {sub}
        </Text>
      </View>
    </View>
  );
}

const shadow = { textShadowColor: 'rgba(0, 0, 0, 0.45)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 5 } as const;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1, minWidth: 0 },
  words: { flexShrink: 1, minWidth: 0, gap: 1 },
  name: { fontFamily: FONTS.display, fontSize: 20, lineHeight: 26, letterSpacing: 1.4, color: groups.pine },
  nameOnPhoto: { color: HEX.white, ...shadow },
  sub: { fontFamily: FONTS.uiMedium, fontSize: 10.5, lineHeight: 14, letterSpacing: 0.9, color: C.goldInk },
  subOnPhoto: { color: C.goldBright, ...shadow },
});
