import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import BrandLockup from '@/features/bookings/guest/components/BrandLockup';
import { Text } from '@/features/bookings/guest/components/Text';
import { CONTACT } from '@/features/bookings/guest/data/contact';
import { C, FONTS, S, shadow } from '@/features/bookings/guest/theme';
import { glassCard } from '@/features/bookings/guest/theme/glass';

type Glyph = ComponentProps<typeof Ionicons>['name'];

const open = (href: string) => void Linking.openURL(href).catch(() => {});

/** A hairline with a centred diamond — the section's ornament. */
function Ornament({ children }: { children?: React.ReactNode }) {
  return (
    <View style={styles.ornament}>
      <View style={styles.ornLine} />
      {children ?? <View style={styles.diamond} />}
      <View style={styles.ornLine} />
    </View>
  );
}

function Row({ icon, label, value, cta, href, last }: { icon: Glyph; label: string; value: string; cta: string; href: string; last?: boolean }) {
  return (
    <Pressable onPress={() => open(href)} style={({ pressed }) => [styles.row, !last && styles.rowLine, pressed && styles.pressed]} accessibilityRole="link" accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.well}>
        <Ionicons name={icon} size={18} color={C.pine} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        {/* A long email breaks once, right after the @, instead of shrinking or truncating. */}
        <Text style={styles.value} numberOfLines={2}>
          {value.replace('@', '@​')}
        </Text>
        <Text style={styles.cta}>{cta}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.ink40} />
    </Pressable>
  );
}

/** Discover's closing section: crest between hairlines, an editorial heading, contact lines, both sites, social. */
export default function LuxuryFooter({ bottomSpace }: { bottomSpace: number }) {
  const [booking, group] = CONTACT.sites;
  return (
    <View style={[styles.wrap, { paddingBottom: bottomSpace }]}>
      <Ornament>
        <BrandLockup />
      </Ornament>

      <View style={styles.head}>
        <Text style={styles.eyebrow}>CONCIERGE · SEVEN DAYS A WEEK</Text>
        <Text style={styles.title}>Reservations{'\n'}& Concierge</Text>
      </View>

      <View style={styles.group}>
        {CONTACT.lines.map((l, i) => (
          <Row key={l.label} icon={l.icon as Glyph} label={l.label} value={l.value} cta={l.cta} href={l.href} last={i === CONTACT.lines.length - 1} />
        ))}
      </View>

      {/* Primary: book online */}
      <Pressable
        onPress={() => open(booking.href)}
        accessibilityRole="link"
        accessibilityLabel={`${booking.label}: ${booking.value}`}
        style={({ pressed }) => [styles.book, pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bookLabel}>BOOK ONLINE</Text>
          <Text style={styles.bookValue} numberOfLines={1}>{booking.value}</Text>
        </View>
        <View style={styles.bookGo}>
          <Ionicons name="arrow-forward" size={17} color={C.pine} />
        </View>
      </Pressable>

      {/* Secondary: the group site, as a quiet text link */}
      <Pressable onPress={() => open(group.href)} accessibilityRole="link" accessibilityLabel={`${group.label}: ${group.value}`} style={({ pressed }) => [styles.groupLink, pressed && styles.pressed]}>
        <Ionicons name="globe-outline" size={15} color={C.ink55} />
        <Text style={styles.groupText}>
          {group.label} · <Text style={styles.groupValue}>{group.value}</Text>
        </Text>
        <Ionicons name="arrow-up-outline" size={13} color={C.ink55} style={{ transform: [{ rotate: '45deg' }] }} />
      </Pressable>

      <View style={styles.social}>
        {CONTACT.social.map((s) => (
          <Pressable key={s.label} onPress={() => open(s.href)} hitSlop={6} style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]} accessibilityRole="link" accessibilityLabel={s.label}>
            <Ionicons name={s.icon as Glyph} size={17} color={C.pine} />
          </Pressable>
        ))}
      </View>

      <Ornament />
      <Text style={styles.place}>NATHIA GALI · 7,906 FT</Text>
      <Text style={styles.small}>{`© ${new Date().getFullYear()} Serene Heights · DM Consortium`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 52, paddingTop: 8, paddingHorizontal: S.gutter },
  ornament: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  ornLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: C.line },
  diamond: { width: 6, height: 6, backgroundColor: C.gold, transform: [{ rotate: '45deg' }] },
  head: { alignItems: 'center', marginTop: 18 },
  eyebrow: { color: C.ink55, fontFamily: FONTS.uiBold, fontSize: 10, letterSpacing: 2 },
  title: { color: C.pine, fontFamily: FONTS.display, fontSize: 34, lineHeight: 37, textAlign: 'center', marginTop: 10 },
  lede: { color: C.ink55, fontFamily: FONTS.ui, fontSize: 13.5, lineHeight: 20, textAlign: 'center', marginTop: 10, maxWidth: 300 },
  group: { marginTop: 26, borderRadius: 24, backgroundColor: C.white, paddingHorizontal: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...shadow.card, ...glassCard },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15 },
  rowLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  well: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: C.sand, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  label: { color: C.ink55, fontFamily: FONTS.uiBold, fontSize: 9.5, letterSpacing: 1.4 },
  value: { color: C.ink, fontFamily: FONTS.uiSemi, fontSize: 15, marginTop: 2, fontVariant: ['tabular-nums'] },
  cta: { color: C.ink55, fontFamily: FONTS.uiSemi, fontSize: 11.5, marginTop: 2 },
  book: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 16, paddingLeft: 22, paddingRight: 8, height: 66, borderRadius: 33, backgroundColor: C.pine, ...shadow.card },
  bookLabel: { color: C.cream70, fontFamily: FONTS.uiBold, fontSize: 9.5, letterSpacing: 1.8 },
  bookValue: { color: C.cream, fontFamily: FONTS.uiSemi, fontSize: 15, marginTop: 2 },
  bookGo: { width: 50, height: 50, borderRadius: 25, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  groupLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 16, paddingVertical: 6 },
  groupText: { color: C.ink55, fontFamily: FONTS.ui, fontSize: 13 },
  groupValue: { color: C.pine, fontFamily: FONTS.uiSemi, textDecorationLine: 'underline' },
  social: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 26, marginBottom: 26 },
  socialBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.white, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  place: { color: C.ink55, fontFamily: FONTS.uiBold, fontSize: 10, letterSpacing: 2.2, textAlign: 'center', marginTop: 18 },
  small: { color: C.ink40, fontFamily: FONTS.ui, fontSize: 11.5, textAlign: 'center', marginTop: 6 },
  pressed: { opacity: 0.7 },
});
