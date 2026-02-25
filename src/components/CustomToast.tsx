import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {ToastConfig} from 'react-native-toast-message';
import {typography, spacing} from '../constants/theme';
import { useThemeColors } from "../context/ThemeContext";

const ToastMessage = ({
  type,
  text1,
  text2,
}: {
  type: 'success' | 'error' | 'info';
  text1?: string;
  text2?: string;
}) => {
    const colors = useThemeColors();
  const isError = type === 'error';
  const isSuccess = type === 'success';

  // Choose mascot based on type
  let mascotSource = require('../asset/mascot.png');
  if (isSuccess) {
    mascotSource = require('../asset/happymascot.png');
  }

  // Border color based on type
  let borderColor = colors.primary;
  if (isError) {
    borderColor = colors.error;
  }
  if (isSuccess) {
    borderColor = colors.success;
  }

  return (
    <View style={[styles.container, {borderLeftColor: borderColor}, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.mascotContainer}>
        <Image
          source={mascotSource}
          style={styles.mascot}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={[styles.title, { color: colors.textPrimary }]}>{text1}</Text>}
        {text2 && <Text style={[styles.message, { color: colors.textSecondary }]}>{text2}</Text>}
      </View>
    </View>
  );
};

export const toastConfig: ToastConfig = {
  success: ({text1, text2}) => (
    <ToastMessage type="success" text1={text1} text2={text2} />
  ),
  error: ({text1, text2}) => (
    <ToastMessage type="error" text1={text1} text2={text2} />
  ),
  info: ({text1, text2}) => (
    <ToastMessage type="info" text1={text1} text2={text2} />
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderRadius: 16,
    padding: spacing.md,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: spacing.md, // Add bottom margin for bottom positioning
  },
  mascotContainer: {
    marginRight: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 30,
    padding: 6,
  },
  mascot: {
    width: 60,
    height: 60,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.body,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  message: {
    fontSize: typography.bodySmall,
    lineHeight: 18,
  },
});
