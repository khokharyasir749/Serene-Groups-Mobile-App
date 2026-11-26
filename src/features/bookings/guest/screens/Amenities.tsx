import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { memo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Animated } from 'react-native';
import { useTurn } from '@/features/bookings/guest/components/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Drawer from '@/features/bookings/guest/components/Drawer';
import { Lightbox } from '@/features/bookings/guest/components/Gallery';
import PageHeader from '@/features/bookings/guest/components/PageHeader';
import Scrim from '@/features/bookings/guest/components/Scrim';
import { Text } from '@/features/bookings/guest/components/Text';
import { Button, Photo } from '@/features/bookings/guest/components/ui';
import { AMENITIES, AMENITY_HIGHLIGHTS, AMENITY_ICON, GROUP_BLURB, type Amenity } from '@/features/bookings/guest/data/resort';
import { PROPERTY } from '@/features/bookings/guest/data/catalog';
import { C, FONTS, S, T } from '@/features/bookings/guest/theme';
import { canvas, glassCard, glassCardDark } from '@/features/bookings/guest/theme/glass';

const GROUPS = [...new Set(AMENITIES.map((a) => a.group))];

type Block = { id: string };
const BLOCKS: Block[] = [{ id: 'hero' }, { id: 'experiences' }, { id: 'groups' }, { id: 'gallery' }, { id: 'cta' }];

// Amenities, after the web's /amenities: the hero, signature experiences, facilities by group, gallery and a closing CTA.
export default function Amenities() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [lightbox, setLightbox] = useState<{ photos: string[]; i: number } | null>(null);

  const expPhotos = PROPERTY.experiences.map((e) => e.image);
  const galleryW = Math.round(width * 0.62);

  const render = ({ item }: { item: Block }) => {
    switch (item.id) {
      case 'hero':
        return (
          <View style={{ paddingHorizontal: S.gutter, paddingTop: 16 }}>
            <View style={styles.hero}>
              <Photo src="/images/resort/aerial-rooftop-pool.jpg" style={StyleSheet.absoluteFill} />
              <Scrim bottom={0.55} />
              <View style={{ flex: 1 }} />
              <View style={{ padding: 20 }}>
                <Text style={styles.heroKicker}>Amenities</Text>
                <Text style={styles.heroTitle}>50+ Resort Facilities</Text>
              </View>
            </View>
            <Text style={[T.body, { marginTop: 16 }]}>Everything for a winter escape or a summer retreat, without leaving the resort.</Text>
            <View style={styles.chips}>
              {AMENITY_HIGHLIGHTS.map((h) => (
                <View key={h} style={styles.chip}>
                  <Text style={styles.chipText}>{h}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 'experiences':
        return (
          <View style={{ marginTop: 40 }}>
            <Section label="Signature experiences" title="Life at 7,906 ft" />
            <View style={styles.grid}>
              {PROPERTY.experiences.map((e, i) => (
                <ExperienceTile key={e.image} index={i} title={e.title} image={e.image} onPress={() => setLightbox({ photos: expPhotos, i })} />
              ))}
            </View>
          </View>
        );
      case 'groups':
        return (
          <View style={{ marginTop: 40 }}>
            <Section label="Facilities by group" title="Everything on site" sub="From heated floors to a helping hand at 3 a.m." />
            <View style={{ paddingHorizontal: S.gutter }}>
              {GROUPS.map((g, gi) => (
                <GroupCard key={g} index={gi} group={g} defaultOpen={gi === 0} items={AMENITIES.filter((a) => a.group === g)} />
              ))}
            </View>
          </View>
        );
      case 'gallery':
        return (
          <View style={{ marginTop: 40 }}>
            <Section label="In pictures" title="Gallery" />
            <FlatList
              horizontal
              data={PROPERTY.gallery}
              keyExtractor={(g) => g}
              showsHorizontalScrollIndicator={false}
              snapToInterval={galleryW + 12}
              decelerationRate="fast"
              initialNumToRender={2}
              windowSize={3}
              contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 12 }}
              renderItem={({ item, index }) => (
                <Pressable onPress={() => setLightbox({ photos: PROPERTY.gallery, i: index })} accessibilityLabel={`Open photo ${index + 1}`}>
                  <Photo src={item} style={{ width: galleryW, height: galleryW, borderRadius: S.photo }} />
                </Pressable>
              )}
            />
          </View>
        );
      default:
        return (
          <View style={styles.cta}>
            <Text style={styles.ctaKicker}>Book your stay</Text>
            <Text style={styles.ctaTitle}>All of this, a lift ride from your apartment</Text>
            <Button label="Check availability" style={{ marginTop: 18 }} onPress={() => router.navigate('/apartments')} icon={<Ionicons name="arrow-forward-outline" size={16} color={C.cream} />} />
          </View>
        );
    }
  };

  return (
    <View style={canvas}>
      <PageHeader title="Amenities" />
      <FlatList data={BLOCKS} keyExtractor={(b) => b.id} renderItem={render} showsVerticalScrollIndicator={false} initialNumToRender={3} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} />
      <Lightbox photos={lightbox?.photos ?? []} index={lightbox?.i ?? null} onClose={() => setLightbox(null)} />
    </View>
  );
}

