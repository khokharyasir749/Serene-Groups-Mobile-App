import { ChevronDown } from '@/features/bookings/guest/components/icons';
import { memo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { Animated } from 'react-native';
import { Enter, useTurn } from '@/features/bookings/guest/components/motion';

import { C, T } from '@/features/bookings/guest/theme';

// Single-tap collapsible section: title + short summary; the chevron turns and the body fades in.
function Accordion({ title, summary, children, first }: { title: string; summary?: string; children: ReactNode; first?: boolean }) {
  const [open, setOpen] = useState(false);
  const chevron = useTurn(open, 200);

  const toggle = () => {
    setOpen((o) => !o);
  };

  return (
    <View style={[styles.wrap, first && { borderTopWidth: StyleSheet.hairlineWidth }]}>
      <Pressable onPress={toggle} style={styles.head} accessibilityRole="button" accessibilityState={{ expanded: open }}>
        <View style={{ flex: 1 }}>
          <Text style={T.h3}>{title}</Text>
          {summary && !open && (
            <Text style={[T.small, { marginTop: 2 }]} numberOfLines={1}>
              {summary}
            </Text>
          )}
        </View>
        <Animated.View style={[styles.chev, chevron]}>
          <ChevronDown size={18} color={C.ink} strokeWidth={1.75} />
        </Animated.View>
      </Pressable>
      {open && (
        <Enter duration={180} dy={0} style={{ paddingBottom: 20 }}>
          {children}
        </Enter>
      )}
    </View>
  );
}

export default memo(Accordion);

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: C.lineStrong },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 18 },
  chev: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
});