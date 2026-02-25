import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';
import {BackButtonProps} from './types';
import {typography, borderWidths} from '../constants/theme';
import { useThemeColors } from "../context/ThemeContext";

export const BackButton: React.FC<BackButtonProps> = ({onPress, style}) => {
    const colors = useThemeColors();
  return (
    <TouchableOpacity
      style={[styles.button, style, { borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={[styles.icon, { color: colors.textPrimary }]}>{'‹'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: borderWidths.thin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
  },
});
