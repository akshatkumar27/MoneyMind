import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { radii } from '../../constants/theme';
import { useThemeColors } from "../../context/ThemeContext";

export interface ProgressBarProps {
  /** 0–100 */
  progress: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  backgroundColor,
  height = 8,
  style,
}) => {
  const colors = useThemeColors();
  const activeColor = color || colors.primary;
  const activeBgColor = backgroundColor || colors.border;
  const clampedWidth = `${Math.min(100, Math.max(0, progress))}%` as const;
  return (
    <View
      style={[
        styles.track,
        { height, backgroundColor: activeBgColor, borderRadius: height / 2 },
        style,
      ]}>
      <View
        style={[
          styles.fill,
          {
            width: clampedWidth,
            backgroundColor: activeColor,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
