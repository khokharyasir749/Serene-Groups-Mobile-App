import { X } from '@/features/bookings/guest/components/icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, S, T } from '@/features/bookings/guest/theme';

// Header for full-screen modals: a close button and a centred title.
export default function ModalHeader({ title, onClose, right }: { title: string; onClose: () => void; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close" style={styles.close}>
        <X size={18} color={C.ink} strokeWidth={1.75} />
      </Pressable>
      <Text style={[T.h3, styles.title]} numberOfLines={1}>{title}</Text>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.gutter - 4, paddingBottom: 12, backgroundColor: C.sand },
  close: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: C.white, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  title: { flex: 1, textAlign: 'center' },
  side: { width: 46, alignItems: 'flex-end' },
});
