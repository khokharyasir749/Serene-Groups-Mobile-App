import Title from '@/features/bookings/guest/components/Title';
import { HEX, pine } from '@/features/bookings/guest/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Lightbox } from '@/features/bookings/guest/components/Gallery';
import PageHeader from '@/features/bookings/guest/components/PageHeader';
import { Text } from '@/features/bookings/guest/components/Text';
import { Button, Photo } from '@/features/bookings/guest/components/ui';
import { APARTMENTS, apartmentsOf, areaRangeOf, ROOM_TYPES, type RoomType } from '@/features/bookings/guest/data/catalog';
import { FLOORS } from '@/features/bookings/guest/data/resort';
import { money } from '@/features/bookings/guest/lib/stay';
import { C, FONTS, S, T } from '@/features/bookings/guest/theme';
import { canvas, glassCard } from '@/features/bookings/guest/theme/glass';

const pad = (n: number) => String(n).padStart(2, '0');
const areas = APARTMENTS.map((a) => a.areaSqft).filter((a): a is number => a != null);
const FACTS = [
  { k: 'Apartments', v: String(APARTMENTS.length) },
  { k: 'Floor plans', v: String(FLOORS.length) },
  { k: 'Sq ft', v: `${Math.min(...areas)}–${Math.max(...areas)}` },
];
const PLANS = FLOORS.map((f) => f.plan);
const planOf = (t: RoomType) => t.images.find((i) => i.includes('floor-plans'));

type Block = { id: string };
const BLOCKS: Block[] = [{ id: 'intro' }, { id: 'floors' }, { id: 'types' }];

