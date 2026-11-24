import { View } from 'react-native';

import { Caps } from '@/features/bookings/guest/components/ui';
import type { Tab } from '@/features/bookings/guest/state/booking';
import { C } from '@/features/bookings/guest/theme';

const MAP = {
  upcoming: { label: 'Confirmed', bg: C.pine, fg: C.sand },
  past: { label: 'Completed', bg: C.snow, fg: C.ink },
  cancelled: { label: 'Cancelled', bg: 'rgba(155,59,50,0.1)', fg: C.danger },
} as const;

export default function StatusPill({ tab }: { tab: Tab }) {
  const m = MAP[tab];
  return (
    <View style={{ backgroundColor: m.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
      <Caps color={m.fg} style={{ fontSize: 8.5 }}>{m.label}</Caps>
    </View>
  );
}
