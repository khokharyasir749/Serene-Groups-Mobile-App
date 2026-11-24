import { Image, type ImageStyle } from 'expo-image';
import { Check, ChevronLeft, Minus, Plus, X } from '@/features/bookings/guest/components/icons';
import { memo, useEffect, useRef, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, type GestureResponderEvent, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { Animated, Easing } from 'react-native';
import { EASE } from '@/features/bookings/guest/components/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { photo } from '@/features/bookings/guest/data/photos';
import { C, F, S, T } from '@/features/bookings/guest/theme';

// ── Text ─────────────────────────────────────────────────────────────────
export function Caps({ children, style, color }: { children: ReactNode; style?: StyleProp<TextStyle>; color?: string }) {
  return <Text style={[T.caps, color ? { color } : null, style]}>{children}</Text>;
}

export function Display({ children, size = 30, style, color, upper }: { children: ReactNode; size?: number; style?: StyleProp<TextStyle>; color?: string; upper?: boolean }) {
  return (
    <Text style={[T.display, { fontSize: size, lineHeight: Math.round(size * 1.12), letterSpacing: upper ? size * 0.06 : 0 }, upper && { textTransform: 'uppercase' }, color ? { color } : null, style]}>
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
  const bg = variant === 'primary' ? C.pine : variant === 'light' ? C.sand : 'transparent';
  const fg = variant === 'primary' ? C.sand : C.ink;
  return (
    <PressableScale onPress={onPress} disabled={disabled} style={[styles.btn, { backgroundColor: bg, borderColor: variant === 'secondary' ? C.lineStrong : bg }, style]}>
      {icon}
      <Caps color={fg} style={{ letterSpacing: 2.4 }}>{label}</Caps>
    </PressableScale>
  );
}

// ── Navigation chrome ────────────────────────────────────────────────────
export function BackBar({ onBack, title, right, light }: { onBack: () => void; title?: string; right?: ReactNode; light?: boolean }) {
  const insets = useSafeAreaInsets();
  const fg = light ? C.sand : C.ink;
  return (
    <View style={[styles.backBar, { paddingTop: insets.top + 6 }]}>
      <Pressable onPress={onBack} hitSlop={12} accessibilityLabel="Back" style={[styles.round, { width: 40, height: 40, borderRadius: 20, borderColor: light ? C.cream45 : 'rgba(255,255,255,0.7)', backgroundColor: light ? 'rgba(28,38,34,0.25)' : 'rgba(245,242,235,0.94)' }]}>
        <ChevronLeft size={18} color={fg} strokeWidth={1.5} />
      </Pressable>
      {title ? <Caps color={fg} style={{ flex: 1, textAlign: 'center' }}>{title}</Caps> : <View style={{ flex: 1 }} />}
      <View style={{ minWidth: 38, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

// ── Booking funnel progress ──────────────────────────────────────────────
const STEPS = ['Selection', 'Details', 'Confirmed'];
export function BookingSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < current || current === 3;
          const active = n === current;
          return (
            <View key={label} style={{ flex: n < 3 ? 1 : 0, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.step, done ? { backgroundColor: C.pine, borderColor: C.pine } : active ? { borderColor: C.ink } : { borderColor: C.line }]}>
                {done ? <Check size={13} color={C.sand} /> : <Text style={{ fontFamily: F.display, fontSize: 11, color: active ? C.ink : C.ink40 }}>0{n}</Text>}
              </View>
              {n < 3 && <View style={{ flex: 1, height: StyleSheet.hairlineWidth * 2, backgroundColor: done ? C.pine : C.line }} />}
            </View>
          );
        })}
      </View>
      <Caps color={C.ink55} style={{ fontSize: 9, marginTop: 10 }}>
        Step {current} of 3 · {STEPS[current - 1]}
      </Caps>
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

// ── Full-screen page that glides up (sort, cancel) ──────────────────────
export function Sheet({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(open);
  const p = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(p, { toValue: 1, duration: 420, easing: EASE, useNativeDriver: true }).start();
    } else if (mounted) {
      Animated.timing(p, { toValue: 0, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: true }).start();
      const t = setTimeout(() => setMounted(false), 270);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const backdrop = { opacity: p };
  const panel = { transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [1100, 0] }) }] };

  if (!mounted) return null;
  return (
    <Modal transparent visible statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: C.sand }, backdrop]} />
      <Animated.View style={[styles.sheet, { paddingTop: insets.top, paddingBottom: insets.bottom + 12 }, panel]}>
        <View style={styles.sheetHead}>
          <Caps>{title}</Caps>
          <Pressable onPress={onClose} hitSlop={12} style={[styles.round, { borderColor: C.line }]}>
            <X size={16} color={C.ink} strokeWidth={1.5} />
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>{children}</View>
        {footer && <View style={{ paddingHorizontal: S.gutter, paddingTop: 12 }}>{footer}</View>}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 22, borderWidth: 1, borderRadius: S.radius },
  backBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8 },
  round: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  step: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  stepBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.lineStrong, alignItems: 'center', justifyContent: 'center' },
  sheet: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: C.sand },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.gutter, paddingTop: 14, paddingBottom: 10 },
});
