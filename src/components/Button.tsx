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



import { ButtonProps } from './types';

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


