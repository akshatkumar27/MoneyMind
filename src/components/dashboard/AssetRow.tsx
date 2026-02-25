import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {IconCircle} from '../IconCircle';
import {radii, typography, spacing} from '../../constants/theme';
import { useThemeColors } from "../../context/ThemeContext";

export interface AssetRowProps {
  icon: string;
  name: string;
  subtitle: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export const AssetRow: React.FC<AssetRowProps> = ({
  icon,
  name,
  subtitle,
  value,
  change,
  isPositive,
}) => {
    const colors = useThemeColors();
  return (
    <View style={[styles.row, { backgroundColor: colors.cardBackground }]}>
      <IconCircle
        emoji={icon}
        size={44}
        radius="sm"
        style={styles.iconMargin}
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{name}</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
      <View style={styles.values}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
        <Text
          style={[
            styles.change,
            {color: isPositive ? colors.success : colors.danger},
          ]}>
          {change}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  iconMargin: {
    marginRight: spacing.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.bodySmall,
    fontWeight: typography.medium,
  },
  subtitle: {
    fontSize: typography.caption,
    marginTop: 2,
  },
  values: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
  change: {
    fontSize: typography.caption,
    marginTop: 2,
  },
});
