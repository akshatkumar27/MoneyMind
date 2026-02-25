import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCurrency } from '../../context/CurrencyContext';
import { BackButton } from '../../components/BackButton';
import { Header } from '../../components/Header';
import { typography, spacing, radii } from '../../constants/theme';
import { globalStyles } from '../../styles/globalStyles';
import { useThemeColors } from "../../context/ThemeContext";

interface NotificationItem {
  id: string;
  type: 'suggestion' | 'alert' | 'update' | 'achievement';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'suggestion':
      return '⚡';
    case 'alert':
      return '⚠️';
    case 'update':
      return '✅';
    case 'achievement':
      return '🏆';
    default:
      return '🔔';
  }
};

const getNotificationColor = (type: string, colors: any) => {
  switch (type) {
    case 'suggestion':
      return colors.warning;
    case 'alert':
      return colors.danger;
    case 'update':
      return colors.success;
    case 'achievement':
      return '#8b5cf6';
    default:
      return colors.primary;
  }
};

export const NotificationScreen: React.FC = () => {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { currencySymbol } = useCurrency();

  const NOTIFICATIONS: NotificationItem[] = React.useMemo(
    () => [
      {
        id: '1',
        type: 'suggestion',
        title: 'AI Suggestion',
        description: `Auto-invest ${currencySymbol}2,500 extra to reach your Marriage Fund target by Nov 2025.`,
        time: '2 hours ago',
        isRead: false,
      },
      {
        id: '2',
        type: 'alert',
        title: 'Unusual Spending Detected',
        description: `You spent ${currencySymbol}4,500 on food delivery this week. That's 40% higher than usual.`,
        time: '5 hours ago',
        isRead: false,
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Goal Milestone! 🎉',
        description:
          "You've reached 50% of your Marriage Fund goal. Keep it up!",
        time: 'Yesterday',
        isRead: true,
      },
      {
        id: '4',
        type: 'update',
        title: 'Account Synced',
        description: 'Your HDFC Bank account has been successfully synced.',
        time: 'Yesterday',
        isRead: true,
      },
      {
        id: '5',
        type: 'suggestion',
        title: 'Investment Opportunity',
        description:
          'Based on your risk profile, consider investing in Nifty 50 Index Fund.',
        time: '2 days ago',
        isRead: true,
      },
      {
        id: '6',
        type: 'alert',
        title: 'Bill Reminder',
        description: `Your electricity bill of ${currencySymbol}2,340 is due in 3 days.`,
        time: '3 days ago',
        isRead: true,
      },
    ],
    [currencySymbol],
  );

  const unreadCount = NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <Header
        title="Notifications"
        rightElement={
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() =>
              navigation.navigate('NotificationSettings' as never)
            }>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        }
      />

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: colors.primarySubtle }]}>
          <Text style={[styles.unreadText, { color: colors.primary }]}>
            {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today Section */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>TODAY</Text>
        {NOTIFICATIONS.filter(n => n.time.includes('hour')).map(
          notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.isRead && styles.notificationUnread,
                , { backgroundColor: colors.cardBackground }, { borderLeftColor: colors.primary }]}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor:
                      getNotificationColor(notification.type, colors) + '20',
                  },
                ]}>
                <Text style={styles.icon}>
                  {getNotificationIcon(notification.type)}
                </Text>
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      { color: getNotificationColor(notification.type, colors) },
                    ]}>
                    {notification.title}
                  </Text>
                  {!notification.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.notificationDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                  {notification.description}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.textMuted }]}>{notification.time}</Text>
              </View>
            </TouchableOpacity>
          ),
        )}

        {/* Earlier Section */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>EARLIER</Text>
        {NOTIFICATIONS.filter(n => !n.time.includes('hour')).map(
          notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.isRead && styles.notificationUnread,
                , { backgroundColor: colors.cardBackground }, { borderLeftColor: colors.primary }]}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor:
                      getNotificationColor(notification.type, colors) + '20',
                  },
                ]}>
                <Text style={styles.icon}>
                  {getNotificationIcon(notification.type)}
                </Text>
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      { color: getNotificationColor(notification.type, colors) },
                    ]}>
                    {notification.title}
                  </Text>
                  {!notification.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.notificationDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                  {notification.description}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.textMuted }]}>{notification.time}</Text>
              </View>
            </TouchableOpacity>
          ),
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    paddingHorizontal: spacing.sm,
  },
  settingsIcon: { fontSize: 24 },
  unreadBadge: {
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    marginBottom: spacing.md,
  },
  unreadText: {
    fontSize: typography.caption,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.caption,
    fontWeight: typography.semibold,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  notificationCard: {
    flexDirection: 'row',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  notificationUnread: {
    borderLeftWidth: 3
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: { fontSize: 18 },
  notificationContent: { flex: 1 },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full
  },
  notificationDescription: {
    fontSize: typography.caption,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: typography.caption - 1,
  },
  bottomSpacing: { height: spacing.xxl },
});
