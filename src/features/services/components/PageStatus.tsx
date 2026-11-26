import { useIsFocused } from "expo-router";
import { StatusBar } from "expo-status-bar";

/** Tabs stay mounted (and load ahead of time), so a page owns the status bar only while it is in front. Kept apart so a tab switch re-renders this and not the page. */
export function PageStatus({ style }: { style: "light" | "dark" }) {
  return useIsFocused() ? <StatusBar style={style} /> : null;
}
