import { Image, type ImageStyle } from 'expo-image';
import { Minus, Plus } from '@/features/bookings/guest/components/icons';
import { FloatingHeader } from '@/core/components/FloatingHeader';
import { PlateButton } from '@/core/components/PlateButton';
import { Sheet as SpringSheet, useDismiss } from '@/features/services/components/DeskSheet';
import { memo, useEffect, useRef, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, type GestureResponderEvent, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { photo } from '@/features/bookings/guest/data/photos';
import { C, F, FONTS, S, T } from '@/features/bookings/guest/theme';

// ── Text ─────────────────────────────────────────────────────────────────
export function Caps({ children, style, color }: { children: ReactNode; style?: StyleProp<TextStyle>; color?: string }) {
  return <Text style={[T.caps, color ? { color } : null, style]}>{children}</Text>;
}

export function Display({ children, size = 30, style, color, upper }: { children: ReactNode; size?: number; style?: StyleProp<TextStyle>; color?: string; upper?: boolean }) {
  return (
    <Text style={[T.display, { fontSize: size, lineHeight: Math.round(size * 1.12), letterSpacing: upper ? size * 0.06 : 0 }, upper && {  }, color ? { color } : null, style]}>
      {children}
    </Text>
  );
}

/** Small caps label followed by a hairline, the web's section opener. */
export function Label({ children, color = C.ink, style }: { children: ReactNode; color?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 14 }, style]}>
      <Caps color={color}>{children}</Caps>
      <View style={{ height: StyleSheet.hairlineWidth * 2, width: 44, backgroundColor: color, opacity: 0.35 }} />
    </View>
  );
}

export const Rule = ({ style }: { style?: StyleProp<ViewStyle> }) => <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: C.lineStrong }, style]} />;

// ── Media ────────────────────────────────────────────────────────────────
// Bundled photos via expo-image: cached in memory and on disk, recycled in lists, a short fade on first decode.
export const Photo = memo(function Photo({ src, style, contain }: { src: string; style?: StyleProp<ImageStyle>; contain?: boolean }) {
  return (
    <Image
      source={photo(src)}
      recyclingKey={src}
      cachePolicy="memory-disk"
      style={[{ backgroundColor: C.snow }, style]}
      contentFit={contain ? 'contain' : 'cover'}
      transition={150}
    />
  );
});

