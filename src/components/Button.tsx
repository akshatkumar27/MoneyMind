import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { colors } from '../constants';
import { globalStyles } from '../styles';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    showArrow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    style,
    textStyle,
    showArrow = true,
}) => {
    return (
        <TouchableOpacity
            style={[
                globalStyles.primaryButton,
                (disabled || loading) && globalStyles.buttonDisabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
            ) : (
                <Text style={[globalStyles.primaryButtonText, textStyle]}>
                    {title} {showArrow && '→'}
                </Text>
            )}
        </TouchableOpacity>
    );
};


