import { HEX } from '@/features/bookings/guest/theme';
import { StyleSheet, View } from 'react-native';

import SereneLogoMark, { BRAND_SLATE, BRAND_SNOW } from '@/features/bookings/guest/components/SereneLogoMark';
import { Text } from '@/features/bookings/guest/components/Text';
import { FONTS } from '@/features/bookings/guest/theme';

/**
 * The Serene brand lockup: the Pine Green crest (#314A43, #ECEEED snow) and a stacked "SERENE" / product-name wordmark.
 * Same size everywhere, no background box. On light screens it is all Pine Green; over dark photos pass `onPhoto` and the
 * whole logo turns white with a soft dark shadow.
 */
export default function BrandLockup({ sub = 'BOOKINGS', onPhoto }: { sub?: string; onPhoto?: boolean }) {
  return (
    <View style={styles.row}>
      {onPhoto ? (
        <View>
          {/* The shadow: a dark copy one pixel lower (SVG takes no Android elevation). */}
          <View style={styles.crestShadow}>
            <SereneLogoMark size={42} color={HEX.black} snow={HEX.black} />
          </View>
          <View>
            <SereneLogoMark size={42} color={HEX.white} snow={BRAND_SLATE} />
          </View>
        </View>
      ) : (
        <SereneLogoMark size={42} color={BRAND_SLATE} snow={BRAND_SNOW} />
      )}
      <View style={{ flexShrink: 1, minWidth: 0 }}>
        <Text style={[styles.name, onPhoto && styles.onPhoto]} numberOfLines={1}>SERENE</Text>
        <Text style={[styles.sub, onPhoto && styles.onPhoto]} numberOfLines={1}>{sub}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1, minWidth: 0 },
  name: { fontFamily: FONTS.uiBold, fontSize: 13, letterSpacing: 1.6, color: BRAND_SLATE },
  sub: { fontFamily: FONTS.uiBold, fontSize: 8, letterSpacing: 1.6, marginTop: 1, color: BRAND_SLATE },
  crestShadow: { position: 'absolute', left: 0, top: 1.5, opacity: 0.35 },
  onPhoto: { color: HEX.white, textShadowColor: 'rgba(0, 0, 0, 0.65)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 5 },
});