// ── Press feedback: a quiet scale, no glow ───────────────────────────────
// Layout props that must sit on the outer Pressable (so `flex`, `alignSelf` and margins work in a row or column).
const OUTER_KEYS = ['flex', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'width', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical'] as const;

export function PressableScale({
  children,
  onPress,
  style,
  disabled,
  scaleTo = 0.97,
  accessibilityRole,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress?: (event?: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  scaleTo?: number;
  accessibilityRole?: PressableProps['accessibilityRole'];
  accessibilityLabel?: string;
}) {
  const s = useRef(new Animated.Value(1)).current;
  const a = { transform: [{ scale: s }] };
  const flat = (StyleSheet.flatten(style) ?? {}) as Record<string, unknown>;
  const outer: Record<string, unknown> = {};
  const inner: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(flat)) ((OUTER_KEYS as readonly string[]).includes(k) ? outer : inner)[k] = v;
  if (outer.width !== undefined) inner.width = '100%';
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={outer as ViewStyle}
      onPressIn={() => Animated.timing(s, { toValue: scaleTo, duration: 120, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(s, { toValue: 1, damping: 18, stiffness: 260, useNativeDriver: true }).start()}>
      <Animated.View style={[inner as ViewStyle, a, disabled && { opacity: 0.45 }]}>{children}</Animated.View>
    </Pressable>
  );
}

export function Button({ label, onPress, variant = 'primary', icon, style, disabled }: { label: string; onPress?: () => void; variant?: 'primary' | 'secondary' | 'light'; icon?: ReactNode; style?: StyleProp<ViewStyle>; disabled?: boolean }) {
  const bg = variant === 'primary' ? C.pine : variant === 'light' ? C.goldBright : 'transparent';
  const fg = variant === 'primary' ? C.sand : C.pine;
  return (
    <PressableScale onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} style={[styles.btn, { backgroundColor: bg, borderColor: variant === 'secondary' ? C.lineStrong : bg }, style]}>
      {icon}
      <Text numberOfLines={1} maxFontSizeMultiplier={1.15} style={{ fontFamily: FONTS.uiBold, fontSize: 16, lineHeight: 22, color: fg }}>{label}</Text>
    </PressableScale>
  );
}

// ── Navigation chrome ────────────────────────────────────────────────────
export function BackBar({ onBack, title, right, light }: { onBack: () => void; title?: string; right?: ReactNode; light?: boolean }) {
  const insets = useSafeAreaInsets();
  const fg = light ? C.sand : C.ink;
  return (
    <View style={[styles.backBar, { paddingTop: insets.top + 8 }]}>
      <PlateButton glass={light} icon="arrow-back-outline" label="Back" onPress={onBack} />
      {title ? <Caps color={fg} style={{ flex: 1, textAlign: 'center' }}>{title}</Caps> : <View style={{ flex: 1 }} />}
      <View style={{ minWidth: 46, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

// ── Booking funnel progress ──────────────────────────────────────────────
const STEPS = ['Your rate', 'Your details', 'Confirmed'];
export function BookingSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <View accessible accessibilityLabel={`Step ${current} of 3, ${STEPS[current - 1]}`}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {STEPS.map((label, i) => (
          <View key={label} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < current ? C.pine : C.line }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
        {STEPS.map((label, i) => (
          <Text key={label} style={{ flex: 1, fontSize: 13, lineHeight: 18, fontFamily: i + 1 === current ? FONTS.uiBold : FONTS.ui, color: i < current ? C.ink : C.ink55 }}>{label}</Text>
        ))}
      </View>
    </View>
  );
}

// ── Guest stepper ────────────────────────────────────────────────────────
export function Stepper({ label, hint, value, min, max, onChange }: { label: string; hint?: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <View style={styles.stepperRow}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: F.display, fontSize: 19, color: C.ink }}>{label}</Text>
        {hint && <Text style={[T.small, { marginTop: 2 }]}>{hint}</Text>}
      </View>
      <PressableScale disabled={value <= min} onPress={() => onChange(value - 1)} style={styles.stepBtn}>
        <Minus size={16} color={C.ink} strokeWidth={1.5} />
      </PressableScale>
      <Text style={{ width: 40, textAlign: 'center', fontFamily: F.display, fontSize: 20, color: C.ink }}>{value}</Text>
      <PressableScale disabled={value >= max} onPress={() => onChange(value + 1)} style={styles.stepBtn}>
        <Plus size={16} color={C.ink} strokeWidth={1.5} />
      </PressableScale>
    </View>
  );
}

// ── Full-screen sheet (sort, cancel): rises on a spring, drags down by its handle or closes with ✕ ──
export function Sheet({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  // Stays mounted until it has slid away, however it was closed.
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  if (!mounted) return null;
  const gone = () => {
    setMounted(false);
    onClose();
  };
  return (
    <Modal transparent visible statusBarTranslucent animationType="none" onRequestClose={gone}>
      <SpringSheet onClosed={gone} handle="dark">
        <SheetBody open={open} title={title} footer={footer}>
          {children}
        </SheetBody>
      </SpringSheet>
    </Modal>
  );
}

function SheetBody({ open, title, children, footer }: { open: boolean; title: string; children: ReactNode; footer?: ReactNode }) {
  const insets = useSafeAreaInsets();
  const dismiss = useDismiss();
  useEffect(() => {
    if (!open) dismiss();
    // Only a change of `open` closes it; `dismiss` is stable in effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <View style={[styles.sheet, { paddingTop: insets.top + 22, paddingBottom: insets.bottom + 12 }]}>
      <FloatingHeader title={title} action={<PlateButton icon="close-outline" label="Close" onPress={dismiss} />} />
      <View style={{ flex: 1 }}>{children}</View>
      {footer && <View style={{ paddingHorizontal: S.gutter, paddingTop: 12 }}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 58, paddingVertical: 14, paddingHorizontal: 26, borderWidth: 1, borderRadius: 999 },
  backBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  stepBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  sheet: { flex: 1, backgroundColor: C.sand },
});
