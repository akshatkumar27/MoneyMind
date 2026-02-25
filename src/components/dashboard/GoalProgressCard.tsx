import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconCircle } from '../IconCircle';
import { ProgressBar } from './ProgressBar';
import { radii, typography, spacing } from '../../constants/theme';
import { useThemeColors } from "../../context/ThemeContext";

export interface GoalProgressCardProps {
  icon: string;
  title: string;
  progress: number;
  subtitle: string;
  color?: string;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  icon,
  title,
  progress,
  subtitle,
  color,
}) => {
  const colors = useThemeColors();
  const activeColor = color || colors.primary;
  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.header}>
        <IconCircle
          emoji={icon}
          size={36}
          radius="sm"
          borderColor={activeColor}
          backgroundColor="transparent"
          style={styles.iconMargin}
        />
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        </View>
        <Text style={[styles.percent, { color: activeColor }]}>{progress}%</Text>
      </View>
      <ProgressBar progress={progress} color={activeColor} height={6} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconMargin: {
    marginRight: spacing.sm,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: typography.bodySmall,
    fontWeight: typography.medium,
  },
  subtitle: {
    fontSize: typography.caption,
  },
  percent: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
  },
});
