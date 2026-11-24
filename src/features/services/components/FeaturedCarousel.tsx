import { useRef, useState } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, spacing } from "@/core/constants/theme";
import { Press, Surface } from "@/features/services/components/surface";
import { CardPhoto, RoundButton } from "@/features/services/components/ui";
import type { Service } from "@/features/services/data/catalog";
import { openBook, openService } from "@/features/services/lib/nav";

const GAP = 12;
const HEIGHT = 264;

/** Photo cards with the next one peeking in, slightly smaller like a stack. */
export function FeaturedCarousel({ services }: { services: Service[] }) {
  const { width } = useWindowDimensions();
  const card = Math.min(width - spacing.lg * 2 - 28, 420);
  const step = card + GAP;
  const x = useRef(new Animated.Value(0)).current;
  const [page, setPage] = useState(0);

  return (
    <View>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: GAP }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x } } }], {
          useNativeDriver: true,
          listener: (e: { nativeEvent: { contentOffset: { x: number } } }) => setPage(Math.max(0, Math.min(services.length - 1, Math.round(e.nativeEvent.contentOffset.x / step)))),
        })}
      >
        {services.map((s, i) => {
          const drift = x.interpolate({ inputRange: [(i - 1) * step, i * step, (i + 1) * step], outputRange: [-22, 0, 22], extrapolate: "clamp" });
          const scale = x.interpolate({ inputRange: [(i - 1) * step, i * step, (i + 1) * step], outputRange: [0.92, 1, 0.92], extrapolate: "clamp" });
          return (
            <Animated.View key={s.slug} style={{ width: card, transform: [{ scale }] }}>
              <Press onPress={() => openService(s.slug)} style={styles.card} accessibilityLabel={`${s.name}. ${s.line}`}>
                <Animated.View style={[styles.photo, { transform: [{ translateX: drift }] }]}>
                  {s.photo ? <CardPhoto source={s.photo} /> : null}
                </Animated.View>
                <Surface finish="clear" radius={18} style={styles.foot}>
                  <View style={styles.words}>
                    <Text style={styles.name} numberOfLines={1}>
                      {s.name}
                    </Text>
                    <Text style={styles.line} numberOfLines={1}>
                      {s.line}
                    </Text>
                  </View>
                  <RoundButton finish="frost" size={42} icon="arrow-forward-outline" label={`${s.verb} ${s.name}`} onPress={() => openBook(s.slug)} />
                </Surface>
              </Press>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
      <View style={styles.dots}>
        {services.map((s, i) => (
          <View key={s.slug} style={[styles.dot, i === page && styles.dotOn]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { height: HEIGHT, borderRadius: 24, overflow: "hidden", backgroundColor: colors.stone, justifyContent: "flex-end" },
  foot: { flexDirection: "row", alignItems: "center", gap: spacing.md, margin: 10, paddingVertical: 10, paddingLeft: 16, paddingRight: 10 },
  photo: { position: "absolute", top: 0, bottom: 0, left: -24, right: -24 },
  words: { flex: 1 },
  name: { color: colors.white, fontSize: font.md + 2, fontFamily: fonts.uiBold },
  line: { color: colors.white, fontSize: font.sm },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: spacing.md },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.lineStrong },
  dotOn: { width: 22, backgroundColor: colors.goldAccent },
});
