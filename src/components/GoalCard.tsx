import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {SelectableGoalCardProps} from './types';
import {typography, spacing, borderWidths} from '../constants/theme';
import { useThemeColors } from "../context/ThemeContext";

export const GoalCard: React.FC<SelectableGoalCardProps> = ({
  icon,
  title,
  description,
  selected,
  onPress,
  style,
  highlightedAmount,
}) => {
    const colors = useThemeColors();
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected, style, { backgroundColor: colors.cardBackground, borderColor: colors.border }, { borderColor: colors.primary, backgroundColor: colors.primary + '15' }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, selected && styles.titleSelected, { color: colors.textPrimary }, { color: colors.primary }]}>
            {title}
          </Text>
          {highlightedAmount && (
            <View style={styles.amountBadge}>
              <Text style={[styles.amountText, { color: colors.primary }]}>{highlightedAmount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      {selected && (
        <View style={[styles.checkContainer, { backgroundColor: colors.primary }]}>
          <Text style={[styles.checkmark, { color: colors.textPrimary }]}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: borderWidths.medium
  },
  cardSelected: {
},
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    flex: 1,
    marginRight: spacing.sm,
  },
  titleSelected: {
},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  amountBadge: {
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: borderWidths.thin,
    borderColor: 'rgba(45, 127, 249, 0.2)',
  },
  amountText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.bold,
  },
  description: {
    fontSize: typography.bodySmall,
    lineHeight: 20,
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: typography.bold,
  },
});
