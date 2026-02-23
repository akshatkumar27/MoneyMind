import React from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextInputProps,
} from 'react-native';
import { colors, typography } from '../constants';
import { globalStyles } from '../styles';

interface InputProps extends TextInputProps {
    label?: string;
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    icon,
    containerStyle,
    error,
    ...textInputProps
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={globalStyles.inputLabel}>{label}</Text>}
            <View style={[globalStyles.inputContainer, !!error && globalStyles.inputError]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={globalStyles.inputField}
                    placeholderTextColor={colors.textMuted}
                    {...textInputProps}
                />
            </View>
            {error && <Text style={globalStyles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    iconContainer: {
        marginRight: 12,
    },
});
