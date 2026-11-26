import type { ReactNode } from "react";
import { View, type TextProps } from "react-native";
import { Text as BaseText } from "@/core/components/Text";
import { sf, useServiceFonts } from "@/features/services/components/fonts";
import { tone } from "@/features/services/components/tone";

/** The shared Text, set in Manrope unless the style names its own face. */
export function Text({ style, ...rest }: TextProps) {
  return <BaseText {...rest} style={[{ fontFamily: sf.ui }, style]} />;
}

/** Holds a screen's content, on the page colour, until Services' fonts are in. */
export function Ready({ children }: { children: ReactNode }) {
  return useServiceFonts() ? <>{children}</> : <View style={{ flex: 1, backgroundColor: tone.page }} />;
}
