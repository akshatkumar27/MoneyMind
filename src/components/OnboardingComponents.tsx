import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';
import {SelectOptionProps, ChipOptionProps, CounterProps} from './types';
import {typography, borderWidths} from '../constants/theme';
import { useThemeColors } from "../context/ThemeContext";

export const SelectOption: React.FC<SelectOptionProps> = ({
  icon,
  label,
  sublabel,
  selected,
  onPress,
  style,
}) => {
    const colors = useThemeColors();
  return (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionSelected, style, { backgroundColor: colors.cardBackground, borderColor: colors.border }, { borderColor: colors.primary, backgroundColor: colors.primary + '15' }]}
      onPress={onPress}
      activeOpacity={0.7}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.label, selected && styles.labelSelected, { color: colors.textPrimary }, { color: colors.primary }]}>
        {label}
      </Text>
      {sublabel && <Text style={[styles.sublabel, { color: colors.textMuted }]}>{sublabel}</Text>}
      {selected && <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>}
    </TouchableOpacity>
  );
};

export const ChipOption: React.FC<ChipOptionProps> = ({
  label,
  selected,
  onPress,
}) => {
    const colors = useThemeColors();
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected, { backgroundColor: colors.cardBackground, borderColor: colors.border }, { backgroundColor: colors.primary, borderColor: colors.primary }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected, { color: colors.textSecondary }, { color: colors.textPrimary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const Counter: React.FC<CounterProps> = ({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = 10,
}) => {
    const colors = useThemeColors();
  return (
    <TouchableOpacity style={styles.counterContainer}>
      <TouchableOpacity
        style={[
                                  styles.counterButton,
                                  value <= min && styles.counterButtonDisabled,
                                , { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        onPress={onDecrement}
        disabled={value <= min}>
        <Text style={[styles.counterButtonText, { color: colors.textPrimary }]}>−</Text>
      </TouchableOpacity>
      <Text style={[styles.counterValue, { color: colors.textPrimary }]}>{value}</Text>
      <TouchableOpacity
        style={[
                                  styles.counterButton,
                                  value >= max && styles.counterButtonDisabled,
                                , { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        onPress={onIncrement}
        disabled={value >= max}>
        <Text style={[styles.counterButtonText, { color: colors.textPrimary }]}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: borderWidths.thin
  },
  optionSelected: {
},
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: typography.body,
    fontWeight: typography.medium,
  },
  labelSelected: {
},
  sublabel: {
    fontSize: typography.caption,
    marginLeft: 8,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: typography.bold,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: borderWidths.thin,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
},
  chipLabel: {
    fontSize: typography.bodySmall,
    fontWeight: typography.medium,
  },
  chipLabelSelected: {
},
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: borderWidths.thin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonDisabled: {
    opacity: 0.3,
  },
  counterButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  counterValue: {
    fontSize: 48,
    fontWeight: typography.bold,
    marginHorizontal: 32,
  },
});
