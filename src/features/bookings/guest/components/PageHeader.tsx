import { useRouter } from '@/features/bookings/guest/lib/nav';
import { StatusBar } from 'expo-status-bar';
import { Keyboard, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingHeader } from '@/core/components/FloatingHeader';
import { C } from '@/features/bookings/guest/theme';

/** The header of the menu's sub-screens: the Serene Groups pushed-page header itself (back plate, serif title, action). */
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
    <View style={{ paddingTop: insets.top, backgroundColor: C.sand }}>
      <StatusBar style="dark" />
      <FloatingHeader title={title} onBack={handleBack} action={right} />
    </View>
  );
}
