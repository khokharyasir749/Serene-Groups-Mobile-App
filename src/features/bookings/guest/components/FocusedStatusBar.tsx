import { useFocusEffect } from 'expo-router';
import { StatusBar, type StatusBarStyle } from 'expo-status-bar';
import { useCallback, useState } from 'react';

/** Every tab stays mounted, so only the one in front may set the status bar. */
export default function FocusedStatusBar({ style }: { style: StatusBarStyle }) {
  const [focused, setFocused] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );
  return focused ? <StatusBar style={style} /> : null;
}
