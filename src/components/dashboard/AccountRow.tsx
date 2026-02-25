import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Badge, BadgeVariant} from '../Badge';
import {IconCircle} from '../IconCircle';
import {radii, typography, spacing} from '../../constants/theme';
import { useThemeColors } from "../../context/ThemeContext";

export interface AccountRowProps {
  icon: string;
  name: string;
  subtitle?: string;
  amount: string;
  badge?: string;
  /** Use a BadgeVariant key ('success' | 'warning' | 'danger' | …) or a raw hex colour */
  badgeVariant?: BadgeVariant;
  /** @deprecated Use badgeVariant instead. Still accepted for backwards compat. */
  badgeColor?: string;
}

export const AccountRow: React.FC<AccountRowProps> = ({
  icon,
  name,
  subtitle,
  amount,
  badge,
  badgeVariant,
  badgeColor,
}) => {
    const colors = useThemeColors();
  // Resolve variant from legacy badgeColor if badgeVariant is not provided
  const resolvedVariant: BadgeVariant | undefined =
    badgeVariant ?? resolveLegacyColor(badgeColor);

  return (
    <View style={styles.row}>
      <IconCircle
        emoji={icon}
        size={40}
        radius="sm"
        style={styles.iconMargin}
      />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{name}</Text>
          {badge && (
            <Badge
              label={badge}
              variant={resolvedVariant ?? 'neutral'}
              color={resolvedVariant ? undefined : badgeColor}
              style={styles.badge}
            />
          )}
        </View>
        {subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
      </View>
      <Text style={[styles.amount, { color: colors.textPrimary }]}>{amount}</Text>
    </View>
  );
};

/** Maps the legacy green/red/amber hex badge colours to semantic variants */
function resolveLegacyColor(color?: string): BadgeVariant | undefined {
  if (!color) {
    return undefined;
  }
  if (color === '#22c55e') {
    return 'success';
  }
  if (color === '#ef4444') {
    return 'danger';
  }
  if (color === '#f59e0b') {
    return 'warning';
  }
  if (color === '#3b82f6') {
    return 'info';
  }
  return undefined;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  iconMargin: {
    marginRight: spacing.sm,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    fontSize: typography.bodySmall,
    fontWeight: typography.medium,
  },
  badge: {
    marginLeft: 4,
  },
  subtitle: {
    fontSize: typography.caption,
    marginTop: 2,
  },
  amount: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
});
