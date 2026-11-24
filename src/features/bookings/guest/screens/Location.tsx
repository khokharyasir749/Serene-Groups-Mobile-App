import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import type { ComponentProps } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Accordion from '@/features/bookings/guest/components/Accordion';
import PageHeader from '@/features/bookings/guest/components/PageHeader';
import Scrim from '@/features/bookings/guest/components/Scrim';
import { Text } from '@/features/bookings/guest/components/Text';
import { Button, Photo } from '@/features/bookings/guest/components/ui';
import { PROPERTY } from '@/features/bookings/guest/data/catalog';
import { CONTACT, HEAD_OFFICE, MAPS_LINK } from '@/features/bookings/guest/data/contact';
import { ACCESS } from '@/features/bookings/guest/data/resort';
import { C, FONTS, S, T } from '@/features/bookings/guest/theme';
import { canvas, glassCard } from '@/features/bookings/guest/theme/glass';

const open = (href: string) => void Linking.openURL(href).catch(() => {});
const pad = (n: number) => String(n).padStart(2, '0');

// Route from farthest to nearest, like a journey (as on the web).
const ROUTE = [...PROPERTY.distances].reverse();

const policy = (label: string) => PROPERTY.policies.find((p) => p.label === label)?.value ?? '';
const FAQS = [
  { q: 'What are the check-in and check-out times?', a: `Check-in ${policy('Check-in').toLowerCase()}, check-out ${policy('Check-out').toLowerCase()}. The front desk is open 24/7 for late arrivals.` },
  { q: 'Do I pay when I book?', a: `${policy('Payment')} No card is needed to reserve.` },
  { q: 'Can I cancel my booking?', a: "Flexible rates can be cancelled free of charge up to 48 hours before check-in, from your booking page. Non-refundable saver rates can't be refunded." },
  { q: 'What ID do I need?', a: policy('ID required') },
  { q: 'Are children welcome?', a: policy('Children & beds') },
  { q: 'Is smoking or bringing pets allowed?', a: `${policy('Smoking')} ${policy('Pets')}` },
  { q: 'Is there parking?', a: 'Yes. Serene Heights has a dedicated, climate-controlled parking floor for guests.' },
];

type IconName = ComponentProps<typeof Ionicons>['name'];

/** One contact line: icon, label and action on the first row; the value gets the full width beneath, so long values never shrink. */
function ContactRow({ icon, label, value, cta, href, first }: { icon: string; label: string; value: string; cta?: string; href?: string; first?: boolean }) {
  const single = !value.includes(' ') && value.length > 24;
  const body = (
    <>
      <View style={styles.rowHead}>
        <View style={styles.well}>
          <Ionicons name={icon as IconName} size={17} color={C.cream} />
        </View>
        <Text style={[styles.label, { flex: 1 }]}>{label.toUpperCase()}</Text>
        {cta && (
          <View style={styles.cta}>
            <Text style={styles.ctaText}>{cta}</Text>
            <Ionicons name="arrow-forward-outline" size={13} color={C.pine} />
          </View>
        )}
      </View>
      {/* One unbroken token (an email) stays on a single line at 14 px; addresses wrap normally. */}
      <Text style={[styles.value, single && { fontSize: 14 }]} numberOfLines={single ? 1 : undefined}>
        {value}
      </Text>
    </>
  );
  const style = [styles.row, !first && styles.rowLine];
  return href ? (
    <Pressable onPress={() => open(href)} accessibilityRole="link" accessibilityLabel={`${label}: ${value}`} style={({ pressed }) => [...style, pressed && { opacity: 0.75 }]}>
      {body}
    </Pressable>
  ) : (
    <View style={style}>{body}</View>
  );
}

function Fact({ icon, k, v }: { icon: IconName; k: string; v: string }) {
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={18} color={C.pine} />
      <Text style={styles.factK}>{k.toUpperCase()}</Text>
      <Text style={styles.factV}>{v}</Text>
    </View>
  );
}

