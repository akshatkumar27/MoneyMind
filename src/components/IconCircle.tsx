import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../constants';

export type IconCircleSize = 32 | 36 | 40 | 44 | 48 | 56 | 60;
export type IconCircleRadius = keyof typeof radii;

export interface IconCircleProps {
    /** Emoji string or a React node (e.g. an icon component) */
    emoji?: string;
    children?: React.ReactNode;
    size?: IconCircleSize;
    /** Border-radius key from the radii token scale. Defaults to 'full' (circle). */
    radius?: IconCircleRadius;
    /** Background colour. Defaults to colors.inputBackground */
    backgroundColor?: string;
    /** Emoji / icon font size. Auto-computed from size if omitted. */
    fontSize?: number;
    /** Optional accent border colour */
    borderColor?: string;
    style?: ViewStyle;
}

export const IconCircle: React.FC<IconCircleProps> = ({
    emoji,
    children,
    size = 40,
    radius = 'full',
    backgroundColor = colors.inputBackground,
    fontSize,
    borderColor,
    style,
}) => {
    const computedFontSize = fontSize ?? Math.round(size * 0.45);
    const borderRadius = radii[radius];

    return (
        <View
            style={[
                styles.base,
                {
                    width: size,
                    height: size,
                    borderRadius,
                    backgroundColor,
                    borderColor: borderColor ?? 'transparent',
                    borderWidth: borderColor ? 2 : 0,
                },
                style,
            ]}
        >
            {emoji ? (
                <Text style={{ fontSize: computedFontSize }}>{emoji}</Text>
            ) : (
                children
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
