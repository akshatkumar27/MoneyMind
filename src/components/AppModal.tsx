import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {AppModalProps} from './types';
import {
  colors,
  typography,
  spacing,
  radii,
  borderWidths,
} from '../constants/theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

/** Resolves the icon emoji and confirm-button background colour for each type. */
function getTypeConfig(
  type: AppModalProps['type'],
  confirmVariant: AppModalProps['confirmVariant'],
) {
  const base = (() => {
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
      case 'danger':
        return {
          icon: '🗑️',
          iconBg: colors.dangerSubtle,
          confirmBg: colors.danger,
        };
      default: // 'info'
        return {icon: '💡', iconBg: colors.infoSubtle, confirmBg: colors.info};
    }
  })();

  // Allow callers to force a different button colour without changing the icon.
  if (confirmVariant === 'danger') {
    base.confirmBg = colors.danger;
  }
  if (confirmVariant === 'primary') {
    base.confirmBg = colors.primary;
  }

  return base;
}

/**
 * `AppModal` — the single, unified modal for the whole app.
 *
 * Usage patterns:
 *
 * 1. Simple alert / confirmation (no cancel button):
 *    <AppModal visible type="success" title="Done!" message="..." onConfirm={close} onCancel={close} />
 *
 * 2. Destructive confirmation with loading:
 *    <AppModal visible type="danger" title="Delete" message="..." confirmLoading={isDeleting}
 *              onConfirm={doDelete} onCancel={close} showCancelButton />
 *
 * 3. Form modal (children slot):
 *    <AppModal visible title="Edit amount" onConfirm={save} onCancel={close} showCancelButton
 *              confirmText="Save" confirmLoading={isSaving}>
 *        <TextInput ... />
 *    </AppModal>
 */
export const AppModal: React.FC<AppModalProps> = ({
  visible,
  title,
  message,
  subtitle,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'info',
  confirmVariant,
  customIcon,
  showCancelButton = false,
  confirmLoading = false,
  children,
}) => {
  const cfg = getTypeConfig(type, confirmVariant);
  const iconEmoji = customIcon ?? cfg.icon;
  const showIconRow = !children; // hide the icon section when using the form slot

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* Icon — only shown for alert/confirm modals */}
              {showIconRow && (
                <View
                  style={[styles.iconContainer, {backgroundColor: cfg.iconBg}]}>
                  <Text style={styles.iconEmoji}>{iconEmoji}</Text>
                </View>
              )}

              {/* Title */}
              <Text
                style={[styles.title, children ? styles.titleForm : undefined]}>
                {title}
              </Text>

              {/* Subtitle (optional) */}
              {subtitle ? (
                <Text style={styles.subtitle}>{subtitle}</Text>
              ) : null}

              {/* Message (optional) */}
              {message ? <Text style={styles.message}>{message}</Text> : null}

              {/* Form slot */}
              {children ? (
                <View style={styles.childrenContainer}>{children}</View>
              ) : null}

              {/* Action buttons */}
              <View style={styles.buttonRow}>
                {showCancelButton && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                    disabled={confirmLoading}>
                    <Text style={styles.cancelText}>{cancelText}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    {backgroundColor: cfg.confirmBg},
                    !showCancelButton && styles.fullWidth,
                  ]}
                  onPress={onConfirm}
                  disabled={confirmLoading}>
                  {confirmLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.textPrimary}
                    />
                  ) : (
                    <Text style={styles.confirmText}>{confirmText}</Text>
                  )}
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
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: SCREEN_WIDTH - spacing.xl * 2,
    backgroundColor: colors.cardBackground,
    borderRadius: radii.xl,
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
  iconEmoji: {
    fontSize: 32,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: typography.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  titleForm: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  childrenContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  buttonRow: {
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
  cancelText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    flex: 1,
  },
  confirmText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: typography.bold,
  },
});
