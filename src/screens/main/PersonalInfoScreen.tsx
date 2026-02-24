import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { BackButton, Header, AppModal } from '../../components';
import {
    colors, typography, spacing, radii, ENDPOINTS, borderWidths
} from '../../constants';
import { globalStyles } from '../../styles';
import { formatCurrency } from '../../utils';
import { api } from '../../services/api';
import { notificationService } from '../../services/NotificationService';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearFinancialData } from '../../store/slices/financialDataSlice';

interface UserData {
    name?: string;
    email?: string;
    age?: string;
}

interface OnboardingData {
    monthly_income?: number;
    monthly_expenses?: number;
    monthly_emi?: number;
    emi_outstanding?: number;
    monthly_investment?: number;
}

export const PersonalInfoScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<UserData>({});
    const [isLoading, setIsLoading] = useState(true);


    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const financialData = useAppSelector(state => state.financialData);

    // Navigation focus listener to reload data
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) setUser(JSON.parse(userData));
        } catch (error) {
            console.error('Error loading personal info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        setDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            // Deregister FCM Token
            const fcmToken = await notificationService.getFCMToken();
            if (fcmToken) {
                await api.delete(ENDPOINTS.NOTIFICATIONS.UNREGISTER_TOKEN, {
                    data: { fcm_token: fcmToken }
                });
            }

            await api.post(ENDPOINTS.USER.DELETE);
            await AsyncStorage.clear();
            dispatch(clearFinancialData());
            setDeleteModalVisible(false);
            Toast.show({
                type: 'success',
                text1: 'Account Deleted',
                text2: 'Your account has been deleted successfully.',
            });
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                })
            );
        } catch (error) {
            console.error('Error deleting account:', error);
            setIsDeleting(false);
            setDeleteModalVisible(false);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete account. Please try again.',
            });
        }
    };

    const handleEditFinancials = () => {
        navigation.navigate('EditFinancialDetails');
    };

    const infoItems = [
        { icon: '👤', label: 'Full Name', value: user.name || '—' },
        { icon: '📧', label: 'Email', value: user.email || '—' },
        { icon: '🎂', label: 'Age', value: user.age ? `${user.age} years` : '—' },
    ];

    const financialItems = [
        { icon: '💰', label: 'Monthly Income', value: financialData.monthlyIncome ? formatCurrency(financialData.monthlyIncome) : '—' },
        { icon: '🛒', label: 'Monthly Expenses', value: financialData.monthlyExpenses ? formatCurrency(financialData.monthlyExpenses) : '—' },
        { icon: '🏦', label: 'Monthly EMI', value: financialData.monthlyEmi ? formatCurrency(financialData.monthlyEmi) : '—' },
        { icon: '📋', label: 'EMI Outstanding', value: financialData.emiOutstanding ? formatCurrency(financialData.emiOutstanding) : '—' },
        { icon: '📈', label: 'Monthly Investment', value: financialData.monthlyInvestment ? formatCurrency(financialData.monthlyInvestment) : '—' },
    ];

    if (isLoading) {
        return (
            <SafeAreaView style={globalStyles.container}>
                <StatusBar barStyle="light-content" backgroundColor={colors.background} />
                <View style={globalStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <Header title="Personal Information" />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <Text style={globalStyles.sectionLabel}>Account Details</Text>
                <View style={styles.card}>
                    {infoItems.map((item, index) => (
                        <View
                            key={item.label}
                            style={[styles.infoRow, index < infoItems.length - 1 && styles.infoRowBorder]}
                        >
                            <View style={styles.infoLeft}>
                                <Text style={styles.infoIcon}>{item.icon}</Text>
                                <Text style={styles.infoLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text style={styles.infoValue}>{item.value}</Text>
                                {(item as any).onEdit && (
                                    <TouchableOpacity
                                        style={styles.editButtonSmall}
                                        onPress={(item as any).onEdit}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.editIconSmall}>✏️</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Financial Section */}
                <View style={globalStyles.sectionHeader}>
                    <Text style={globalStyles.sectionLabel}>Financial Details</Text>
                    <TouchableOpacity onPress={handleEditFinancials}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.card}>
                    {financialItems.map((item, index) => (
                        <View
                            key={item.label}
                            style={[styles.infoRow, index < financialItems.length - 1 && styles.infoRowBorder]}
                        >
                            <View style={styles.infoLeft}>
                                <Text style={styles.infoIcon}>{item.icon}</Text>
                                <Text style={styles.infoLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text style={styles.infoValue}>{item.value}</Text>
                                {(item as any).onEdit && (
                                    <TouchableOpacity
                                        style={styles.editButtonSmall}
                                        onPress={(item as any).onEdit}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.editIconSmall}>✏️</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.footerNote}>
                </Text>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                </TouchableOpacity>
            </ScrollView>

            <AppModal
                visible={deleteModalVisible}
                type="danger"
                title="Delete Account"
                message="Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost."
                confirmText="Delete"
                cancelText="Cancel"
                showCancelButton
                confirmLoading={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModalVisible(false)}
            />



        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    editButtonText: {
        color: colors.primary,
        fontSize: typography.body,
        fontWeight: '600',
    },
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: radii.lg,
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    infoRowBorder: {
        borderBottomWidth: borderWidths.hairline,
        borderBottomColor: colors.border,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        fontSize: 18,
        marginRight: spacing.md,
    },
    infoLabel: {
        color: colors.textSecondary,
        fontSize: typography.body,
    },
    infoValue: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },
    footerNote: {
        color: colors.textMuted,
        fontSize: typography.caption,
        textAlign: 'center',
        marginVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
    },
    deleteButton: {
        backgroundColor: colors.dangerSubtle,
        marginHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radii.md,
        alignItems: 'center',
        marginBottom: spacing.xxl,
        borderWidth: borderWidths.thin,
        borderColor: colors.danger,
    },
    deleteButtonText: {
        color: colors.danger,
        fontSize: typography.body,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    modalContainer: {
        backgroundColor: colors.cardBackground,
        borderRadius: radii.xl,
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
        gap: spacing.sm, // Note: gap might require newer React Native, but user seems to be using it
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
    modalDeleteButton: {
        flex: 1,
        backgroundColor: colors.danger,
        borderRadius: radii.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    modalDeleteText: {
        color: '#ffffff',
        fontSize: typography.body,
        fontWeight: 'bold',
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButtonSmall: {
        marginLeft: spacing.sm,
        padding: 4,
        backgroundColor: colors.inputBackground,
        borderRadius: radii.sm,
    },
    editIconSmall: {
        fontSize: 14,
    },
});
