import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { StatusBar } from 'expo-status-bar';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/features/bookings/guest/components/Text';
import { C, FONTS, S } from '@/features/bookings/guest/theme';

/** Sticky top bar for the menu's sub-screens: a back button, a centred serif title and an optional right action. */
export default function PageHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    Keyboard.dismiss();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <StatusBar style="dark" />
      <Pressable onPress={handleBack} hitSlop={12} accessibilityLabel="Back" style={styles.round}>
        <Ionicons name="chevron-back-outline" size={20} color={C.ink} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.gutter - 4, paddingBottom: 10, backgroundColor: C.sand, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  round: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.pureWhite, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  title: { flex: 1, textAlign: 'center', fontFamily: FONTS.display, fontSize: 21, color: C.ink },
  side: { width: 40, alignItems: 'flex-end' },
});
