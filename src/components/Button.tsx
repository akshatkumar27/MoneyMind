import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import {
  radii,
  typography,
  spacing,
  borderWidths,
} from '../constants/theme';
import { useThemeColors } from "../context/ThemeContext";

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showArrow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  showArrow = true,
}) => {
    const colors = useThemeColors();
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textPrimary : colors.primary}
        />
      ) : (
        <Text style={[styles.baseText, styles[`${variant}Text`], textStyle]}>
          {title} {showArrow && '→'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borderWidths.thin,
    borderColor: 'transparent',
  },
  // ─── Variants ─────────────────────────────────────────────────────────────
  primary: {
},
  outline: {
    backgroundColor: 'transparent'
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingVertical: spacing.sm,
  },
  // ─── Text ─────────────────────────────────────────────────────────────────
  baseText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
  primaryText: {
},
  outlineText: {
},
  ghostText: {
},
  // ─── State ────────────────────────────────────────────────────────────────
  disabled: {
    opacity: 0.5,
  },
});
