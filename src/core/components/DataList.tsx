import type { ReactElement, ReactNode } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { CLEARANCE, colors, spacing } from "@/core/constants/theme";
import { EmptyState } from "./EmptyState";

type Props<T> = {
  data: T[] | undefined;
  renderItem: (item: T) => ReactElement;
  keyExtractor: (item: T) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  /** Suppress the loading / empty / error states (e.g. role has no access to the rows). */
  hideEmpty?: boolean;
};

/** FlatList with the loading / error / empty states every list screen needs. */
export function DataList<T>({
  data,
  renderItem,
  keyExtractor,
  loading,
  error,
  onRetry,
  refreshing,
  onRefresh,
  header,
  footer,
  emptyTitle = "Nothing here yet",
  emptyMessage,
  hideEmpty,
}: Props<T>) {
  let empty: ReactElement | null = null;
  if (hideEmpty) empty = null;
  else if (loading && !data) empty = <ActivityIndicator color={colors.ink} style={styles.loader} />;
  else if (error && !data) empty = <EmptyState icon="cloud-offline-outline" title="Couldn't load" message={error} actionLabel="Retry" onAction={onRetry} />;
  else if (!data?.length) empty = <EmptyState title={emptyTitle} message={emptyMessage} />;

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => renderItem(item)}
      ListHeaderComponent={header ? <View style={styles.header}>{header}</View> : undefined}
      ListEmptyComponent={empty ?? undefined}
      ListFooterComponent={footer ? <View style={styles.footer}>{footer}</View> : undefined}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: CLEARANCE },
  sep: { height: spacing.md },
  header: { gap: spacing.md, marginBottom: spacing.lg },
  footer: { marginTop: spacing.lg },
  loader: { marginTop: spacing.xxl },
});