function Section({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <View style={{ paddingHorizontal: S.gutter, marginBottom: 16 }}>
      <Text style={T.eyebrow}>{label}</Text>
      <Text style={[T.h2, { marginTop: 4 }]}>{title}</Text>
      {sub && <Text style={[T.small, { marginTop: 3 }]}>{sub}</Text>}
    </View>
  );
}

const ExperienceTile = memo(function ExperienceTile({ index, title, image, onPress }: { index: number; title: string; image: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.tile} accessibilityLabel={`Open ${title}`}>
      <Photo src={image} style={styles.tileImg} />
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
        <Text style={styles.tileTitle} numberOfLines={2}>{title}</Text>
      </View>
    </Pressable>
  );
});

/** A facility group as a collapsible card: the header always shows; tapping it reveals the list beneath. */
const GroupCard = memo(function GroupCard({ index, group, items, defaultOpen }: { index: number; group: string; items: Amenity[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const chevron = useTurn(open, 280);
  return (
    <View style={[styles.group, open && styles.groupOpen]}>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.groupHead} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={`${group}, ${items.length} facilities`}>
        <View style={{ flex: 1 }}>
          <Text style={styles.groupTitle}>{group}</Text>
          <Text style={styles.groupSub} numberOfLines={2}>
            {GROUP_BLURB[group] ?? ''}
          </Text>
          <Text style={styles.groupCount}>{items.length} {items.length === 1 ? 'facility' : 'facilities'}</Text>
        </View>
        <Animated.View style={[styles.chev, open && styles.chevOpen, chevron]}>
          <Ionicons name="chevron-down" size={16} color={open ? C.cream : C.pine} />
        </Animated.View>
      </Pressable>

      <Drawer open={open}>
        <View style={styles.list}>
          {items.map((a, i) => (
            <View key={a.key} style={[styles.row, i > 0 && styles.rowLine]}>
              <View style={styles.rowIcon}>
                <Ionicons name={(AMENITY_ICON[a.key] ?? 'heart-outline') as never} size={16} color={C.pine} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName}>{a.name}</Text>
                {a.description && <Text style={styles.rowDesc}>{a.description}</Text>}
              </View>
            </View>
          ))}
        </View>
      </Drawer>
    </View>
  );
});

const styles = StyleSheet.create({
  hero: { height: 240, borderRadius: S.card, overflow: 'hidden', backgroundColor: C.snow },
  heroKicker: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 12.5, letterSpacing: 0 },
  heroTitle: { color: C.cream, fontFamily: FONTS.display, fontSize: 34, lineHeight: 38, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.lineStrong },
  chipText: { fontSize: 14, fontFamily: FONTS.uiSemi, color: C.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: S.gutter, gap: 14 },
  tile: { width: '47.5%', flexGrow: 1 },
  tileImg: { width: '100%', aspectRatio: 1, borderRadius: 18 },
  tileTitle: { flex: 1, fontFamily: FONTS.display, fontSize: 17, lineHeight: 20, color: C.ink },
  group: { marginBottom: 10, borderRadius: S.card, backgroundColor: C.white, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...glassCard },
  groupOpen: { borderColor: C.goldLine },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingHorizontal: 18 },
  groupTitle: { fontFamily: FONTS.display, fontSize: 23, lineHeight: 26, color: C.ink },
  groupSub: { fontFamily: FONTS.ui, fontSize: 14, color: C.ink55, marginTop: 2 },
  groupCount: { fontFamily: FONTS.uiBold, fontSize: 12, letterSpacing: 0, color: C.gold, marginTop: 6 },
  chev: { width: S.well, height: S.well, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.goldLine, backgroundColor: C.pureWhite },
  chevOpen: { backgroundColor: C.pine, borderColor: C.pine },
  list: { marginHorizontal: 18, paddingBottom: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.goldLine },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12 },
  rowLine: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  rowIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: C.sand, borderWidth: StyleSheet.hairlineWidth, borderColor: C.goldLine },
  rowName: { fontFamily: FONTS.uiSemi, fontSize: 14.5, color: C.ink, marginTop: 6 },
  rowDesc: { fontFamily: FONTS.ui, fontSize: 14, lineHeight: 18, color: C.ink55, marginTop: 2 },
  cta: { marginHorizontal: S.gutter, marginTop: 40, padding: 22, borderRadius: S.card, backgroundColor: C.pine, ...glassCardDark },
  ctaKicker: { color: C.gold, fontFamily: FONTS.uiBold, fontSize: 12.5, letterSpacing: 0 },
  ctaTitle: { color: C.cream, fontFamily: FONTS.display, fontSize: 27, lineHeight: 31, marginTop: 8 },
});

