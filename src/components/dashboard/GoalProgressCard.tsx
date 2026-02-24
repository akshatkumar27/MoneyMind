import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, typography, spacing } from '../../constants';
import { IconCircle } from '../IconCircle';
import { ProgressBar } from './ProgressBar';

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
    color = colors.primary,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <IconCircle
                    emoji={icon}
                    size={36}
                    radius="sm"
                    borderColor={color}
                    backgroundColor="transparent"
                    style={styles.iconMargin}
                />
                <View style={styles.info}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
                <Text style={[styles.percent, { color }]}>{progress}%</Text>
            </View>
            <ProgressBar progress={progress} color={color} height={6} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cardBackground,
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
        color: colors.textPrimary,
        fontSize: typography.bodySmall,
        fontWeight: typography.medium,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: typography.caption,
    },
    percent: {
        fontSize: typography.h3,
        fontWeight: typography.bold,
    },
});
