import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors, radii} from '../../constants/theme';

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
  color = colors.primary,
  backgroundColor = colors.border,
  height = 8,
  style,
}) => {
  const clampedWidth = `${Math.min(100, Math.max(0, progress))}%` as const;
  return (
    <View
      style={[
        styles.track,
        {height, backgroundColor, borderRadius: height / 2},
        style,
      ]}>
      <View
        style={[
          styles.fill,
          {
            width: clampedWidth,
            backgroundColor: color,
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
