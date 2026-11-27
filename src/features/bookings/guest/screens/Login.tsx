import Title from '@/features/bookings/guest/components/Title';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState, type ComponentProps } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions, type TextInputInstance, type TextInputProps } from 'react-native';
import { Enter } from '@/features/bookings/guest/components/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Scrim from '@/features/bookings/guest/components/Scrim';
import BrandLockup from '@/features/bookings/guest/components/BrandLockup';
import ClearGlass, { glassEdge, glassInk } from '@/features/bookings/guest/components/ClearGlass';
import { Text } from '@/features/bookings/guest/components/Text';
import { Photo } from '@/features/bookings/guest/components/ui';
import { useBooking } from '@/features/bookings/guest/state/booking';
import { C, FONTS, S, shadow, LOGO_TOP } from '@/features/bookings/guest/theme';
import { canvas, glassCard } from '@/features/bookings/guest/theme/glass';

type Method = 'phone' | 'email';
type Step = 'id' | 'code' | 'name';
type Glyph = ComponentProps<typeof Ionicons>['name'];

const PERKS: { icon: Glyph; k: string }[] = [
  { icon: 'shield-checkmark-outline', k: 'Free cancellation' },
  { icon: 'card-outline', k: 'Pay at property' },
  { icon: 'calendar-outline', k: 'Manage your trips' },
];

