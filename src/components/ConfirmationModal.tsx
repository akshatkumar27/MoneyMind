import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import { colors, typography, spacing, radii, borderWidths
} from '../constants';

import { ConfirmationModalProps } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');



export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'info',
    showCancelButton = true,
}) => {
    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: '✅',
                    iconBg: colors.successSubtle,
                    confirmBg: colors.success,
                };
            case 'error':
                return {
                    icon: '❌',
                    iconBg: colors.dangerSubtle,
                    confirmBg: colors.danger,
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    iconBg: colors.warningSubtle,
                    confirmBg: colors.warning,
                };
            default:
                return {
                    icon: '💡',
                    iconBg: colors.infoSubtle,
                    confirmBg: colors.info,
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            {/* Icon */}
                            <View style={[styles.iconContainer, { backgroundColor: typeStyles.iconBg }]}>
                                <Text style={styles.icon}>{typeStyles.icon}</Text>
                            </View>

                            {/* Title */}
                            <Text style={styles.title}>{title}</Text>

                            {/* Message */}
                            <Text style={styles.message}>{message}</Text>

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                {showCancelButton && (
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={onCancel}
                                    >
                                        <Text style={styles.cancelButtonText}>{cancelText}</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={[
                                        styles.confirmButton,
                                        { backgroundColor: typeStyles.confirmBg },
                                        !showCancelButton && styles.fullWidthButton,
                                    ]}
                                    onPress={onConfirm}
                                >
                                    <Text style={styles.confirmButtonText}>{confirmText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    modalContainer: {
        width: SCREEN_WIDTH - spacing.xl * 2,
        backgroundColor: colors.cardBackground,
        borderRadius: 20,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: borderWidths.thin,
        borderColor: colors.border,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: radii.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    icon: {
        fontSize: 32,
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.bold,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    message: {
        color: colors.textSecondary,
        fontSize: typography.body,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: spacing.sm,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: colors.inputBackground,
        paddingVertical: spacing.md,
        borderRadius: radii.md,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: radii.md,
        alignItems: 'center',
    },
    fullWidthButton: {
        flex: 1,
    },
    confirmButtonText: {
        color: colors.background,
        fontSize: typography.body,
        fontWeight: typography.bold,
    },
});
