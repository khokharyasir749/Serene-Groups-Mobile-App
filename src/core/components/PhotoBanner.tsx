import { StyleSheet, View } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/core/components/Text";
import { colors, fonts, groups, spacing } from "@/core/constants/theme";

type Props = { image: ImageSource; tag: string; place: string; badge: string; title: string; kind: string; where: string; height?: number };

/** Wide photo card with corner badges, serif title and a location line. The same face as Explore's hero. */
export function PhotoBanner({ image, tag, place, badge, title, kind, where, height = 224 }: Props) {
  return (
    <View style={[styles.card, { height }]}>
      <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
      <BannerFace tag={tag} place={place} badge={badge} title={title} kind={kind} where={where} />
    </View>
  );
}

export function BannerFace({ tag, place, badge, title, kind, where }: Omit<Props, "image" | "height">) {
  return (
    <>
      <LinearGradient colors={groups.heroFade} locations={[0, 0.3, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.badges}>
        <View style={styles.badge}>
          <Text style={styles.badgeText} numberOfLines={1}>
            <Text style={styles.gold}>{`${tag.toUpperCase()}  •  `}</Text>
            {place.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.badge, styles.badgeSolid]}>
          <Text style={[styles.badgeText, styles.gold]}>{badge.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {title}
        </Text>
        <View style={styles.place}>
          <Ionicons name="location" size={14} color={groups.champagne} />
          <Text style={styles.placeText} numberOfLines={1}>
            <Text style={styles.gold}>{`${kind}  ·  `}</Text>
            {where}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 26, overflow: "hidden", justifyContent: "space-between", backgroundColor: groups.pine, borderWidth: 1.4, borderColor: groups.heroEdge },
  badges: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm, padding: 14 },
  badge: { flexShrink: 1, backgroundColor: colors.photoGlass, borderWidth: 1, borderColor: groups.badgeEdge, borderRadius: 999, paddingHorizontal: 11, height: 26, justifyContent: "center" },
  badgeSolid: { flexShrink: 0, backgroundColor: groups.badge },
  badgeText: { color: colors.white, fontSize: 10, letterSpacing: 0.7, fontFamily: fonts.uiMedium },
  gold: { color: groups.meshGold },
  body: { padding: 14, gap: 6 },
  title: { color: colors.white, fontFamily: fonts.display, fontSize: 33, lineHeight: 40 },
  place: { alignSelf: "flex-start", maxWidth: "100%", flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.photoGlass, borderRadius: 999, paddingHorizontal: 11, height: 30 },
  placeText: { flexShrink: 1, color: colors.white, fontSize: 12.5, fontFamily: fonts.uiMedium },
});
