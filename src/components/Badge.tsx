import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {radii, typography} from '../constants/theme';
import { useThemeColors } from "../context/ThemeContext";

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'primary'
  | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  /** Override the computed background colour directly */
  color?: string;
  size?: BadgeSize;
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, {bg: string; text: string}> = {
  success: {bg: colors.successSubtle, text: colors.success},
  warning: {bg: colors.warningSubtle, text: colors.warning},
  danger: {bg: colors.dangerSubtle, text: colors.danger},
  info: {bg: colors.infoSubtle, text: colors.info},
  primary: {bg: colors.primarySubtle, text: colors.primary},
  neutral: {bg: colors.inputBackground, text: colors.textSecondary},
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  color,
  size = 'sm',
  style,
}) => {
    const colors = useThemeColors();
  const {bg, text} = variantColors[variant];
  const bgColor = color ? color + '20' : bg;
  const textColor = color ?? text;

  return (
    <View
      style={[
        styles.base,
        size === 'md' && styles.md,
        {backgroundColor: bgColor},
        style,
      ]}>
      <Text
        style={[
          styles.label,
          size === 'md' && styles.labelMd,
          {color: textColor},
        ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.xs,
    alignSelf: 'flex-start',
  },
  md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  label: {
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  labelMd: {
    fontSize: typography.bodySmall,
  },
});
