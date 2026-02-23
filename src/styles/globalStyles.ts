/**
 * globalStyles.ts
 *
 * Shared, reusable StyleSheet definitions for the app.
 * Import from this file to avoid duplicating common style patterns across screens and components.
 *
 * Usage:
 *   import { globalStyles } from '../../styles/globalStyles';
 *   // Use directly: style={globalStyles.container}
 *   // Merge with local: style={[globalStyles.card, { marginTop: 8 }]}
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../constants';

export const globalStyles = StyleSheet.create({
    // ─── Root ───────────────────────────────────────────────────────────────────
    /** Full-screen SafeAreaView background */
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    /** Flex: 1 with no background (for KeyboardAvoidingView or inner wrappers) */
    flex1: {
        flex: 1,
    },

    // ─── Layout ──────────────────────────────────────────────────────────────────
    /** Padded horizontal content area */
    screenContent: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },

    /** Centered loading container */
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ─── Card ────────────────────────────────────────────────────────────────────
    /** Base dark card */
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        overflow: 'hidden',
    },

    /** Card with padding */
    cardPadded: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: spacing.md,
    },

    // ─── Header Row ──────────────────────────────────────────────────────────────
    /** Row with space-between for section titles + action buttons */
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },

    /** Muted uppercased section label */
    sectionLabel: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
        fontWeight: typography.medium,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // ─── Typography ───────────────────────────────────────────────────────────────
    /** Primary large heading */
    headingLarge: {
        color: colors.textPrimary,
        fontSize: typography.h1,
        fontWeight: typography.bold,
    },

    /** H2 heading */
    headingMedium: {
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: typography.bold,
    },

    /** H3 heading */
    headingSmall: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.semibold,
    },

    /** Standard body text */
    bodyText: {
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 24,
    },

    /** Small body text */
    bodySmall: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
    },

    /** Muted caption text */
    caption: {
        color: colors.textMuted,
        fontSize: typography.caption,
    },

    /** Error text (below inputs etc.) */
    errorText: {
        color: colors.error,
        fontSize: typography.caption,
        marginTop: 4,
    },

    /** Accent/link text */
    linkText: {
        color: colors.link,
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },

    // ─── Buttons ─────────────────────────────────────────────────────────────────
    /** Primary filled button */
    primaryButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /** Primary button text */
    primaryButtonText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },

    /** Disabled/muted overlay for buttons */
    buttonDisabled: {
        opacity: 0.6,
    },

    /** Danger/destructive button */
    dangerButton: {
        backgroundColor: '#ef4444',
        paddingVertical: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
    },

    /** Danger button text */
    dangerButtonText: {
        color: '#ffffff',
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },

    // ─── Inputs ──────────────────────────────────────────────────────────────────
    /** Input wrapper row */
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.inputBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
    },

    /** Input field (inside inputContainer) */
    inputField: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: typography.body,
        paddingVertical: spacing.md,
    },

    /** Error border state for input */
    inputError: {
        borderColor: colors.error,
    },

    /** Input label text */
    inputLabel: {
        color: colors.textSecondary,
        fontSize: typography.caption,
        fontWeight: typography.medium,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // ─── Row helpers ─────────────────────────────────────────────────────────────
    /** Horizontal row, vertically centered */
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    /** Row with space-between */
    rowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // ─── Progress Bar ─────────────────────────────────────────────────────────────
    /** Track */
    progressBar: {
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        marginBottom: spacing.xl,
    },

    /** Fill (apply explicit width via inline style) */
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 2,
    },

    // ─── Footer ──────────────────────────────────────────────────────────────────
    /** Sticky bottom footer with top border */
    footer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },

    /** Footer without top border (floating) */
    footerPlain: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },

    // ─── Modal ───────────────────────────────────────────────────────────────────
    /** Full-screen semi-transparent overlay */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },

    /** White/card modal container */
    modalCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: 20,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
    },

    /** Modal title */
    modalTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.bold,
        marginBottom: spacing.sm,
    },

    /** Modal body message */
    modalMessage: {
        color: colors.textSecondary,
        fontSize: typography.body,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 22,
    },

    /** Modal action buttons row */
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: spacing.sm,
    },

    // ─── Divider ─────────────────────────────────────────────────────────────────
    /** Horizontal thin separator line */
    divider: {
        height: 0.5,
        backgroundColor: colors.border,
        marginVertical: spacing.sm,
    },

    // ─── Icon Badge ──────────────────────────────────────────────────────────────
    /** Circular icon container (e.g. modal icon, avatar) */
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
});