// Sign in (UI only, no backend): phone + one-time code, or email + password, then the guest's name.
// Browsing never needs it; checkout asks for it before confirming. `reason=booking` explains why.
//
// Layout: a clear daylight hero of the resort, and a rounded ivory sheet that rises over it and runs to the bottom
// edge — welcome, mode, fields, action, perks, guest option and trust line in one balanced column.
export default function Login() {
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const signIn = useBooking((s) => s.signIn);
  const [method, setMethod] = useState<Method>('phone');
  const [step, setStep] = useState<Step>('id');
  const [phone, setPhone] = useState(__DEV__ ? '3001234567' : ''); // sample values only while developing
  const [email, setEmail] = useState(__DEV__ ? 'guest@example.com' : '');
  const [password, setPassword] = useState(__DEV__ ? '12345678' : '');
  const [showPw, setShowPw] = useState(false);
  const [code, setCode] = useState(__DEV__ ? '123456' : '');
  const [first, setFirst] = useState(__DEV__ ? 'Ali' : '');
  const [last, setLast] = useState(__DEV__ ? 'Raza' : '');
  const [error, setError] = useState('');
  const codeRef = useRef<TextInputInstance>(null);

  const heroH = Math.min(320, Math.max(230, Math.round(height * 0.28)));
  const digits = phone.replace(/\D/g, '');
  const phoneOk = digits.length >= 10;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const shownPhone = `+92 ${digits.replace(/^92/, '').replace(/^0/, '')}`;

  const next = () => {
    setError('');
    if (step === 'id') {
      if (method === 'phone') {
        if (!phoneOk) return setError('Enter a valid mobile number');
        setStep('code');
        setTimeout(() => codeRef.current?.focus(), 300);
      } else {
        if (!emailOk) return setError('Enter a valid email address');
        if (password.length < 6) return setError('Password must be at least 6 characters');
        setStep('name');
      }
    } else if (step === 'code') {
      if (code.length !== 6) return setError('Enter the 6-digit code');
      setStep('name');
    } else {
      if (first.trim().length < 2 || last.trim().length < 2) return setError('Enter your first and last name');
      signIn({ firstName: first.trim(), lastName: last.trim(), phone: method === 'phone' ? shownPhone : undefined, email: method === 'email' ? email.trim() : undefined });
      router.back();
    }
  };

  const back = () => {
    setError('');
    setStep(step === 'name' && method === 'phone' ? 'code' : 'id');
  };

  const checkout = reason === 'booking';
  const heading = step === 'id' ? (checkout ? 'One step from your stay.' : 'Welcome to the heights.') : step === 'code' ? 'Check your messages.' : 'How should we greet you?';
  const lede =
    step === 'id'
      ? checkout
        ? 'Sign in and we’ll fill in your details.'
        : 'Sign in to keep every stay in one place.'
      : step === 'code'
        ? `Code sent to ${shownPhone} · demo: any 6 digits`
        : 'As it appears on your CNIC or passport.';
  const cta = step === 'id' ? (method === 'phone' ? 'Send code' : 'Sign in') : step === 'code' ? 'Verify & continue' : 'Continue';

  return (
    <View style={canvas}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
          {/* Hero: a clear daylight render, only a light neutral scrim under the logo */}
          <View style={{ height: heroH + S.well }}>
            <Photo src="/images/resort/tower-day.jpg" style={StyleSheet.absoluteFill} />
            <Scrim top={0.5} bottom={0.22} />

            <View style={[styles.topBar, { top: insets.top + LOGO_TOP }]}>
              <BrandLockup onPhoto />
              <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close" style={styles.close}>
                <ClearGlass />
                <Ionicons name="close-outline" size={22} style={glassInk} />
              </Pressable>
            </View>

            <View pointerEvents="none" style={styles.place}>
              <View style={styles.glass}>
                <ClearGlass />
                <Ionicons name="location-outline" size={15} style={glassInk} />
                <Text style={styles.glassText}>Serene Heights · Nathia Gali</Text>
              </View>
              <Text style={styles.altitude}>7,906 ft</Text>
            </View>
          </View>

          {/* The sheet rises over the photo and runs to the bottom edge */}
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 22 }]}>
            <View style={{ flexGrow: 1 }}>
              <Enter key={`h-${step}`} duration={420}>
                <View style={styles.eyebrowRow}>
                  {step !== 'id' ? (
                    <Pressable onPress={back} hitSlop={10} style={styles.backLink} accessibilityRole="button" accessibilityLabel="Back">
                      <Ionicons name="chevron-back-outline" size={16} color={C.pine} />
                      <Text style={styles.backText}>Back</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.eyebrowWrap}>
                      <View style={styles.rule} />
                      <Text style={styles.eyebrow}>Serene Bookings</Text>
                    </View>
                  )}
                </View>
                <Title style={styles.heading}>{heading}</Title>
                <Text style={styles.lede}>{lede}</Text>
              </Enter>

              <Enter key={`c-${step}`} delay={50} duration={420} style={{ marginTop: 22, gap: 12 }}>
                {step === 'id' && (
                  <>
                    <View style={styles.modes}>
                      <ModePill icon="call-outline" label="Phone" on={method === 'phone'} onPress={() => { setMethod('phone'); setError(''); }} />
                      <ModePill icon="mail-outline" label="Email" on={method === 'email'} onPress={() => { setMethod('email'); setError(''); }} />
                    </View>
                    {method === 'phone' ? (
                      <Field icon="call-outline" label="Mobile number" prefix="+92" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="3xx xxxxxxx" autoComplete="tel" />
                    ) : (
                      <>
                        <Field icon="mail-outline" label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" placeholder="you@example.com" />
                        <Field
                          icon="lock-closed-outline"
                          label="Password"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPw}
                          autoComplete="password"
                          placeholder="At least 6 characters"
                          right={
                            <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={10} accessibilityLabel={showPw ? 'Hide password' : 'Show password'}>
                              <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={C.ink55} />
                            </Pressable>
                          }
                        />
                      </>
                    )}
                  </>
                )}

                {step === 'code' && (
                  <View>
                    <Pressable onPress={() => codeRef.current?.focus()} style={styles.otp} accessibilityLabel="Verification code">
                      {Array.from({ length: 6 }).map((_, i) => {
                        const ch = code[i];
                        const active = i === Math.min(code.length, 5);
                        return (
                          <View key={i} style={[styles.otpBox, active && styles.otpActive]}>
                            <Text style={styles.otpText}>{ch ?? ''}</Text>
                          </View>
                        );
                      })}
                    </Pressable>
                    <TextInput ref={codeRef} value={code} onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" autoComplete="sms-otp" textContentType="oneTimeCode" maxLength={6} style={styles.hidden} />
                    <Pressable onPress={() => setCode('')} hitSlop={8} style={{ alignSelf: 'flex-start', marginTop: 14 }}>
                      <Text style={styles.link}>Resend code</Text>
                    </Pressable>
                  </View>
                )}

                {step === 'name' && (
                  <>
                    <Field icon="person-outline" label="First name" value={first} onChangeText={setFirst} autoComplete="given-name" autoFocus />
                    <Field icon="person-outline" label="Last name" value={last} onChangeText={setLast} autoComplete="family-name" />
                  </>
                )}

                {!!error && (
                  <View style={styles.error}>
                    <Ionicons name="alert-circle-outline" size={16} color={C.danger} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <Pressable onPress={next} accessibilityRole="button" accessibilityLabel={cta} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}>
                  <Text style={styles.ctaText}>{cta}</Text>
                  <View style={styles.badge}>
                    <Ionicons name="arrow-forward-outline" size={20} color={C.pine} />
                  </View>
                </Pressable>
              </Enter>

              {step === 'id' && height >= 740 && (
                <View style={styles.perks}>
                  {PERKS.map((p, i) => (
                    <View key={p.k} style={[styles.perk, i > 0 && styles.perkLine]}>
                      <Ionicons name={p.icon} size={19} color={C.pine} />
                      <Text style={styles.perkText}>{p.k}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Guest-first footer, pinned to the bottom of the sheet */}
            <View style={styles.footer}>
              {step === 'id' && (
                <Pressable onPress={() => router.back()} hitSlop={10}>
                  <Text style={styles.guest}>{checkout ? 'Not now' : 'Continue as guest'}</Text>
                </Pressable>
              )}
              <View style={styles.trust}>
                <Ionicons name="shield-checkmark-outline" size={15} color={C.ink55} />
                <Text style={styles.trustText}>Private & secure · We never share your details</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ModePill({ icon, label, on, onPress }: { icon: Glyph; label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} style={[styles.mode, on ? styles.modeOn : styles.modeOff]}>
      <Ionicons name={icon} size={17} color={on ? C.pine : C.ink55} />
      <Text style={[styles.modeText, on && { color: C.ink }]} numberOfLines={1}>{label}</Text>
      <View style={[styles.check, on && styles.checkOn]}>{on && <Ionicons name="checkmark-outline" size={13} color={C.cream} />}</View>
    </Pressable>
  );
}

function Field({ icon, label, prefix, right, ...rest }: TextInputProps & { icon: Glyph; label: string; prefix?: string; right?: React.ReactNode }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={[styles.field, focus && styles.fieldFocus]}>
      <Ionicons name={icon} size={20} color={focus ? C.pine : C.ink55} />
      <View style={{ flex: 1 }}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {prefix && <Text style={styles.prefix}>{prefix}</Text>}
          <TextInput {...rest} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholderTextColor={C.ink40} style={styles.inputText} />
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { position: 'absolute', left: S.gutter, right: S.gutter, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', ...glassEdge },
  place: { position: 'absolute', left: S.gutter, right: S.gutter, bottom: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  glass: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, height: S.well, borderRadius: 18, ...glassEdge },
  glassText: { ...glassInk, fontFamily: FONTS.uiSemi, fontSize: 14 },
  altitude: { color: 'rgba(255,255,255,0.9)', fontFamily: FONTS.uiBold, fontSize: 12.5, letterSpacing: 0 },
  sheet: { flexGrow: 1, marginTop: -S.well, paddingTop: 26, paddingHorizontal: S.gutter + 2, borderTopLeftRadius: 34, borderTopRightRadius: 34, backgroundColor: C.sand },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, minHeight: 24 },
  eyebrowWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rule: { width: 22, height: 2, borderRadius: 1, backgroundColor: C.gold },
  eyebrow: { color: C.ink55, fontFamily: FONTS.uiBold, fontSize: 12.5, letterSpacing: 0 },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 4 },
  backText: { fontFamily: FONTS.uiBold, fontSize: 14, color: C.pine },
  heading: { color: C.ink, fontFamily: FONTS.display, fontSize: 39, lineHeight: 43 },
  lede: { color: C.ink55, fontFamily: FONTS.ui, fontSize: 14.5, lineHeight: 21, marginTop: 6 },
  modes: { flexDirection: 'row', gap: 10 },
  mode: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 56, paddingHorizontal: 14, borderRadius: 16 },
  modeOn: { backgroundColor: C.pureWhite, borderWidth: 1.5, borderColor: C.pine, ...shadow.card },
  modeOff: { backgroundColor: C.snow, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  modeText: { flex: 1, fontFamily: FONTS.uiSemi, fontSize: 14, color: C.ink55 },
  check: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.lineStrong },
  checkOn: { backgroundColor: C.pine, borderColor: C.pine },
  field: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, backgroundColor: C.pureWhite, borderWidth: 1, borderColor: C.line, ...shadow.card },
  fieldFocus: { borderColor: C.pine, borderWidth: 1.5 },
  fieldLabel: { color: C.ink55, fontFamily: FONTS.uiBold, fontSize: 12, letterSpacing: 0 },
  inputText: { flex: 1, paddingVertical: 2, fontFamily: FONTS.uiSemi, fontSize: 17, color: C.ink },
  prefix: { fontFamily: FONTS.uiSemi, fontSize: 17, color: C.ink, paddingRight: 10, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: C.lineStrong },
  otp: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  otpBox: { flex: 1, height: 62, borderRadius: 16, backgroundColor: C.pureWhite, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line, ...shadow.card },
  otpActive: { borderColor: C.pine, borderWidth: 1.5 },
  otpText: { fontFamily: FONTS.uiBold, fontSize: 24, color: C.ink, fontVariant: ['tabular-nums'] },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  link: { fontFamily: FONTS.uiBold, fontSize: 14, color: C.pine },
  error: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 14, backgroundColor: 'rgba(180, 35, 24, 0.07)' },
  errorText: { flex: 1, color: C.danger, fontFamily: FONTS.uiMedium, fontSize: 14 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 62, marginTop: 6, paddingLeft: 26, paddingRight: 9, borderRadius: 31, backgroundColor: C.pine, ...shadow.card, shadowOpacity: 0.2, shadowRadius: 14, elevation: 4 },
  ctaText: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 17 },
  badge: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  perks: { flexDirection: 'row', marginTop: 18, paddingVertical: 14, borderRadius: 18, backgroundColor: C.snow, ...glassCard },
  perk: { flex: 1, alignItems: 'center', gap: 6, paddingHorizontal: 6 },
  perkLine: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: C.lineStrong },
  perkText: { fontFamily: FONTS.uiSemi, fontSize: 13, color: C.ink, textAlign: 'center' },
  footer: { alignItems: 'center', gap: 14, marginTop: 20, paddingTop: 2 },
  guest: { fontFamily: FONTS.uiSemi, fontSize: 14.5, color: C.ink, textDecorationLine: 'underline' },
  trust: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  trustText: { fontFamily: FONTS.ui, fontSize: 13, color: C.ink55 },
});
