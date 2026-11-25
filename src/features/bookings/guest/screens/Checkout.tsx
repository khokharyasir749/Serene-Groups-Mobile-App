import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { Check, Lock } from '@/features/bookings/guest/components/icons';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View, type ScrollViewInstance, type TextInputProps } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PriceSummary from '@/features/bookings/guest/components/PriceSummary';
import { BackBar, BookingSteps, Button, Caps } from '@/features/bookings/guest/components/ui';
import { ARRIVAL_TIMES, ratePlan, roomType } from '@/features/bookings/guest/data/catalog';
import { availability, money, quote } from '@/features/bookings/guest/lib/stay';
import { useBooking, type Guest } from '@/features/bookings/guest/state/booking';
import { C, F, FONTS, S, T } from '@/features/bookings/guest/theme';
import { canvas, glassCard } from '@/features/bookings/guest/theme/glass';

type Errors = Partial<Record<keyof Guest | 'acceptTerms', string>>;

function validate(g: Guest, accept: boolean): Errors {
  const e: Errors = {};
  if (g.firstName.trim().length < 2) e.firstName = 'Enter your first name';
  if (g.lastName.trim().length < 2) e.lastName = 'Enter your last name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email.trim())) e.email = 'Enter a valid email address';
  if (g.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid mobile number';
  if (!accept) e.acceptTerms = 'Please accept the booking conditions';
  return e;
}

// Step 2 of the funnel, as on the web's /book: lead guest, payment, confirm, with the price summary.
export default function Checkout() {
  const { slug, rate } = useLocalSearchParams<{ slug: string; rate: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stay, guest: known, user, createBooking } = useBooking();
  const t = roomType(slug ?? '');
  const plan = ratePlan(rate ?? '');

  const [g, setG] = useState<Guest>(known);

  // After signing in from here, fill any empty fields from the account.
  useEffect(() => {
    if (!user) return;
    setG((cur) => ({
      ...cur,
      firstName: cur.firstName || user.firstName,
      lastName: cur.lastName || user.lastName,
      email: cur.email || user.email || '',
      phone: cur.phone || user.phone || '',
    }));
  }, [user]);
  const [arrival, setArrival] = useState(ARRIVAL_TIMES[0]);
  const [requests, setRequests] = useState('');
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const guestY = useRef(0);
  const confirmY = useRef(0);
  const shake = useRef(new Animated.Value(0)).current;
  const shakeStyle = { transform: [{ translateX: shake }] };

  if (!t || !plan) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: S.gutter }}>
        <Text style={{ fontFamily: F.display, fontSize: 24, color: C.ink }}>This rate isn’t available</Text>
        <Button label="Back to rates" style={{ marginTop: 20 }} onPress={() => router.back()} />
      </View>
    );
  }

  const q = quote(t, plan, stay);
  const av = availability(t, stay);
  const unavailable = av.soldOut || !av.fitsParty;
  const set = (k: keyof Guest) => (v: string) => {
    setG((cur) => ({ ...cur, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = () => {
    const e = validate(g, accept);
    setErrors(e);
    if (Object.keys(e).length) {
      const fieldError = Object.keys(e).some((k) => k !== 'acceptTerms');
      scrollRef.current?.scrollTo({ y: Math.max(0, (fieldError ? guestY.current : confirmY.current) - 90), animated: true });
      Animated.sequence([[-8, 50], [8, 70], [-5, 60], [0, 60]].map(([toValue, duration]) => Animated.timing(shake, { toValue, duration, useNativeDriver: true }))).start();
      return;
    }
    setSubmitting(true);
    // A short beat so the confirmation feels considered, not instant.
    setTimeout(() => {
      const b = createBooking({ slug: t.slug, code: plan.code, guest: g, arrivalTime: arrival !== ARRIVAL_TIMES[0] ? arrival : undefined, specialRequests: requests.trim() || undefined });
      if (router.canDismiss()) router.dismissAll();
      router.push({ pathname: '/booking/[ref]', params: { ref: b.reference, new: '1' } });
    }, 900);
  };

  return (
    <View style={canvas}>
      <View style={[styles.barBg, { height: insets.top + 56 }]} />
      <BackBar onBack={() => router.back()} title="" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 72, paddingBottom: 28, paddingHorizontal: S.gutter }}>
          <BookingSteps current={2} />
          <Text style={[T.h1, { marginTop: 26 }]} accessibilityRole="header">Almost there</Text>

          {!user && (
            <Pressable onPress={() => router.push({ pathname: '/login', params: { reason: 'booking' } })} style={styles.signin}>
              <View style={{ flex: 1 }}>
                <Text style={T.h3}>Have an account?</Text>
                <Text style={[T.small, { marginTop: 2 }]}>Sign in and we’ll fill in your details.</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.pine }}>Sign in</Text>
            </Pressable>
          )}

          <View style={{ marginTop: 20 }}>
            <PriceSummary stay={stay} roomName={t.name} plan={plan} q={q} />
          </View>

          {unavailable && (
            <View style={styles.warn}>
              <Text style={{ fontFamily: F.display, fontSize: 17, color: C.ink }}>No longer available</Text>
              <Text style={[T.small, { marginTop: 4 }]}>This apartment is sold out for your dates. Go back and choose another.</Text>
            </View>
          )}

          {/* 01 Lead guest */}
          <View onLayout={(e) => (guestY.current = e.nativeEvent.layout.y)} style={styles.card}>
            <Text style={styles.h3}>Lead guest details</Text>
            <Text style={[T.small, { marginTop: 4 }]}>The name must match the CNIC or passport shown at check-in.</Text>
            <View style={styles.formTop}>
              <Field label="First name" value={g.firstName} onChangeText={set('firstName')} error={errors.firstName} autoComplete="given-name" />
              <Field label="Last name" value={g.lastName} onChangeText={set('lastName')} error={errors.lastName} autoComplete="family-name" />
              <Field label="Email" hint="Your confirmation goes here" value={g.email} onChangeText={set('email')} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
              <Field label="Mobile number" hint="For WhatsApp updates from the front desk" value={g.phone} onChangeText={set('phone')} error={errors.phone} keyboardType="phone-pad" placeholder="+92 3xx xxxxxxx" />
              <Field label="Country of residence" value={g.country} onChangeText={set('country')} />
            </View>
            <Caps color={C.ink70} style={{ marginTop: 6 }}>Estimated arrival time</Caps>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 10 }}>
              {ARRIVAL_TIMES.map((a) => (
                <Pressable key={a} onPress={() => setArrival(a)} style={[styles.chip, arrival === a && styles.chipOn]}>
                  <Text style={{ fontSize: 14, color: arrival === a ? C.sand : C.ink70 }}>{a}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Field label="Special requests (optional)" hint="Subject to availability, e.g. high floor, extra bedding, celebration" value={requests} onChangeText={setRequests} multiline />
          </View>

          {/* 02 Payment */}
          <View style={styles.card}>
            <Text style={styles.h3}>How would you like to pay?</Text>
            <View style={[styles.pay, styles.payOn]}>
              <View style={styles.radio}><View style={styles.radioDot} /></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: F.display, fontSize: 17, color: C.ink }}>Pay at the property</Text>
                <Text style={[T.small, { marginTop: 2 }]}>Cash or card at check-in. Nothing is charged now.</Text>
              </View>
            </View>
            <View style={[styles.pay, { opacity: 0.5 }]}>
              <View style={styles.radio} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: F.display, fontSize: 17, color: C.ink }}>Card online</Text>
                <Text style={[T.small, { marginTop: 2 }]}>Coming soon</Text>
              </View>
            </View>
          </View>

          {/* 03 Confirm */}
          <Animated.View onLayout={(e) => { confirmY.current = e.nativeEvent.layout.y; }} style={[styles.card, shakeStyle]}>
            <Text style={styles.h3}>Confirm</Text>
            <Pressable onPress={() => { setAccept((a) => !a); setErrors((e) => ({ ...e, acceptTerms: undefined })); }} style={styles.terms}>
              <View style={[styles.box, accept && { backgroundColor: C.pine, borderColor: C.pine }]}>{accept && <Check size={13} color={C.sand} strokeWidth={2.5} />}</View>
              <Text style={[T.small, { flex: 1, color: C.ink70 }]}>
                I agree to the booking conditions: {plan.refundable ? `free cancellation until ${plan.freeCancelHours} hours before check-in` : 'this rate is non-refundable'}, and the house rules (check-in from 2:00 PM, check-out until 12:00 PM, valid ID required).
              </Text>
            </Pressable>
            {errors.acceptTerms && <Text style={styles.error}>{errors.acceptTerms}</Text>}
            {Object.keys(errors).some((k) => errors[k as keyof Errors]) && !errors.acceptTerms && <Text style={styles.error}>Please check the details above.</Text>}
            <Text style={[T.small, { marginTop: 14, fontSize: 13 }]}>No payment is taken now. You’ll pay at the property.</Text>
          </Animated.View>
        </ScrollView>
        <View style={[styles.bottom, { paddingBottom: insets.bottom + 12 }]}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: FONTS.uiBold, fontSize: 20, color: C.ink }}>{money(q.grandTotal)}</Text>
            <Text style={[T.small, { fontSize: 13 }]}>Total incl. taxes</Text>
          </View>
          <Button label={submitting ? 'Confirming…' : 'Confirm'} disabled={submitting || unavailable} onPress={submit} icon={<Lock size={14} color={C.sand} strokeWidth={1.75} />} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({ label, hint, error, multiline, ...rest }: TextInputProps & { label: string; hint?: string; error?: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <Caps color={C.ink70} style={{ marginBottom: 8, fontSize: 12.5 }}>{label}</Caps>
      <TextInput
        {...rest}
        multiline={multiline}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholderTextColor={C.ink40}
        style={[styles.input, multiline && { minHeight: 84, textAlignVertical: 'top' }, focus && { borderColor: C.pine }, error && { borderColor: C.danger }]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={[T.small, { fontSize: 13, marginTop: 5 }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  barBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 15, backgroundColor: C.sand },
  signin: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, padding: 16, borderRadius: S.card, backgroundColor: C.white, borderWidth: 1.5, borderColor: C.pine, ...glassCard },
  card: { backgroundColor: C.white, padding: 22, marginTop: 16, marginHorizontal: -8, borderRadius: 32, ...glassCard },
  h3: { fontFamily: F.display, fontSize: 29, lineHeight: 33, color: C.ink },
  formTop: { marginTop: 18, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  input: { fontFamily: FONTS.ui, borderWidth: 1, borderColor: C.lineStrong, paddingHorizontal: 14, minHeight: 56, paddingVertical: 14, fontSize: 16.5, color: C.ink, backgroundColor: C.sand, borderRadius: 18 },
  error: { color: C.danger, fontSize: 13, marginTop: 5 },
  chip: { height: 46, justifyContent: 'center', paddingHorizontal: 18, borderRadius: 999, borderWidth: 1, borderColor: C.lineStrong },
  chipOn: { backgroundColor: C.pine, borderColor: C.pine },
  pay: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 18, marginTop: 12, borderWidth: 1.5, borderColor: C.line, borderRadius: 22 },
  payOn: { borderColor: C.pine, backgroundColor: C.sand },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: C.ink55, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.pine },
  terms: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  box: { width: 26, height: 26, borderRadius: 9, borderWidth: 1.5, borderColor: C.ink55, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: S.gutter, paddingTop: 12, backgroundColor: C.sand, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  warn: { marginTop: 18, padding: 16, borderLeftWidth: 2, borderLeftColor: C.danger, backgroundColor: C.white },
});
