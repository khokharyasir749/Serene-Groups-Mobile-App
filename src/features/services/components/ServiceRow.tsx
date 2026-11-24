import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, spacing } from "@/core/constants/theme";
import { IconWell } from "@/features/services/components/IconWell";
import { ActionButton, SurfacePress } from "@/features/services/components/ui";
import { BILLED, type Service } from "@/features/services/data/catalog";
import { openBook, openService } from "@/features/services/lib/nav";

/** Chargeable extra: photo, what it is, and Order or Request. Priced by the desk, so no amount is shown. */
export function ServiceRow({ service: s }: { service: Service }) {
  return (
    <SurfacePress radius={18} onPress={() => openService(s.slug)} style={styles.row} accessibilityLabel={`${s.name}. ${s.line} ${BILLED}`}>
      <IconWell name={s.icon} size={58} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {s.name}
        </Text>
        <Text style={styles.line} numberOfLines={1}>
          {s.line}
        </Text>
        <Text style={styles.billed} numberOfLines={1} maxFontSizeMultiplier={1.1}>
          Billed to room
        </Text>
      </View>
      <ActionButton small label={s.verb ?? "Request"} accessibilityLabel={`${s.verb} ${s.name}`} onPress={() => openBook(s.slug)} />
    </SurfacePress>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md + 2 },
  body: { flex: 1, gap: 1 },
  name: { color: colors.ink, fontSize: font.md, fontFamily: fonts.uiBold },
  line: { color: colors.muted, fontSize: 12 },
  billed: { color: colors.goldText, fontSize: 11.5, fontFamily: fonts.uiSemi },
});
