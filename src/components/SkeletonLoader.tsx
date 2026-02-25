import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  DimensionValue,
  ViewStyle,
} from 'react-native';
import { SkeletonLoaderProps } from './types';
import { useThemeColors } from "../context/ThemeContext";

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const colors = useThemeColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
          backgroundColor: colors.lightloder
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    // Increased visibility for skeleton loader
  },
});
