import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { notificationService } from '../../services/NotificationService';
import api from '../../services/api';
import { MainStackParamList } from '../../navigation/MainTabNavigator';
import { useAppDispatch } from '../../store/hooks';
import { clearFinancialData } from '../../store/slices/financialDataSlice';
import { BackButton } from '../../components/BackButton';
import { AppModal } from '../../components/AppModal';
import {
  typography,
  spacing,
  radii,
  borderWidths,
} from '../../constants/theme';
import { ENDPOINTS } from '../../constants/endpoints';
import { useGlobalStyles } from '../../styles/globalStyles';
import { STORAGE_KEYS } from '../../constants/storage';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../constants/theme';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { colors, themeMode, setThemeMode } = useTheme();

  // Use dynamic global styles
  const globalStyles = useGlobalStyles();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name || '');
        setUserEmail(user.email || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    try {
      // Deregister FCM Token
      const fcmToken = await notificationService.getFCMToken();
      if (fcmToken) {
        await api.delete(ENDPOINTS.NOTIFICATIONS.UNREGISTER_TOKEN, {
          data: { fcm_token: fcmToken },
        });
      }

      // Call logout API
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
    }
    // Clear all local data from AsyncStorage
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing local data:', error);
    }

    // Clear global state
    dispatch(clearFinancialData());

    // Reset navigation to Auth screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      }),
    );
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!userName) {
      return '👤';
    }
    const parts = userName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <AppModal
        visible={logoutModalVisible}
        type="warning"
        customIcon="👋"
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        cancelText="Cancel"
        showCancelButton
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[styles.avatarLarge, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>{userName || 'User'}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail || ''}</Text>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate('PersonalInfo' as never)}>
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>Personal Information</Text>
            <Text style={[styles.menuArrow, { color: colors.textMuted }]}>›</Text>
          </TouchableOpacity>

          {/* Theme Toggle Section */}
          <View style={[styles.menuItem, { borderBottomColor: colors.border, flexDirection: 'column', alignItems: 'flex-start', paddingVertical: spacing.lg }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
              <Text style={styles.menuIcon}>🎨</Text>
              <Text style={[styles.menuText, { color: colors.textPrimary }]}>App Theme</Text>
            </View>

            <View style={styles.themeToggleContainer}>
              {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: themeMode === mode ? colors.primarySubtle : colors.inputBackground,
                      borderColor: themeMode === mode ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setThemeMode(mode)}
                >
                  <Text style={[
                    styles.themeOptionText,
                    {
                      color: themeMode === mode ? colors.primary : colors.textSecondary,
                      fontWeight: themeMode === mode ? typography.bold : typography.medium,
                    }
                  ]}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuIcon}>🏦</Text>
                        <Text style={styles.menuText}>Linked Accounts</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() =>
              navigation.navigate('NotificationSettings' as never)
            }>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>Notification Settings</Text>
            <Text style={[styles.menuArrow, { color: colors.textMuted }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate('PrivacySecurity' as never)}>
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>Privacy & Security</Text>
            <Text style={[styles.menuArrow, { color: colors.textMuted }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate('HelpSupport' as never)}>
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={[styles.menuText, { color: colors.textPrimary }]}>Help & Support</Text>
            <Text style={[styles.menuArrow, { color: colors.textMuted }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.cardBackground, borderColor: colors.danger }]}
          onPress={() => setLogoutModalVisible(true)}>
          <Text style={[styles.logoutText, { color: colors.danger }]}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textMuted }]}>Finova AI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.h3,
    fontWeight: typography.bold,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 36,
  },
  userName: {
    fontSize: typography.h3,
    fontWeight: typography.semibold,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.bodySmall,
  },
  menuSection: {
    borderRadius: radii.lg,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: borderWidths.hairline,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.xs,
  },
  themeOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOptionText: {
    fontSize: typography.bodySmall,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  menuText: {
    fontSize: typography.body,
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
  },
  logoutButton: {
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: borderWidths.thin,
    marginBottom: spacing.lg,
  },
  logoutText: {
    fontSize: typography.body,
    fontWeight: typography.medium,
  },
  version: {
    fontSize: typography.caption,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
});
