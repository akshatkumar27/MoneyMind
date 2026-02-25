import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { ProgressBar } from './ProgressBar';
import { Button } from '../Button';
import { radii, typography, spacing } from '../../constants/theme';
import { useThemeColors } from "../../context/ThemeContext";

export interface GoalCardWithSuggestionProps {
  icon?: string;
  title: string;
  progress: number;
  subtitle?: string;
  color?: string;
  suggestionTitle?: string;
  suggestionDescription?: string;
  suggestionHighlight?: string;
  achieveInMonths?: number;
  targetAmount?: number;
  savedAmount?: number;
  onEditPress?: () => void;
  onAskAiPress?: () => void;
  onCardPress?: () => void;
}

export const GoalCardWithSuggestion: React.FC<GoalCardWithSuggestionProps> = ({
  title,
  progress,
  color,
  suggestionTitle,
  suggestionDescription,
  achieveInMonths,
  targetAmount,
  savedAmount,
  onEditPress,
  onAskAiPress,
  onCardPress,
}) => {
  const colors = useThemeColors();
  const activeColor = color || colors.success;
  const { currencySymbol } = useCurrency();

  const formatCurrency = (amount: number): string => {
    if (amount >= 1_000_000_000) {
      return (
        currencySymbol +
        (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') +
        'B'
      );
    }
    if (amount >= 1_000_000) {
      return (
        currencySymbol +
        (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') +
        'M'
      );
    }
    if (amount >= 1_000) {
      return (
        currencySymbol + (amount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
      );
    }
    return currencySymbol + amount.toString();
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBackground }]}
      onPress={onCardPress}
      activeOpacity={onCardPress ? 0.7 : 1}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        <Button
          title="Edit"
          variant="outline"
          showArrow={false}
          style={styles.editBtn}
          textStyle={styles.editBtnText}
          onPress={() => {
            onEditPress?.();
          }}
        />
      </View>

      {/* Amount & Timeline */}
      <View style={styles.amountRow}>
        {targetAmount !== undefined && (
          <Text style={[styles.amount, { color: colors.textPrimary }]}>
            {savedAmount !== undefined
              ? `${formatCurrency(savedAmount)} / `
              : ''}
            {formatCurrency(targetAmount)}
          </Text>
        )}
        {achieveInMonths !== undefined && (
          <Text style={[styles.achieveIn, { color: colors.textSecondary }]}>
            Achieve in {achieveInMonths}{' '}
            {achieveInMonths === 1 ? 'month' : 'months'}
          </Text>
        )}
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={styles.progressBarWrapper}>
          <ProgressBar progress={progress} color={activeColor} height={6} />
        </View>
        <Text style={[styles.progressPercent, { color: colors.textPrimary }]}>{progress}%</Text>
      </View>

      {/* AI Suggestion */}
      <View style={styles.suggestionSection}>
        <Text style={[styles.suggestionLabel, { color: colors.textPrimary }]}>
          {suggestionTitle || 'AI suggestions'}
        </Text>
        <Text style={[styles.suggestionText, { color: colors.textSecondary }]}>
          {suggestionDescription || 'No suggestions available at the moment.'}
        </Text>
      </View>

      {/* Ask AI CTA */}
      <Button
        title="Ask AI about your goal"
        variant="outline"
        showArrow={false}
        onPress={() => {
          onAskAiPress?.();
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    flex: 1,
    marginRight: spacing.sm,
  },
  editBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  editBtnText: {
    fontSize: typography.caption,
  },
  amountRow: {
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: typography.body,
    fontWeight: typography.bold,
    marginBottom: 2,
  },
  achieveIn: {
    fontSize: typography.caption,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressBarWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  progressPercent: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    minWidth: 40,
    textAlign: 'right',
  },
  suggestionSection: {
    marginBottom: spacing.md,
  },
  suggestionLabel: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    marginBottom: spacing.xs,
  },
  suggestionText: {
    fontSize: typography.caption,
    lineHeight: 18,
  },
});
