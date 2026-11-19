import { useEffect, useRef, useState } from "react";
import { Keyboard, Modal, Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { useReserveStayMutation } from "@/core/api/endpoints/staysApi";
import { Button } from "@/core/components/Button";
import { Input } from "@/core/components/Input";
import { Ionicons } from "@expo/vector-icons";
import { ROOMS } from "@/core/constants/serene";
import { colors, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { parseError } from "@/core/lib/errorParser";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useAuthStore } from "@/core/stores/authStore";
import { toast } from "@/core/stores/uiStore";
import { stayEnquirySchema } from "@/features/home/schemas/stay.schema";
import { useReserveStore } from "../hooks/useReserveStore";
import type { Stay } from "../types";
import { GuestAuthPanel } from "./GuestAuthPanel";
import { ReservationPass } from "./ReservationPass";

const GUESTS = [1, 2, 3, 4];

/** Reserve a stay. Everything is open to browse; sign-in (guest, by mobile code) is asked only at the last step. */
export function ReserveSheet() {
  const { open, draft, close } = useReserveStore();
  const authed = useAuthStore((s) => s.accessToken !== null);
  const [reserve, { isLoading }] = useReserveStayMutation();
  const [room, setRoom] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [needAuth, setNeedAuth] = useState(false);
  const [done, setDone] = useState<Stay | null>(null);

  // The Modal is not resized by Android, so lift the sheet above the keyboard ourselves and bring the dates into view.
  const [kb, setKb] = useState(0);
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const datesY = useRef(0);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKb(e.endCoordinates.height);
      setTimeout(() => scrollRef.current?.scrollTo({ y: Math.max(0, datesY.current + spacing.lg - spacing.sm), animated: true }), 60);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => setKb(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const stepIndex = done ? 3 : needAuth && !authed ? 2 : 1;

  // Each time the sheet opens it starts from the draft the caller passed in.
  useEffect(() => {
    if (!open) return;
    setRoom(draft.roomSlug);
    setCheckIn(draft.checkIn);
    setCheckOut(draft.checkOut);
    setAdults(draft.adults);
    setError(null);
    setNeedAuth(false);
    setDone(null);
  }, [open, draft]);

  const submit = async () => {
    try {
      const stay = await reserve({ roomSlug: room as string, checkIn, checkOut, adults }).unwrap();
      setDone(stay);
      toast(`Reservation ${stay.reference} requested`, "success");
    } catch (e) {
      setError(parseError(e));
    }
  };

  const onReserve = () => {
    if (!room) return setError("Choose a residence type.");
    const parsed = stayEnquirySchema.safeParse({ checkIn, checkOut, adults });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Check your dates");
    setError(null);
    if (!authed) return setNeedAuth(true);
    void submit();
  };

  return (
    <Modal visible={open} animationType="slide" onRequestClose={close} statusBarTranslucent presentationStyle="fullScreen">
      <View style={[styles.sheet, { paddingTop: insets.top + spacing.sm, paddingBottom: kb ? kb : insets.bottom }]}>
        <View style={styles.topRow}>
          <View style={styles.topSpacer} />
          <View style={styles.stepBar}>
          <View style={[styles.stepDot, stepIndex >= 1 && styles.stepDotActive]}>
            <Text style={[styles.stepNum, stepIndex >= 1 && styles.stepNumActive]}>1</Text>
          </View>
          <View style={[styles.stepLine, stepIndex >= 2 && styles.stepLineActive]} />
          <View style={[styles.stepDot, stepIndex >= 2 && styles.stepDotActive]}>
            <Text style={[styles.stepNum, stepIndex >= 2 && styles.stepNumActive]}>2</Text>
          </View>
          <View style={[styles.stepLine, stepIndex >= 3 && styles.stepLineActive]} />
          <View style={[styles.stepDot, stepIndex >= 3 && styles.stepDotActive]}>
            <Text style={[styles.stepNum, stepIndex >= 3 && styles.stepNumActive]}>3</Text>
          </View>
          </View>
          <Pressable onPress={close} hitSlop={10} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
            <Ionicons name="close-outline" size={20} color={colors.ink} />
          </Pressable>
        </View>
        <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {done ? (
            <ReservationPass stay={done} onClose={close} />
          ) : needAuth && !authed ? (
            <GuestAuthPanel
              onSignedIn={() => {
                setNeedAuth(false);
                void submit();
              }}
            />
          ) : (
            <View style={styles.box}>
              <Text style={styles.eyebrow}>SERENE BOOKING</Text>
              <Text style={styles.title}>Reserve your stay</Text>
              <Text style={styles.label}>RESIDENCE</Text>
              <View style={styles.rooms}>
                {ROOMS.map((r) => {
                  const on = room === r.slug;
                  return (
                    <Pressable key={r.slug} onPress={() => setRoom(r.slug)} style={({ pressed }) => [styles.roomCard, on && styles.roomOn, pressed && styles.pressed]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
                      <View style={[styles.roomIcon, on && styles.roomIconOn]}>
                        <Ionicons name="bed-outline" size={16} color={on ? colors.snow : colors.ink} />
                      </View>
                      <View style={styles.flex}>
                        <Text style={styles.roomName}>{r.name}</Text>
                        <Text style={styles.roomCue}>{`${r.size} · ${r.guests}`}</Text>
                      </View>
                      <View style={[styles.check, on && styles.checkOn]}>{on ? <Ionicons name="checkmark" size={13} color={colors.white} /> : null}</View>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.row} onLayout={(e) => (datesY.current = e.nativeEvent.layout.y)}>
                <View style={styles.flex}>
                  <Input icon="calendar-outline" label="Check in" value={checkIn} onChangeText={setCheckIn} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
                </View>
                <View style={styles.flex}>
                  <Input icon="calendar-outline" label="Check out" value={checkOut} onChangeText={setCheckOut} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
                </View>
              </View>
              <Text style={styles.label}>GUESTS</Text>
              <View style={styles.guests}>
                {GUESTS.map((n) => {
                  const on = adults === n;
                  return (
                    <Pressable key={n} onPress={() => setAdults(n)} style={({ pressed }) => [styles.guest, on && styles.guestOn, pressed && styles.pressed]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
                      <Text style={[styles.guestNum, on && styles.guestNumOn]}>{n}</Text>
                      <Text style={styles.guestLabel}>{n > 1 ? "adults" : "adult"}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button label={authed ? "Confirm reservation" : "Reserve"} onPress={onReserve} loading={isLoading} />
              <Text style={styles.fine}>{authed ? "Your reservation is saved to My stays." : "You'll verify your mobile number in the next step."}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: colors.paper },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  topSpacer: { width: 40 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", ...shadows.card },
  stepBar: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, marginVertical: spacing.xs },
  stepDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  stepDotActive: { backgroundColor: colors.pineBrand, borderColor: colors.pineBrand },
  stepNum: { color: colors.muted, fontSize: 10, fontFamily: fonts.uiBold },
  stepNumActive: { color: colors.snow },
  stepLine: { width: 32, height: 1, backgroundColor: colors.line },
  stepLineActive: { backgroundColor: colors.pineBrand },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl * 2 },
  box: { gap: spacing.md },
  passCard: { gap: spacing.md, backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1, borderRadius: radius.xl, padding: spacing.xl, ...shadows.cardElevated },
  passHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusPill: { backgroundColor: colors.warningSoft, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { color: colors.warning, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: 0.8 },
  passDivider: { height: 1, backgroundColor: colors.line, borderStyle: "dashed" },
  passDetails: { gap: 4 },
  passRoom: { color: colors.ink, fontFamily: fonts.display, fontSize: 24 },
  eyebrow: { color: colors.muted, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 38 },
  p: { color: colors.ink2, fontSize: font.md, lineHeight: 22 },
  label: { color: colors.muted, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  rooms: { gap: spacing.sm },
  roomCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, paddingVertical: spacing.md, paddingHorizontal: spacing.md + 2, ...shadows.card },
  roomOn: { borderColor: colors.pineBrand, borderWidth: 1.5 },
  roomIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.cardUnselected, alignItems: "center", justifyContent: "center" },
  roomIconOn: { backgroundColor: colors.pineBrand },
  roomName: { color: colors.ink, fontSize: font.md, fontFamily: fonts.uiBold },
  roomCue: { color: colors.muted, fontSize: font.xs + 1, marginTop: 1 },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: "center", justifyContent: "center" },
  checkOn: { backgroundColor: colors.pineBrand, borderColor: colors.pineBrand },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  guests: { flexDirection: "row", gap: spacing.sm },
  guest: { flex: 1, alignItems: "center", paddingVertical: spacing.md, backgroundColor: colors.cardUnselected, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg },
  guestOn: { backgroundColor: colors.white, borderColor: colors.pineBrand, borderWidth: 1.5, ...shadows.card },
  guestNum: { color: colors.muted, fontFamily: fonts.display, fontSize: 26, lineHeight: 28 },
  guestNumOn: { color: colors.ink },
  guestLabel: { color: colors.muted, fontSize: 10, fontFamily: fonts.uiSemi, letterSpacing: 0.6, textTransform: "uppercase" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  row: { flexDirection: "row", gap: spacing.md },
  flex: { flex: 1 },
  error: { color: colors.danger, fontSize: font.sm },
  fine: { color: colors.muted, fontSize: font.xs, textAlign: "center" },
});
