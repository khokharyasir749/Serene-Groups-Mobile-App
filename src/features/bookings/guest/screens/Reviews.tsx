import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PageHeader from '@/features/bookings/guest/components/PageHeader';
import { Text } from '@/features/bookings/guest/components/Text';
import { REVIEWS, REVIEW_SCORE } from '@/features/bookings/guest/data/catalog';
import { C, FONTS, S, shadow } from '@/features/bookings/guest/theme';
import { canvas, glassCard, glassCardDark } from '@/features/bookings/guest/theme/glass';

// Guest reviews, opened from the menu: the overall score, then every review in full.
export default function Reviews() {
  const insets = useSafeAreaInsets();
  return (
    <View style={canvas}>
      <PageHeader title="Guest reviews" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.gutter, paddingTop: 20, paddingBottom: insets.bottom + 40 }}>
        <Text style={styles.eyebrow}>GUEST IMPRESSIONS</Text>
        <Text style={styles.title}>Moments at Serene Heights</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreBig}>{REVIEW_SCORE.average.toFixed(1)}</Text>
          <View style={styles.scoreDivider} />
          <View style={{ flex: 1 }}>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, k) => (
                <Ionicons key={k} name="star" size={13} color={C.gold} />
              ))}
            </View>
            <Text style={styles.scoreLabel}>Exceptional</Text>
            <Text style={styles.scoreSub}>{REVIEW_SCORE.count} verified stays</Text>
          </View>
        </View>

        <View style={{ gap: 14 }}>
          {REVIEWS.map((item) => (
            <ReviewCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const ReviewCard = memo(function ReviewCard({ item }: { item: (typeof REVIEWS)[number] }) {
  return (
    <View style={styles.card}>
              <View style={styles.top}>
                <Text style={styles.quoteMark}>“</Text>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Ionicons key={k} name={k < item.rating ? 'star' : 'star-outline'} size={11.5} color={C.gold} />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewTitle}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <View style={styles.footer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.author.split(' ').map((n) => n[0]).join('')}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={styles.author}>{item.author} · {item.country}</Text>
                  <Text numberOfLines={1} style={styles.room}>{item.roomType} · {item.stayed}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={18} color={C.gold} accessibilityLabel="Verified stay" />
              </View>
            </View>
  );
});

const styles = StyleSheet.create({
  eyebrow: { fontFamily: FONTS.uiBold, fontSize: 10, letterSpacing: 1.8, color: C.gold },
  title: { fontFamily: FONTS.display, fontSize: 28, lineHeight: 32, color: C.ink, marginTop: 4 },
  scoreCard: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16, marginBottom: 18, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 20, backgroundColor: C.pine, borderWidth: 1, borderColor: C.goldLine, ...glassCardDark },
  scoreBig: { fontFamily: FONTS.display, fontSize: 46, lineHeight: 50, color: C.cream, fontVariant: ['tabular-nums'] },
  scoreDivider: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch', backgroundColor: C.goldLine },
  scoreLabel: { fontFamily: FONTS.display, fontSize: 20, lineHeight: 24, color: C.cream, marginTop: 6 },
  scoreSub: { fontFamily: FONTS.ui, fontSize: 12.5, color: C.cream70, marginTop: 1 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  card: { padding: 20, backgroundColor: C.white, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...shadow.card, ...glassCard },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', height: 30 },
  quoteMark: { fontFamily: FONTS.display, fontSize: 52, lineHeight: 52, color: C.gold, marginTop: -6 },
  reviewTitle: { fontFamily: FONTS.display, fontSize: 21, lineHeight: 25, color: C.ink, marginTop: 4 },
  body: { fontFamily: FONTS.ui, fontSize: 13.5, lineHeight: 20.5, color: C.ink70, marginTop: 8 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 16, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  avatar: { width: S.well, height: S.well, borderRadius: 18, backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FONTS.uiBold, fontSize: 11.5, letterSpacing: 0.5, color: C.gold },
  author: { fontFamily: FONTS.uiSemi, fontSize: 13, color: C.ink },
  room: { fontFamily: FONTS.ui, fontSize: 11.5, color: C.ink55, marginTop: 1 },
});
