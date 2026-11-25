import { StyleSheet, View } from "react-native";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { Text } from "@/core/components/Text";
import { fonts, groups } from "@/core/constants/theme";
import { AccountButton } from "./AccountButton";
import { GroupsMenu } from "./GroupsMenu";

/** Brand header for the main tabs: crest, wordmark and developer line, then account and menu. */
export function BrandBar() {
  return (
    <View style={styles.row}>
      <SereneLogoMark width={44} fill={groups.pine} snow={groups.plate} />
      <View style={styles.words}>
        <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
          SERENE GROUP
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          BY DM CONSORTIUM
        </Text>
      </View>
      <AccountButton />
      <GroupsMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  words: { flex: 1, gap: 1 },
  name: { color: groups.pine, fontFamily: fonts.display, fontSize: 21, lineHeight: 26, letterSpacing: 2 },
  sub: { color: groups.goldInk, fontSize: 10.5, lineHeight: 14, letterSpacing: 0.9, fontFamily: fonts.uiMedium },
});
