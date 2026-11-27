import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingHeader } from '@/core/components/FloatingHeader';
import { PlateButton } from '@/core/components/PlateButton';
import { C } from '@/features/bookings/guest/theme';

/** Header for full-screen modals: the Serene Groups header with the title on the left and a close plate on the right. */
export default function ModalHeader({ title, onClose, right }: { title: string; onClose: () => void; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: C.sand }}>
      <FloatingHeader
        title={title}
        action={
          <>
            {right}
            <PlateButton icon="close-outline" label="Close" onPress={onClose} />
          </>
        }
      />
    </View>
  );
}
