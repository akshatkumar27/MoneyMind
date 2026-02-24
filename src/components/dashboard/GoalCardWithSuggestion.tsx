import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useCurrency} from '../../context/CurrencyContext';
import {ProgressBar} from './ProgressBar';
import {Button} from '../Button';
import {colors, radii, typography, spacing} from '../../constants/theme';

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
  color = colors.success,
  suggestionTitle,
  suggestionDescription,
  achieveInMonths,
  targetAmount,
  savedAmount,
  onEditPress,
  onAskAiPress,
  onCardPress,
}) => {
  const {currencySymbol} = useCurrency();

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
      style={styles.card}
      onPress={onCardPress}
      activeOpacity={onCardPress ? 0.7 : 1}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
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
          <Text style={styles.amount}>
            {savedAmount !== undefined
              ? `${formatCurrency(savedAmount)} / `
              : ''}
            {formatCurrency(targetAmount)}
          </Text>
        )}
        {achieveInMonths !== undefined && (
          <Text style={styles.achieveIn}>
            Achieve in {achieveInMonths}{' '}
            {achieveInMonths === 1 ? 'month' : 'months'}
          </Text>
        )}
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={styles.progressBarWrapper}>
          <ProgressBar progress={progress} color={color} height={6} />
        </View>
        <Text style={styles.progressPercent}>{progress}%</Text>
      </View>

      {/* AI Suggestion */}
      <View style={styles.suggestionSection}>
        <Text style={styles.suggestionLabel}>
          {suggestionTitle || 'AI suggestions'}
        </Text>
        <Text style={styles.suggestionText}>
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
    backgroundColor: colors.cardBackground,
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
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: typography.bold,
    marginBottom: 2,
  },
  achieveIn: {
    color: colors.textSecondary,
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
    color: colors.textPrimary,
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    minWidth: 40,
    textAlign: 'right',
  },
  suggestionSection: {
    marginBottom: spacing.md,
  },
  suggestionLabel: {
    color: colors.textPrimary,
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    marginBottom: spacing.xs,
  },
  suggestionText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18,
  },
});
