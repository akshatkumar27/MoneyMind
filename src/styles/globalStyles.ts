/**
 * globalStyles.ts
 *
 * Shared, reusable StyleSheet definitions for the app.
 */

import {StyleSheet} from 'react-native';
import {
  typography,
  spacing,
  radii,
  borderWidths,
  colors as defaultColors, // legacy support during migration
} from '../constants/theme';
import {useThemeColors} from '../context/ThemeContext';

export const createGlobalStyles = (colors: typeof defaultColors) =>
  StyleSheet.create({
    // ─── Root ───────────────────────────────────────────────────────────────────
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex1: {
      flex: 1,
    },

    // ─── Layout ──────────────────────────────────────────────────────────────────
    screenContent: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // ─── Card ────────────────────────────────────────────────────────────────────
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: radii.lg,
      overflow: 'hidden',
    },
    cardPadded: {
      backgroundColor: colors.cardBackground,
      borderRadius: radii.lg,
      padding: spacing.md,
    },

    // ─── Header Row ──────────────────────────────────────────────────────────────
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    sectionLabel: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
      fontWeight: typography.medium,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },

    // ─── Typography ───────────────────────────────────────────────────────────────
    headingLarge: {
      color: colors.textPrimary,
      fontSize: typography.h1,
      fontWeight: typography.bold,
    },
    headingMedium: {
      color: colors.textPrimary,
      fontSize: typography.h2,
      fontWeight: typography.bold,
    },
    headingSmall: {
      color: colors.textPrimary,
      fontSize: typography.h3,
      fontWeight: typography.semibold,
    },
    bodyText: {
      color: colors.textSecondary,
      fontSize: typography.body,
      lineHeight: 24,
    },
    bodySmall: {
      color: colors.textSecondary,
      fontSize: typography.bodySmall,
    },
    caption: {
      color: colors.textMuted,
      fontSize: typography.caption,
    },
    errorText: {
      color: colors.error,
      fontSize: typography.caption,
      marginTop: 4,
    },
    linkText: {
      color: colors.link,
      fontSize: typography.body,
      fontWeight: typography.semibold,
    },

    // ─── Buttons ─────────────────────────────────────────────────────────────────
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      color: colors.white, // Usually stays white on primary background
      fontSize: typography.body,
      fontWeight: typography.semibold,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    dangerButton: {
      backgroundColor: colors.danger,
      paddingVertical: spacing.md,
      borderRadius: radii.md,
      alignItems: 'center',
    },
    dangerButtonText: {
      color: '#ffffff',
      fontSize: typography.body,
      fontWeight: typography.semibold,
    },

    // ─── Inputs ──────────────────────────────────────────────────────────────────
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: radii.md,
      borderWidth: borderWidths.thin,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
    },
    inputField: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: typography.body,
      paddingVertical: spacing.md,
    },
    inputError: {
      borderColor: colors.error,
    },
    inputLabel: {
      color: colors.textSecondary,
      fontSize: typography.caption,
      fontWeight: typography.medium,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },

    // ─── Row helpers ─────────────────────────────────────────────────────────────
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowSpaceBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    // ─── Progress Bar ─────────────────────────────────────────────────────────────
    progressBar: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginBottom: spacing.xl,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },

    // ─── Footer ──────────────────────────────────────────────────────────────────
    footer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      borderTopWidth: borderWidths.thin,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    footerPlain: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },

    // ─── Divider ─────────────────────────────────────────────────────────────────
    divider: {
      height: 0.5,
      backgroundColor: colors.border,
      marginVertical: spacing.sm,
    },
  });

export const useGlobalStyles = () => createGlobalStyles(useThemeColors());

// Kept for backward-compat during migration
export const globalStyles = createGlobalStyles(defaultColors);
