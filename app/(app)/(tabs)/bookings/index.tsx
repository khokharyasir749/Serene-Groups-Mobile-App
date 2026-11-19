import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Screen } from "@/core/components/Screen";
import { SectionHeader } from "@/core/components/SectionHeader";
import { usePermissions } from "@/core/hooks/usePermissions";
import { P } from "@/core/constants/api";
import { colors, font, spacing } from "@/core/constants/theme";
import { StayDiscovery } from "@/features/home/components/StayDiscovery";
import { MyStays } from "@/features/stays/components/MyStays";
import { router } from "expo-router";
import { HeaderAction } from "@/core/components/FloatingHeader";

// Serene Booking: open to everyone. Signing in is asked only when someone reserves (see ReserveSheet).
export default function StayScreen() {
  const { has } = usePermissions();
  return (
    <Screen
      title="Serene Booking"
      right={has(P.BOOKINGS_READ) ? <HeaderAction label="Staff" onPress={() => router.push("/staff/bookings")} /> : undefined}
    >
      <MyStays />
      <StayDiscovery />
      <View style={styles.foot}>
        <SectionHeader eyebrow="Need a hand?" title="Plan your" soft="stay with us." />
        <Text style={styles.p}>Our team replies on WhatsApp and by phone, seven days a week.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  foot: { gap: spacing.sm },
  p: { color: colors.muted, fontSize: font.md, lineHeight: 22 },
});
