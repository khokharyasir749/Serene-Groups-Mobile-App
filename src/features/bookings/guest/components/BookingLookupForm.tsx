import { HEX, pine } from '@/features/bookings/guest/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/features/bookings/guest/components/Text';
import { normalizeRef, useBooking, type Booking } from '@/features/bookings/guest/state/booking';
import { C, FONTS } from '@/features/bookings/guest/theme';

type Tone = 'light' | 'dark';

/**
 * Reference + email lookup, as on the web's /manage — "No account needed". It never checks sign-in: it searches the
 * bookings by reference and the email they were made with. `onFound` receives the match.
 */
export default function BookingLookupForm({
  onFound,
  tone = 'light',
  onFocusField,
  hideNote,
}: {
  onFound: (b: Booking) => void;
  tone?: Tone;
  onFocusField?: () => void;
  hideNote?: boolean;
}) {
  const { findBooking } = useBooking();
  const [reference, setReference] = useState('SH-4QK8TW');
  const [email, setEmail] = useState('guest@example.com');
  const [error, setError] = useState('');
  const [focus, setFocus] = useState<'ref' | 'email' | null>(null);
  const dark = tone === 'dark';

  const submit = () => {
    setError('');
    const ref = normalizeRef(reference);
    if (!/^SH-[A-Z0-9]{6}$/.test(ref)) return setError('Your reference looks like SH-XXXXXX');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter the email used to book');
    const b = findBooking(ref, email);
    if (!b) return setError('We couldn’t find a booking with those details. Check the reference and email, then try again.');
    onFound(b);
  };

  const placeholder = dark ? 'rgba(236, 238, 237, 0.4)' : C.ink40;

  return (
    <View style={styles.container}>
      {!hideNote && (
        <Text style={[styles.note, dark && { color: C.cream70 }]}>
          No account needed — use your booking reference and the email you booked with.
        </Text>
      )}

      {/* Booking Reference Field */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, dark && { color: C.cream70 }]}>BOOKING REFERENCE</Text>
          <Text style={[styles.labelHint, dark && { color: C.cream45 }]}>Format: SH-XXXXXX</Text>
        </View>
        <View
          style={[
            styles.inputBox,
            dark && styles.inputBoxDark,
            focus === 'ref' && (dark ? styles.inputBoxFocusDark : styles.inputBoxFocus),
          ]}
        >
          <View style={styles.inputIcon}>
            <Ionicons
              name="bookmark-outline"
              size={17}
              color={focus === 'ref' ? (dark ? C.gold : C.pine) : dark ? C.cream45 : C.ink40}
            />
          </View>
          <TextInput
            value={reference}
            onChangeText={(v) => {
              setError('');
              setReference(v.toUpperCase());
            }}
            onFocus={() => {
              setFocus('ref');
              onFocusField?.();
            }}
            onBlur={() => setFocus(null)}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="next"
            placeholder="e.g. SH-4QK8TW"
            placeholderTextColor={placeholder}
            style={[styles.input, dark && styles.inputDark, { letterSpacing: 1.5 }]}
          />
          {reference.length > 0 && (
            <Pressable onPress={() => setReference('')} hitSlop={8} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={16} color={dark ? C.cream45 : C.ink40} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Email Address Field */}
      <View style={styles.fieldGroup}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, dark && { color: C.cream70 }]}>GUEST EMAIL ADDRESS</Text>
          <Text style={[styles.labelHint, dark && { color: C.cream45 }]}>Used for confirmation</Text>
        </View>
        <View
          style={[
            styles.inputBox,
            dark && styles.inputBoxDark,
            focus === 'email' && (dark ? styles.inputBoxFocusDark : styles.inputBoxFocus),
          ]}
        >
          <View style={styles.inputIcon}>
            <Ionicons
              name="mail-outline"
              size={17}
              color={focus === 'email' ? (dark ? C.gold : C.pine) : dark ? C.cream45 : C.ink40}
            />
          </View>
          <TextInput
            value={email}
            onChangeText={(v) => {
              setError('');
              setEmail(v);
            }}
            onFocus={() => {
              setFocus('email');
              onFocusField?.();
            }}
            onBlur={() => setFocus(null)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="go"
            placeholder="guest@example.com"
            placeholderTextColor={placeholder}
            onSubmitEditing={submit}
            style={[styles.input, dark && styles.inputDark]}
          />
          {email.length > 0 && (
            <Pressable onPress={() => setEmail('')} hitSlop={8} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={16} color={dark ? C.cream45 : C.ink40} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Error Banner */}
      {!!error && (
        <View style={[styles.errorBox, dark && styles.errorBoxDark]}>
          <Ionicons name="alert-circle" size={16} color={dark ? HEX.blush : HEX.danger} />
          <Text style={[styles.errorText, dark && { color: HEX.blush }]}>{error}</Text>
        </View>
      )}

      {/* Submit Button */}
      <Pressable
        onPress={submit}
        accessibilityRole="button"
        accessibilityLabel="Find booking"
        style={({ pressed }) => [
          styles.btn,
          dark && styles.btnDark,
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        ]}
      >
        <Text style={[styles.btnText, dark && { color: C.pine }]}>FIND RESERVATION</Text>
        <View style={[styles.btnArrowCircle, dark && styles.btnArrowCircleDark]}>
          <Ionicons name="arrow-forward" size={14} color={dark ? C.pine : C.cream} />
        </View>
      </Pressable>

      {/* Demo sample bar */}
      <View style={[styles.demoCard, dark && styles.demoCardDark]}>
        <View style={styles.demoLeft}>
          <Text style={[styles.demoTag, dark && { color: C.gold }]}>TEST WITH DEMO BOOKING</Text>
          <Text style={[styles.demoDetails, dark && { color: C.cream70 }]} numberOfLines={1}>
            SH-4QK8TW · guest@example.com
          </Text>
        </View>
        <Pressable
          onPress={() => {
            setReference('SH-4QK8TW');
            setEmail('guest@example.com');
            setError('');
          }}
          accessibilityRole="button"
          accessibilityLabel="Fill demo booking"
          style={({ pressed }) => [
            styles.demoBtn,
            dark && styles.demoBtnDark,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="sparkles" size={12} color={dark ? C.gold : C.pine} />
          <Text style={[styles.demoBtnText, dark && { color: C.cream }]}>Fill sample</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  note: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 18,
    color: C.ink55,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  label: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    letterSpacing: 1.3,
    color: C.ink70,
  },
  labelHint: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: C.ink40,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    backgroundColor: pine(0.03),
    borderWidth: 1,
    borderColor: pine(0.12),
    paddingHorizontal: 12,
  },
  inputBoxDark: {
    backgroundColor: 'rgba(236, 238, 237, 0.08)',
    borderColor: 'rgba(236, 238, 237, 0.12)',
  },
  inputBoxFocus: {
    borderColor: C.pine,
    backgroundColor: C.pureWhite,
  },
  inputBoxFocusDark: {
    borderColor: C.gold,
    backgroundColor: 'rgba(236, 238, 237, 0.14)',
  },
  inputIcon: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.uiMedium,
    fontSize: 15,
    color: C.ink,
    paddingVertical: 0,
  },
  inputDark: {
    color: C.cream,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 6,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 11,
    borderRadius: 12,
    backgroundColor: 'rgba(180, 35, 24, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(180, 35, 24, 0.18)',
  },
  errorBoxDark: {
    backgroundColor: 'rgba(255, 180, 168, 0.12)',
    borderColor: 'rgba(255, 180, 168, 0.25)',
  },
  errorText: {
    flex: 1,
    fontFamily: FONTS.uiMedium,
    fontSize: 12.5,
    color: HEX.danger,
    lineHeight: 17,
  },
  btn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: C.pine,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: HEX.pine,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 2,
  },
  btnDark: {
    backgroundColor: C.cream,
    shadowOpacity: 0.05,
  },
  btnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12.5,
    letterSpacing: 1.5,
    color: C.cream,
  },
  btnArrowCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnArrowCircleDark: {
    backgroundColor: pine(0.12),
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: pine(0.03),
    borderWidth: 1,
    borderColor: pine(0.07),
    marginTop: 2,
  },
  demoCardDark: {
    backgroundColor: 'rgba(236, 238, 237, 0.06)',
    borderColor: 'rgba(236, 238, 237, 0.1)',
  },
  demoLeft: {
    flex: 1,
    marginRight: 10,
  },
  demoTag: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.1,
    color: HEX.bronze,
  },
  demoDetails: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11.5,
    color: C.ink70,
    marginTop: 2,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: pine(0.12),
  },
  demoBtnDark: {
    backgroundColor: 'rgba(236, 238, 237, 0.12)',
    borderColor: 'rgba(236, 238, 237, 0.2)',
  },
  demoBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 11,
    color: C.pine,
  },
});
