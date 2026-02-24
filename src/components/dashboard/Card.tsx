import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../../constants';

export interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    /** Applies a blue-tinted gradient-like background */
    gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, gradient = false }) => {
    return (
        <View style={[styles.card, gradient && styles.gradientCard, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: radii.lg,
        padding: spacing.md,
    },
    gradientCard: {
        backgroundColor: '#1a2744',
    },
});
