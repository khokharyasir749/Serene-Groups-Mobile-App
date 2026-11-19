import type { ReactNode, RefObject } from "react";
import { RefreshControl, ScrollView, StyleSheet, View, type ScrollViewInstance } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CLEARANCE, colors, spacing } from "@/core/constants/theme";
import { FloatingHeader } from "./FloatingHeader";

type Props = {
  /** Shown centred in the floating header pill. */
  title?: string;
  onBack?: () => void;
  /** Right-hand CTA inside the pill (use <HeaderAction/>). */
  right?: ReactNode;
  children: ReactNode;
  /** Wrap children in a ScrollView (default). Pass false when children own scrolling (e.g. a FlatList). */
  scroll?: boolean;
  /** Drop the bottom padding so a trailing dark section can run to the edge. */
  flush?: boolean;
  /** Ref to the page ScrollView (for jump-to-section links). */
  scrollRef?: RefObject<ScrollViewInstance | null>;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({ title, onBack, right, children, scroll = true, flush = false, scrollRef, refreshing = false, onRefresh }: Props) {
  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      {title ? <FloatingHeader title={title} onBack={onBack} action={right} /> : null}
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.content, flush && styles.flush]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.ink} /> : undefined}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.fill}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  fill: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: spacing.lg, gap: spacing.xl, paddingBottom: CLEARANCE },
  flush: { paddingBottom: 0 },
});