// Location & contact, after the web's /contact: how to get here, who to talk to, and the answers guests ask most.
export default function Location() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={canvas}>
      <PageHeader title="Location & contact" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {/* Hero */}
        <View style={{ paddingHorizontal: S.gutter, paddingTop: 16 }}>
          <View style={styles.hero}>
            <Photo src="/images/resort/tower-snow-night.jpg" style={StyleSheet.absoluteFill} />
            <Scrim bottom={0.6} />
            <View style={{ flex: 1 }} />
            <View style={{ padding: 20 }}>
              <Text style={styles.heroKicker}>NATHIA GALI · 7,906 FT</Text>
              <Text style={styles.heroTitle}>Getting here</Text>
            </View>
          </View>
          <Text style={[T.body, { marginTop: 16 }]}>
            {PROPERTY.address}. Two hours from Islamabad, with direct access via the {ACCESS.join(', ')}.
          </Text>
          <Button label="Get directions" style={{ marginTop: 16 }} onPress={() => open(MAPS_LINK)} icon={<Ionicons name="navigate-outline" size={16} color={C.cream} />} />
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={T.eyebrow}>Contact</Text>
          <Text style={[T.h2, { marginTop: 4, marginBottom: 14 }]}>Talk to us</Text>
          <View style={styles.card}>
            {CONTACT.lines.map((l, i) => (
              <ContactRow key={l.label} first={i === 0} icon={l.icon} label={l.label} value={l.value} cta={l.cta} href={l.href} />
            ))}
            <ContactRow icon="location-outline" label="Resort" value={PROPERTY.address} cta="Open in Maps" href={MAPS_LINK} />
            <ContactRow icon="business-outline" label="Head office" value={HEAD_OFFICE} />
          </View>
          <View style={styles.facts}>
            <Fact icon="time-outline" k="Check-in" v={policy('Check-in').replace('From ', '')} />
            <Fact icon="exit-outline" k="Check-out" v={policy('Check-out').replace('Until ', '')} />
            <Fact icon="headset-outline" k="Front desk" v="24 / 7" />
          </View>
        </View>

        {/* Route */}
        <View style={styles.section}>
          <Text style={T.eyebrow}>The route</Text>
          <Text style={[T.h2, { marginTop: 4 }]}>Your journey up</Text>
          <Text style={[T.small, { marginTop: 3, marginBottom: 14 }]}>Distances by road to the resort.</Text>
          <View style={styles.card}>
            {ROUTE.map((d, i) => (
              <View key={d.place} style={[styles.stop, i > 0 && styles.rowLine]}>
                <Text style={styles.stopNum}>{pad(i + 1)}</Text>
                <Text style={styles.stopName} numberOfLines={2}>{d.place}</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.stopDist}>{d.distance}</Text>
                  {'drive' in d && d.drive ? <Text style={styles.stopDrive}>{d.drive}</Text> : null}
                </View>
              </View>
            ))}
            <View style={styles.arrive}>
              <Ionicons name="location-outline" size={18} color={C.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.arriveTitle}>Serene Heights</Text>
                <Text style={styles.arriveSub}>KALA BAGH AIR BASE ROAD · 7,906 FT</Text>
              </View>
            </View>
          </View>
          <View style={styles.mapCard}>
            <Photo src="/images/resort/tower-sunset-forest.jpg" style={styles.mapPhoto} />
            <View style={styles.mapBody}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <View style={styles.pin}>
                  <Ionicons name="location-outline" size={18} color={C.cream} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={T.h3}>Serene Heights</Text>
                  <Text style={[T.small, { marginTop: 2 }]}>{PROPERTY.address}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <Pressable onPress={() => open(MAPS_LINK)} accessibilityRole="link" accessibilityLabel="Get directions" style={({ pressed }) => [styles.mapBtn, styles.mapBtnPrimary, pressed && { opacity: 0.85 }]}>
                  <Ionicons name="navigate-outline" size={16} color={C.cream} />
                  <Text style={[styles.mapBtnText, { color: C.cream }]}>Directions</Text>
                </Pressable>
                <Pressable onPress={() => open(MAPS_LINK)} accessibilityRole="link" accessibilityLabel="Open the map" style={({ pressed }) => [styles.mapBtn, styles.mapBtnOutline, pressed && { opacity: 0.85 }]}>
                  <Ionicons name="map-outline" size={16} color={C.pine} />
                  <Text style={styles.mapBtnText}>Open map</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={T.eyebrow}>FAQ</Text>
          <Text style={[T.h2, { marginTop: 4 }]}>Good to know</Text>
          <Text style={[T.small, { marginTop: 3, marginBottom: 10 }]}>Quick answers before you travel. Anything else? Call or WhatsApp us any time.</Text>
          {FAQS.map((f, i) => (
            <Accordion key={f.q} first={i === 0} title={f.q}>
              <Text style={T.body}>{f.a}</Text>
            </Accordion>
          ))}
          <Button label="Check availability" style={{ marginTop: 22 }} onPress={() => router.navigate('/apartments')} icon={<Ionicons name="arrow-forward-outline" size={16} color={C.cream} />} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 230, borderRadius: S.card, overflow: 'hidden', backgroundColor: C.snow },
  heroKicker: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 10, letterSpacing: 2 },
  heroTitle: { color: C.cream, fontFamily: FONTS.display, fontSize: S.well, lineHeight: 40, marginTop: 4 },
  section: { paddingHorizontal: S.gutter, marginTop: 40 },
  card: { borderRadius: S.card, backgroundColor: C.pureWhite, paddingHorizontal: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...glassCard },
  row: { paddingVertical: 15 },
  rowLine: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  rowHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  well: { width: S.well, height: S.well, borderRadius: 18, backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' },
  label: { color: C.ink55, fontFamily: FONTS.uiBold, fontSize: 10, letterSpacing: 1.4 },
  value: { color: C.ink, fontFamily: FONTS.uiSemi, fontSize: 15.5, lineHeight: 22, marginTop: 10, fontVariant: ['tabular-nums'] },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, height: 32, borderRadius: 999, backgroundColor: C.snow },
  ctaText: { fontFamily: FONTS.uiBold, fontSize: 12, color: C.pine },
  facts: { flexDirection: 'row', gap: 10, marginTop: 14 },
  fact: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 14, borderRadius: 16, backgroundColor: C.snow, ...glassCard },
  factK: { fontFamily: FONTS.uiBold, fontSize: 9, letterSpacing: 1.3, color: C.ink55, marginTop: 2 },
  factV: { fontFamily: FONTS.display, fontSize: 18, color: C.ink, fontVariant: ['tabular-nums'] },
  stop: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  stopNum: { width: 22, color: C.ink40, fontFamily: FONTS.uiBold, fontSize: 11, letterSpacing: 1.1, fontVariant: ['tabular-nums'] },
  stopName: { flex: 1, fontFamily: FONTS.display, fontSize: 18, lineHeight: 21, color: C.ink },
  stopDist: { fontFamily: FONTS.uiBold, fontSize: 12.5, color: C.ink, fontVariant: ['tabular-nums'] },
  stopDrive: { fontFamily: FONTS.ui, fontSize: 11.5, color: C.ink55, marginTop: 1 },
  arrive: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: -14, paddingHorizontal: 14, paddingVertical: 16, backgroundColor: C.pine, borderBottomLeftRadius: S.card, borderBottomRightRadius: S.card },
  arriveTitle: { color: C.cream, fontFamily: FONTS.display, fontSize: 20 },
  arriveSub: { color: C.cream70, fontFamily: FONTS.uiBold, fontSize: 9.5, letterSpacing: 1.2, marginTop: 2 },
  mapCard: { marginTop: 16, borderRadius: S.card, overflow: 'hidden', backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...glassCard },
  mapPhoto: { width: '100%', aspectRatio: 16 / 10 },
  mapBody: { padding: 16 },
  pin: { width: S.well, height: S.well, borderRadius: 18, backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' },
  mapBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 48, borderRadius: 24 },
  mapBtnPrimary: { backgroundColor: C.pine },
  mapBtnOutline: { borderWidth: 1.5, borderColor: C.pine },
  mapBtnText: { fontFamily: FONTS.uiBold, fontSize: 13.5, color: C.pine },
});
