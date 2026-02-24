import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, radii, typography, spacing} from '../../constants/theme';

export interface StatCardProps {
  label: string;
  value: string;
  valueColor?: string;
  small?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  valueColor = colors.textPrimary,
  small = false,
}) => {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text
        style={[
          styles.statValue,
          {color: valueColor, fontSize: small ? 14 : 16},
        ]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: colors.inputBackground,
    borderRadius: radii.sm,
    padding: spacing.sm,
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statValue: {
    color: colors.textPrimary,
    fontWeight: typography.semibold,
  },
});
