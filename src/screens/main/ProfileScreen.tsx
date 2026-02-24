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
import { BackButton, AppModal } from '../../components';
import {
    colors, typography, spacing, radii, ENDPOINTS, borderWidths
} from '../../constants';
import { globalStyles } from '../../styles';
import { notificationService } from '../../services/NotificationService';
import api from '../../services/api';
import { MainStackParamList } from '../../navigation/MainTabNavigator';
import { useAppDispatch } from '../../store/hooks';
import { clearFinancialData } from '../../store/slices/financialDataSlice';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
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
                    data: { fcm_token: fcmToken }
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
            })
        );
    };

    // Get initials for avatar
    const getInitials = () => {
        if (!userName) return '👤';
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
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarText}>{getInitials()}</Text>
                    </View>
                    <Text style={styles.userName}>{userName || 'User'}</Text>
                    <Text style={styles.userEmail}>{userEmail || ''}</Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('PersonalInfo' as never)}
                    >
                        <Text style={styles.menuIcon}>👤</Text>
                        <Text style={styles.menuText}>Personal Information</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuIcon}>🏦</Text>
                        <Text style={styles.menuText}>Linked Accounts</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('NotificationSettings' as never)}
                    >
                        <Text style={styles.menuIcon}>⚙️</Text>
                        <Text style={styles.menuText}>Notification Settings</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('PrivacySecurity' as never)}
                    >
                        <Text style={styles.menuIcon}>🔒</Text>
                        <Text style={styles.menuText}>Privacy & Security</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('HelpSupport' as never)}
                    >
                        <Text style={styles.menuIcon}>❓</Text>
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => setLogoutModalVisible(true)}
                >
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Finova AI v1.0.0</Text>
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
        color: colors.textPrimary,
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
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatarText: {
        fontSize: 36,
    },
    userName: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.semibold,
        marginBottom: spacing.xs,
    },
    userEmail: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
    },
    menuSection: {
        backgroundColor: colors.cardBackground,
        borderRadius: radii.lg,
        marginBottom: spacing.lg,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: borderWidths.hairline,
        borderBottomColor: colors.border,
    },
    menuIcon: {
        fontSize: 20,
        marginRight: spacing.md,
    },
    menuText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        flex: 1,
    },
    menuArrow: {
        color: colors.textMuted,
        fontSize: 20,
    },
    logoutButton: {
        backgroundColor: colors.cardBackground,
        borderRadius: radii.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderWidth: borderWidths.thin,
        borderColor: colors.danger,
        marginBottom: spacing.lg,
    },
    logoutText: {
        color: colors.danger,
        fontSize: typography.body,
        fontWeight: typography.medium,
    },
    version: {
        color: colors.textMuted,
        fontSize: typography.caption,
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    modalContainer: {
        backgroundColor: colors.cardBackground,
        borderRadius: 20,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
    },
    modalIconContainer: {
        width: 60,
        height: 60,
        borderRadius: radii.full,
        backgroundColor: colors.dangerSubtle,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    modalIcon: {
        fontSize: 28,
    },
    modalTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.bold,
        marginBottom: spacing.sm,
    },
    modalMessage: {
        color: colors.textSecondary,
        fontSize: typography.body,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: spacing.sm,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: colors.inputBackground,
        borderRadius: radii.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    modalCancelText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.medium,
    },
    modalLogoutButton: {
        flex: 1,
        backgroundColor: colors.danger,
        borderRadius: radii.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    modalLogoutText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.medium,
    },
});