// Floor plans, after the web's /floor-plans: browse the building floor by floor, then each bookable layout's plan and specs.
export default function FloorPlans() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [floorKey, setFloorKey] = useState('1');
  const [zoom, setZoom] = useState<{ photos: string[]; i: number } | null>(null);

  const idx = Math.max(0, FLOORS.findIndex((f) => f.key === floorKey));
  const floor = FLOORS[idx];
  const typePlans = useMemo(() => ROOM_TYPES.map(planOf).filter((p): p is string => !!p), []);

  const render = ({ item }: { item: Block }) => {
    if (item.id === 'intro') {
      return (
        <View style={{ paddingHorizontal: S.gutter, paddingTop: 16 }}>
          <Text style={T.eyebrow}>Floor plans</Text>
          <Title style={[T.h1, { marginTop: 4 }]}>Find your apartment</Title>
          <Text style={[T.body, { marginTop: 8 }]}>
            {APARTMENTS.length} one-bedroom apartments across the G1 to 8th floors, each with a bedroom, sitting room with kitchenette, bathroom and a balcony or terrace.
          </Text>
          <View style={styles.facts}>
            {FACTS.map((f, i) => (
              <View key={f.k} style={[styles.fact, i > 0 && styles.factLine]}>
                <Text style={styles.factV}>{f.v}</Text>
                <Text style={styles.factK}>{f.k}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    if (item.id === 'floors') {
      return (
        <View style={{ marginTop: 28 }}>
          <View style={{ paddingHorizontal: S.gutter }}>
            <Text style={T.eyebrow}>By floor</Text>
            <Title style={[T.h2, { marginTop: 4 }]}>{floor.label}</Title>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
            {FLOORS.map((f) => {
              const on = f.key === floor.key;
              return (
                <Pressable key={f.key} onPress={() => setFloorKey(f.key)} style={[styles.tab, on && styles.tabOn]} accessibilityRole="tab" accessibilityState={{ selected: on }}>
                  <Text style={[styles.tabText, on && { color: C.cream }]}>{f.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={{ paddingHorizontal: S.gutter, marginTop: 14 }}>
            <Pressable onPress={() => setZoom({ photos: PLANS, i: idx })} style={styles.planCard} accessibilityLabel={`Enlarge ${floor.label} plan`}>
              <Photo src={floor.plan} contain style={styles.plan} />
              <View style={styles.zoom}>
                <Ionicons name="expand-outline" size={14} color={C.cream} />
                <Text style={styles.zoomText}>Enlarge</Text>
              </View>
            </Pressable>
            <Text style={[T.small, { marginTop: 12, color: C.ink70 }]}>{floor.summary}</Text>
            <View style={styles.legend}>
              <Legend swatch={HEX.star} text="Yellow outlines mark each apartment, with its number in a yellow circle." />
              <Legend swatch={C.pine} text="Apartment floors include a table of apartment numbers and areas in sq ft." />
            </View>
            <View style={styles.pager}>
              <Pressable disabled={idx === 0} onPress={() => setFloorKey(FLOORS[idx - 1].key)} style={[styles.pagerBtn, idx === 0 && { opacity: 0.35 }]} accessibilityLabel="Previous floor">
                <Ionicons name="arrow-back-outline" size={16} color={C.ink} />
                <Text style={styles.pagerText} numberOfLines={1}>{idx > 0 ? FLOORS[idx - 1].label : 'Previous'}</Text>
              </Pressable>
              <Text style={styles.pagerCount}>{pad(idx + 1)} / {pad(FLOORS.length)}</Text>
              <Pressable disabled={idx === FLOORS.length - 1} onPress={() => setFloorKey(FLOORS[idx + 1].key)} style={[styles.pagerBtn, { justifyContent: 'flex-end' }, idx === FLOORS.length - 1 && { opacity: 0.35 }]} accessibilityLabel="Next floor">
                <Text style={styles.pagerText} numberOfLines={1}>{idx < FLOORS.length - 1 ? FLOORS[idx + 1].label : 'Next'}</Text>
                <Ionicons name="arrow-forward-outline" size={16} color={C.ink} />
              </Pressable>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={{ marginTop: S.well, paddingHorizontal: S.gutter }}>
        <Text style={T.eyebrow}>Bookable layouts</Text>
        <Title style={[T.h2, { marginTop: 4 }]}>Apartment types</Title>
        <Text style={[T.small, { marginTop: 3, marginBottom: 14 }]}>Every layout on these plans is one of five bookable types.</Text>
        {ROOM_TYPES.map((t, i) => (
          <TypeCard
            key={t.slug}
            index={i}
            type={t}
            onPlan={() => {
              const p = planOf(t);
              if (p) setZoom({ photos: typePlans, i: Math.max(0, typePlans.indexOf(p)) });
            }}
            onOpen={() => router.push(`/room/${t.slug}`)}
          />
        ))}
        <Button label="Check availability" style={{ marginTop: 6 }} onPress={() => router.navigate('/apartments')} icon={<Ionicons name="arrow-forward-outline" size={16} color={C.cream} />} />
      </View>
    );
  };

  return (
    <View style={canvas}>
      <PageHeader title="Floor plans" />
      <FlatList data={BLOCKS} keyExtractor={(b) => b.id} renderItem={render} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} />
      <Lightbox photos={zoom?.photos ?? []} index={zoom?.i ?? null} onClose={() => setZoom(null)} />
    </View>
  );
}

function Legend({ swatch, text }: { swatch: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <View style={[styles.swatch, { backgroundColor: swatch }]} />
      <Text style={[T.small, { flex: 1 }]}>{text}</Text>
    </View>
  );
}

function TypeCard({ index, type, onPlan, onOpen }: { index: number; type: RoomType; onPlan: () => void; onOpen: () => void }) {
  const plan = planOf(type);
  const floors = [...new Set(apartmentsOf(type.slug).map((a) => a.floorLabel))];
  const specs = [
    { icon: 'resize-outline', text: areaRangeOf(type.slug) },
    { icon: 'bed-outline', text: type.bedType },
    { icon: 'leaf-outline', text: type.outdoorSpace },
    { icon: 'people-outline', text: `Sleeps up to ${type.maxOccupancy}` },
    { icon: 'business-outline', text: `${apartmentsOf(type.slug).length} apartments · ${floors.length} floors` },
  ];
  return (
    <View style={styles.type}>
      {plan && (
        <Pressable onPress={onPlan} accessibilityLabel={`Enlarge ${type.name} floor plan`}>
          <Photo src={plan} contain style={styles.typePlan} />
        </Pressable>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
        <Text style={styles.tileNum}>{pad(index + 1)}</Text>
        <Text style={[T.h3, { flex: 1 }]}>{type.name}</Text>
      </View>
      <View style={{ marginTop: 8, gap: 6 }}>
        {specs.map((s) => (
          <View key={s.text} style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Ionicons name={s.icon as never} size={15} color={C.ink55} />
            <Text style={[T.small, { color: C.ink70, flex: 1 }]}>{s.text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.typeFoot}>
        <Text style={styles.price}>
          {money(type.baseRate)}
          <Text style={styles.per}> / night</Text>
        </Text>
        <Pressable onPress={onOpen} hitSlop={8} style={styles.view} accessibilityRole="button">
          <Text style={styles.viewText}>View apartment</Text>
          <Ionicons name="chevron-forward-outline" size={14} color={C.pine} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  facts: { flexDirection: 'row', marginTop: 16, paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: C.lineStrong },
  fact: { flex: 1, alignItems: 'center' },
  factLine: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: C.lineStrong },
  factV: { fontFamily: FONTS.display, fontSize: 24, color: C.ink, fontVariant: ['tabular-nums'] },
  factK: { fontFamily: FONTS.uiBold, fontSize: 12, letterSpacing: 0, color: C.ink55, marginTop: 3 },
  tabs: { paddingHorizontal: S.gutter, gap: 8, marginTop: 14 },
  tab: { paddingHorizontal: 14, height: S.well, borderRadius: 999, justifyContent: 'center', backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.lineStrong },
  tabOn: { backgroundColor: C.pine, borderColor: C.pine },
  tabText: { fontFamily: FONTS.uiSemi, fontSize: 14, color: C.ink },
  planCard: { borderRadius: S.card, backgroundColor: HEX.white, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, overflow: 'hidden', ...glassCard },
  plan: { width: '100%', aspectRatio: 3 / 2, backgroundColor: HEX.white },
  zoom: { position: 'absolute', right: 10, top: 10, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: pine(0.82) },
  zoomText: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 12.5 },
  legend: { gap: 8, marginTop: 14, padding: 14, borderRadius: 14, backgroundColor: C.snow, ...glassCard },
  swatch: { width: 11, height: 11, borderRadius: 3, marginTop: 3 },
  pager: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.lineStrong },
  pagerBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  pagerText: { flexShrink: 1, fontFamily: FONTS.uiSemi, fontSize: 14, color: C.ink },
  pagerCount: { fontFamily: FONTS.uiBold, fontSize: 12.5, letterSpacing: 0, color: C.ink55, fontVariant: ['tabular-nums'], paddingHorizontal: 8 },
  tileNum: { color: C.ink40, fontFamily: FONTS.uiBold, fontSize: 12.5, letterSpacing: 0, fontVariant: ['tabular-nums'] },
  type: { padding: 16, marginBottom: 14, borderRadius: S.card, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...glassCard },
  typePlan: { width: '100%', aspectRatio: 3 / 2, borderRadius: 14, backgroundColor: HEX.white, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  typeFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  price: { fontFamily: FONTS.uiBold, fontSize: 16, color: C.ink, fontVariant: ['tabular-nums'] },
  per: { fontFamily: FONTS.ui, fontSize: 14, color: C.ink55 },
  view: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewText: { fontFamily: FONTS.uiBold, fontSize: 14, color: C.pine },
});
