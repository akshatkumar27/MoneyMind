import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import {InputProps} from './types';
import {typography} from '../constants/theme';
import {globalStyles} from '../styles/globalStyles';
import { useThemeColors } from "../context/ThemeContext";

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  containerStyle,
  error,
  ...textInputProps
}) => {
    const colors = useThemeColors();
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={globalStyles.inputLabel}>{label}</Text>}
      <View
        style={[
          globalStyles.inputContainer,
          !!error && globalStyles.inputError,
        ]}>
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
