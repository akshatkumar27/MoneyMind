import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, typography, spacing } from '../../constants';
import { IconCircle } from '../IconCircle';

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
    return (
        <View style={styles.row}>
            <IconCircle emoji={icon} size={44} radius="sm" style={styles.iconMargin} />
            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <View style={styles.values}>
                <Text style={styles.value}>{value}</Text>
                <Text style={[styles.change, { color: isPositive ? colors.success : colors.danger }]}>
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
        backgroundColor: colors.cardBackground,
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
        color: colors.textPrimary,
        fontSize: typography.bodySmall,
        fontWeight: typography.medium,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: typography.caption,
        marginTop: 2,
    },
    values: {
        alignItems: 'flex-end',
    },
    value: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },
    change: {
        fontSize: typography.caption,
        marginTop: 2,
    },
});
