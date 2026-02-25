import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {LogoProps} from './types';
import {typography} from '../constants/theme';
import { useThemeColors } from "../context/ThemeContext";

export const Logo: React.FC<LogoProps> = ({size = 'medium'}) => {
    const colors = useThemeColors();
  const iconSize = size === 'small' ? 48 : size === 'large' ? 80 : 64;
  const fontSize = size === 'small' ? 14 : size === 'large' ? 20 : 16;

  return (
    <View style={styles.container}>
      <Image
        source={require('../asset/logotrans.png')}
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: iconSize / 4,
          marginBottom: 0,
        }}
        resizeMode="contain"
      />
      <Text style={[styles.brandName, {fontSize}, { color: colors.textPrimary }]}>Finova AI</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  brandName: {
    fontWeight: typography.semibold,
    letterSpacing: 2,
  },
});
