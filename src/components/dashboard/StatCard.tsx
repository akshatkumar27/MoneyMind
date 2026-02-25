import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radii, typography, spacing } from '../../constants/theme';
import { useThemeColors } from "../../context/ThemeContext";

export interface StatCardProps {
  label: string;
  value: string;
  valueColor?: string;
  small?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  valueColor,
  small = false,
}) => {
  const colors = useThemeColors();
  const activeValueColor = valueColor || colors.textPrimary;
  return (
    <View style={[styles.statCard, { backgroundColor: colors.inputBackground }]}>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text
        style={[
          styles.statValue,
          { color: activeValueColor, fontSize: small ? 14 : 16 },
        ]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    borderRadius: radii.sm,
    padding: spacing.sm,
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: typography.semibold,
  },
});
