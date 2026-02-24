import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {IconCircle} from '../IconCircle';
import {colors, radii, typography, spacing} from '../../constants/theme';

export type AIInsightType = 'suggestion' | 'strategy' | 'insight';

export interface AIInsightCardProps {
  type: AIInsightType;
  title: string;
  description: string;
  highlight?: string;
}

const typeColors: Record<AIInsightType, string> = {
  suggestion: colors.warning,
  strategy: colors.info,
  insight: colors.success,
};

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  type,
  title,
  description,
  highlight,
}) => {
  const accentColor = typeColors[type];

  return (
    <View style={styles.card}>
      <IconCircle
        emoji="⚡"
        size={32}
        radius="sm"
        backgroundColor={accentColor + '20'}
        fontSize={16}
        style={styles.iconMargin}
      />
      <View style={styles.content}>
        <Text style={[styles.title, {color: accentColor}]}>{title}</Text>
        <Text style={styles.description}>
          {description}
          {highlight && (
            <Text style={[styles.highlight, {color: accentColor}]}>
              {' '}
              {highlight}
            </Text>
          )}
          .
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.cardBackground,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  iconMargin: {
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.caption,
    fontWeight: typography.bold,
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  highlight: {
    fontWeight: typography.semibold,
  },
});
