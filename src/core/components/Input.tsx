import { useState } from "react";
import { StyleSheet, TextInput, View, Pressable, type TextInputProps } from "react-native";
import { Text } from "@/core/components/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, font, fonts, letter, radius, shadows, spacing, groups } from "@/core/constants/theme";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  showToggle?: boolean;
};

export function Input({ label, error, hint, icon, showToggle, secureTextEntry, style, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  return (
    <View style={styles.wrap}>
      <View style={[styles.card, focused && styles.focused, error ? styles.errorBorder : null, style]}>
        {icon ? <Ionicons name={icon} size={18} color={focused ? colors.pineBrand : colors.muted} style={styles.icon} /> : null}

        <View style={styles.inner}>
          {label ? <Text style={styles.microLabel}>{label.toUpperCase()}</Text> : null}
          <TextInput
            placeholderTextColor={colors.textDim}
            selectionColor={colors.pineBrand}
            autoCapitalize="none"
            secureTextEntry={hidden}
            {...rest}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={styles.input}
          />
        </View>

        {showToggle || secureTextEntry ? (
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={10} style={styles.toggleBtn}>
            <Ionicons name={hidden ? "eye-outline" : "eye-off-outline"} size={18} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  card: {
    minHeight: 64,
    backgroundColor: groups.plate,
    borderColor: groups.plateEdge,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.card,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
  },
  icon: {
    marginRight: spacing.md,
  },
  microLabel: {
    color: colors.muted,
    fontSize: 10,
    fontFamily: fonts.uiBold,
    letterSpacing: letter.eyebrow,
    marginBottom: 2,
  },
  input: {
    color: colors.ink,
    fontSize: font.md,
    fontFamily: fonts.uiSemi,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 22,
  },
  toggleBtn: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  focused: {
    borderColor: colors.pineBrand,
    borderWidth: 1.5,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: font.sm,
    marginLeft: spacing.xs,
  },
  hint: {
    color: colors.textDim,
    fontSize: font.sm,
    marginLeft: spacing.xs,
  },
});
