import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import SereneLogoMark from '@/features/bookings/guest/components/SereneLogoMark';
import { Text } from '@/features/bookings/guest/components/Text';
import { PressableScale } from '@/features/bookings/guest/components/ui';
import { CONTACT } from '@/features/bookings/guest/data/contact';
import { C, FONTS, S } from '@/features/bookings/guest/theme';

type Glyph = ComponentProps<typeof Ionicons>['name'];
const open = (href: string) => void Linking.openURL(href).catch(() => {});

/** Discover's closing chapter: people to talk to, on deep Pine, running to the end of the page. */
export default function LuxuryFooter({ bottomSpace }: { bottomSpace: number }) {
  const [whatsapp, call] = CONTACT.lines;
  const rows = [CONTACT.lines[2], ...CONTACT.sites];
  return (
    <View style={[styles.wrap, { paddingBottom: bottomSpace + 12 }]}>
      <SereneLogoMark size={46} color={C.sand} snow={C.deep} />
      <Text style={styles.title}>
        Someone to{'\n'}
        <Text style={styles.soft}>look after you.</Text>
      </Text>
      <Text style={styles.copy}>Our reservations team replies on WhatsApp and by phone, seven days a week.</Text>
      <View style={styles.actions}>
        <PressableScale onPress={() => open(whatsapp.href)} style={[styles.btn, styles.gold]} accessibilityRole="link" accessibilityLabel={`WhatsApp ${whatsapp.value}`}>
          <Ionicons name="logo-whatsapp" size={20} color={C.deep} />
          <Text style={[styles.btnText, { color: C.deep }]}>WhatsApp</Text>
        </PressableScale>
        <PressableScale onPress={() => open(call.href)} style={[styles.btn, styles.line]} accessibilityRole="link" accessibilityLabel={`Call ${call.value}`}>
          <Ionicons name="call-outline" size={19} color={C.sand} />
          <Text style={[styles.btnText, { color: C.sand }]}>Call us</Text>
        </PressableScale>
      </View>
      <View style={styles.list}>
        {rows.map((r) => (
          <Pressable key={r.label} onPress={() => open(r.href)} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]} accessibilityRole="link" accessibilityLabel={`${r.label}: ${r.value}`}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>{r.label}</Text>
              <Text style={styles.rowValue} numberOfLines={1} adjustsFontSizeToFit>{r.value}</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={C.goldBright} />
          </Pressable>
        ))}
      </View>
      <View style={styles.social}>
        {CONTACT.social.map((s) => (
          <PressableScale key={s.label} onPress={() => open(s.href)} style={styles.socialBtn} accessibilityRole="link" accessibilityLabel={s.label}>
            <Ionicons name={s.icon as Glyph} size={21} color={C.sand} />
          </PressableScale>
        ))}
      </View>
      <Text style={styles.small}>{`© ${new Date().getFullYear()} Serene Heights, DM Consortium`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 64, paddingHorizontal: S.gutter, paddingTop: 48, backgroundColor: C.deep, borderTopLeftRadius: 38, borderTopRightRadius: 38 },
  title: { fontFamily: FONTS.display, fontSize: 48, lineHeight: 49, letterSpacing: -1, color: C.sand, marginTop: 24 },
  soft: { fontFamily: FONTS.displayItalic, fontStyle: 'italic', fontSize: 48, color: C.goldBright },
  copy: { fontFamily: FONTS.ui, fontSize: 16, lineHeight: 25, color: C.cream70, marginTop: 14 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 24 },
  btn: { flex: 1, height: 58, borderRadius: 29, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  gold: { backgroundColor: C.goldBright },
  line: { borderWidth: 1, borderColor: C.glassEdge, backgroundColor: C.glass },
  btnText: { fontFamily: FONTS.uiBold, fontSize: 16 },
  list: { marginTop: 32, borderBottomWidth: 1, borderBottomColor: C.glass },
  row: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderTopColor: C.glass },
  rowLabel: { fontFamily: FONTS.ui, fontSize: 13.5, color: C.cream70 },
  rowValue: { fontFamily: FONTS.uiMedium, fontSize: 15, lineHeight: 21, color: C.sand },
  social: { flexDirection: 'row', gap: 10, marginTop: 24 },
  socialBtn: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: C.glass, alignItems: 'center', justifyContent: 'center' },
  small: { fontFamily: FONTS.ui, fontSize: 13, color: C.cream70, marginTop: 24 },
});
