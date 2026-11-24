import ClearGlass, { glassEdge, glassInk } from '@/features/bookings/guest/components/ClearGlass';
import { X } from '@/features/bookings/guest/components/icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Photo } from '@/features/bookings/guest/components/ui';
import { C, F } from '@/features/bookings/guest/theme';

// Paged hero gallery: swipe between photos, the active dot stretches, and a pull-down stretches the image.
export function HeroGallery({ photos, height }: { photos: string[]; height: number }) {
  const { width } = useWindowDimensions();
  const [open, setOpen] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  return (
    <View style={{ height, overflow: 'hidden', backgroundColor: C.snow, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}>
        {photos.map((src, i) => (
          <Pressable key={src} onPress={() => setOpen(i)}>
            <Photo src={src} contain={src.includes('floor-plans')} style={{ width, height, backgroundColor: src.includes('floor-plans') ? C.white : C.snow }} />
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.counter} pointerEvents="none">
        <ClearGlass />
        <Text style={{ ...glassInk, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }}>
          {page + 1} / {photos.length}
        </Text>
      </View>
      <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} />
    </View>
  );
}

export function Lightbox({ photos, index, onClose }: { photos: string[]; index: number | null; onClose: () => void }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  if (index == null) return null;
  return (
    <Modal visible animationType="fade" statusBarTranslucent onRequestClose={onClose} onShow={() => setPage(index)}>
      <View style={{ flex: 1, backgroundColor: C.pineDeep }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: index * width, y: 0 }}
          onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}>
          {photos.map((src) => (
            <View key={src} style={{ width, height, justifyContent: 'center' }}>
              <Photo src={src} contain style={{ width, height: height * 0.75, backgroundColor: 'transparent' }} />
            </View>
          ))}
        </ScrollView>
        <View style={[styles.lbBar, { top: insets.top + 8 }]}>
          <Text style={{ fontFamily: F.display, fontSize: 15, color: C.sand }}>
            {page + 1} / {photos.length}
          </Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.lbClose}>
            <X size={18} color={C.sand} strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  counter: { position: 'absolute', right: 16, bottom: 16, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 999, ...glassEdge },
  lbBar: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lbClose: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.cream45, alignItems: 'center', justifyContent: 'center' },
});
