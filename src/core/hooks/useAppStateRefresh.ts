import { useEffect, useRef } from "react";
import { AppState } from "react-native";

/** Calls `onForeground` whenever the app returns from background to active. */
export function useAppStateRefresh(onForeground: () => void) {
  const cb = useRef(onForeground);
  cb.current = onForeground;
  useEffect(() => {
    let prev = AppState.currentState;
    const sub = AppState.addEventListener("change", (next) => {
      if (prev?.match(/inactive|background/) && next === "active") cb.current();
      prev = next;
    });
    return () => sub.remove();
  }, []);
}
