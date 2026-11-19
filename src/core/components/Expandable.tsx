import { useState, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/core/components/Button";
import { spacing } from "@/core/constants/theme";

type Props = {
  /** Always visible. */
  children: ReactNode;
  /** Revealed on demand. */
  more: ReactNode;
  moreLabel?: string;
  lessLabel?: string;
  /** Use light type for toggles that sit on a Pine surface. */
  onDark?: boolean;
};

/** Progressive disclosure: a compact default with an optional "Read full story" / "View all" toggle. */
export function Expandable({ children, more, moreLabel = "Read more", lessLabel = "Show less", onDark }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.wrap}>
      {children}
      {open ? more : null}
      <Button variant="secondary" showBadge arrow={open ? "↑" : "↓"} label={open ? lessLabel : moreLabel} onPress={() => setOpen((o) => !o)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
});
