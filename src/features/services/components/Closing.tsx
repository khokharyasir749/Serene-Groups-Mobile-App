import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CONTACT } from "@/core/constants/serene";
import BrandLockup from "@/features/bookings/guest/components/BrandLockup";
import { whatsappDesk } from "@/features/services/components/DeskSheet";
import { callDesk } from "@/features/services/components/FrontDesk";
import { Press } from "@/features/services/components/surface";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";
import type { Glyph } from "@/features/services/data/catalog";
import { openMessage } from "@/features/services/store/useDeskSheet";
import { useServicesStore } from "@/features/services/store/useServicesStore";

function Contact({ icon, label, onPress }: { icon: Glyph; label: string; onPress: () => void }) {
  return (
    <Press onPress={onPress} accessibilityLabel={label} style={styles.contact}>
      <View style={styles.circle}>
        <Ionicons name={icon} size={18} color={tone.pine} />
      </View>
      <Text style={styles.contactText}>{label}</Text>
    </Press>
  );
}

/** The foot of a page: the hotel's mark, the desk's hours, and the three ways to reach it. */
export function Closing() {
  const room = useServicesStore((s) => s.room);
  return (
    <View style={styles.wrap}>
      <View style={styles.rule} />
      <BrandLockup sub="SERVICES" />
      <Text style={styles.hours}>Front Desk · Open 24 hours</Text>
      <View style={styles.row}>
        <Contact icon="call-outline" label="Call" onPress={callDesk} />
        <Contact icon="chatbubble-ellipses-outline" label="Message" onPress={openMessage} />
        <Contact icon="logo-whatsapp" label="WhatsApp" onPress={() => whatsappDesk(room, "I need some help, please.")} />
      </View>
      <Text style={styles.number}>{CONTACT.uan}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 14, paddingTop: 6 },
  rule: { alignSelf: "stretch", height: 1, marginBottom: 14, backgroundColor: tone.line },
  hours: { ...type.eyebrow, fontSize: 10.5, color: tone.soft },
  row: { flexDirection: "row", gap: 28, marginTop: 4 },
  contact: { alignItems: "center", gap: 7 },
  circle: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: tone.line, backgroundColor: tone.plate },
  contactText: { ...type.label, fontSize: 12, color: tone.ink },
  number: { ...type.figure, fontSize: 13, lineHeight: 18, color: tone.soft },
});
