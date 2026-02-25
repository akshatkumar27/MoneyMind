import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {radii, spacing} from '../../constants/theme';
import { useThemeColors } from "../../context/ThemeContext";

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Applies a blue-tinted gradient-like background */
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  gradient = false,
}) => {
    const colors = useThemeColors();
  return (
    <View style={[styles.card, gradient && styles.gradientCard, style, { backgroundColor: colors.cardBackground }, { backgroundColor: colors.dashboardCardBackground }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  gradientCard: {
},
});
