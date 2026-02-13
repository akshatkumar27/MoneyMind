import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../constants';
import { MainStackParamList } from '../../navigation/MainTabNavigator';
import { BackButton, ConfirmationModal } from '../../components';
import api from '../../services/api';
import { formatCurrency } from '../../utils';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type ContributionsRouteProp = RouteProp<MainStackParamList, 'Contributions'>;

interface ContributionItem {
    id: string;
    paymentNumber: number;
    amount: number;
    totalValue: number;
    status: 'paid' | 'pending' | 'upcoming';
    date: string;
    monthKey?: string; // e.g. "Feb 2026"
    rawDate?: string; // Original date string for comparison
}

interface ModalState {
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    showCancelButton: boolean;
    onConfirm: () => void;
}

export const ContributionsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ContributionsRouteProp>();

    const goalId = route.params?.goalId || '';
    const goalName = route.params?.goalName || 'Goal';
    const monthlyContribution = route.params?.monthlyContribution || 0;
    const targetAmount = route.params?.targetAmount || 0;
    const achieveInMonths = route.params?.achieveInMonths || 12;
    const goalCreatedAt = route.params?.goalCreatedAt || '';

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [contributions, setContributions] = useState<ContributionItem[]>([]);
    const [totalPaid, setTotalPaid] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContribution, setEditedContribution] = useState(monthlyContribution);
    const [modalState, setModalState] = useState<ModalState>({
        visible: false,
        type: 'info',
        title: '',
        message: '',
        showCancelButton: true,
        onConfirm: () => { },
    });

    const STEP_AMOUNT = 500;
    const MIN_CONTRIBUTION = 500;

    // Recalculate months when contribution changes
    const effectiveMonths = editedContribution > 0
        ? Math.ceil(targetAmount / editedContribution)
        : achieveInMonths;

    const handleContributionInputChange = (text: string) => {
        const value = parseInt(text.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(value)) {
            // Clamp: can't exceed original, can't go below MIN
            setEditedContribution(Math.max(MIN_CONTRIBUTION, Math.min(value, monthlyContribution)));
        } else if (text === '') {
            setEditedContribution(0);
        }
    };

    const handleContributionBlur = () => {
        if (editedContribution < MIN_CONTRIBUTION) {
            setEditedContribution(MIN_CONTRIBUTION);
        }
    };

    const handleConfirmContribution = () => {
        if (editedContribution < MIN_CONTRIBUTION) {
            setEditedContribution(MIN_CONTRIBUTION);
        }
        setIsEditing(false);
    };

    // Fetch contributions from API
    useFocusEffect(
        useCallback(() => {
            fetchContributions();
        }, [goalId])
    );

    const fetchContributions = async () => {
        try {
            setIsLoading(true);
            const response = await api.post('/api/contributions/list', {
                goal_id: goalId,
            });
            console.log(response.data);

            // Store total paid from API
            const apiTotal = parseFloat(response.data.total) || 0;
            setTotalPaid(apiTotal);

            // Each paid contribution is its own row
            const rawContributions = response.data.contributions || [];

            // Sort by date ascending
            const sortedContributions = [...rawContributions].sort((a: any, b: any) =>
                new Date(a.contributed_at).getTime() - new Date(b.contributed_at).getTime()
            );

            let runningTotal = 0;
            const paidContributions: ContributionItem[] = sortedContributions.map((item: any, index: number) => {
                const amount = parseFloat(item.amount) || 0;
                runningTotal += amount;
                const date = new Date(item.contributed_at);
                const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                return {
                    id: item.id || `paid-${index + 1}`,
                    paymentNumber: index + 1,
                    amount: amount,
                    totalValue: runningTotal,
                    status: 'paid' as const,
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    monthKey: monthKey,
                    rawDate: item.contributed_at || '',
                };
            });

            // Calculate remaining upcoming contributions
            const paidCount = paidContributions.length;
            const remainingCount = Math.max(0, achieveInMonths - paidCount);

            // Use last paid date as base for upcoming dates
            const lastPaidDate = paidCount > 0
                ? new Date(paidContributions[paidCount - 1].rawDate || new Date())
                : new Date();

            const upcomingContributions: ContributionItem[] = Array.from({ length: remainingCount }, (_, index) => {
                const paymentNum = paidCount + index + 1;
                const upcomingDate = new Date(lastPaidDate);
                upcomingDate.setMonth(upcomingDate.getMonth() + index + 1);
                const formattedDate = upcomingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const monthKey = upcomingDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                return {
                    id: `upcoming-${paymentNum}`,
                    paymentNumber: paymentNum,
                    amount: editedContribution,
                    totalValue: apiTotal + (editedContribution * (index + 1)),
                    status: index === 0 ? 'pending' as const : 'upcoming' as const,
                    date: formattedDate,
                    monthKey: monthKey,
                };
            });

            // Combine paid + upcoming
            setContributions([...paidContributions, ...upcomingContributions]);
        } catch (error) {
            console.error('Failed to fetch contributions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    function getNextPaymentDate(monthsAhead: number): string {
        const date = new Date();
        date.setMonth(date.getMonth() + monthsAhead);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Calculate days until next payment based on goal creation date
    const calculateDaysUntilPayment = (): number => {
        const today = new Date();

        // Parse goal creation date
        const createdDate = goalCreatedAt ? new Date(goalCreatedAt) : new Date();
        const paymentDay = createdDate.getDate(); // Day of month when goal was created

        // Find next payment date (same day next month)
        let nextPaymentDate = new Date(today.getFullYear(), today.getMonth(), paymentDay);

        // If today is past the payment day this month, move to next month
        if (today.getDate() >= paymentDay) {
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        }

        // Calculate difference in days
        const diffTime = nextPaymentDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    // Check if payment is enabled (on payment day or if missed this month)
    const getPaymentStatus = (): { enabled: boolean; hasPaidThisMonth: boolean } => {
        const today = new Date();
        const createdDate = goalCreatedAt ? new Date(goalCreatedAt) : new Date();
        const paymentDay = createdDate.getDate();

        // Check if today is on or after the payment day for this month
        const isOnOrAfterPaymentDay = today.getDate() >= paymentDay;

        // Check if payment was already made this month using rawDate
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const paidContributions = contributions.filter(c => c.status === 'paid');

        const hasPaidThisMonth = paidContributions.some(c => {
            if (!c.rawDate) return false;
            const paidDate = new Date(c.rawDate);
            return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
        });

        // Button is enabled if we're on/after payment day AND haven't paid this month
        return { enabled: isOnOrAfterPaymentDay && !hasPaidThisMonth, hasPaidThisMonth };
    };

    const upcomingPayment = contributions.find(c => c.status === 'pending') || contributions.find(c => c.status === 'upcoming');
    const daysUntilPayment = calculateDaysUntilPayment();
    const { enabled: paymentEnabled, hasPaidThisMonth } = getPaymentStatus();


    const closeModal = () => {
        setModalState(prev => ({ ...prev, visible: false }));
    };

    const handleSaveContribution = () => {
        setModalState({
            visible: true,
            type: 'warning',
            title: 'Confirm Savings',
            message: `Are you sure you want to save ${formatCurrency(editedContribution)} towards your "${goalName}" goal?`,
            showCancelButton: true,
            onConfirm: saveContribution,
        });
    };

    const saveContribution = async () => {
        closeModal();
        try {
            setIsSaving(true);
            await api.post('/api/contributions', {
                goal_id: goalId,
                amount: editedContribution,
                note: 'Monthly savings deposit',
            });
            // Refresh contributions list to update button state
            await fetchContributions();
            setModalState({
                visible: true,
                type: 'success',
                title: 'Success!',
                message: 'Your contribution has been saved successfully!',
                showCancelButton: false,
                onConfirm: closeModal,
            });
        } catch (error) {
            console.error('Failed to save contribution:', error);
            setModalState({
                visible: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save contribution. Please try again.',
                showCancelButton: false,
                onConfirm: closeModal,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const renderContributionItem = ({ item }: { item: ContributionItem }) => {
        const getStatusMark = () => {
            switch (item.status) {
                case 'paid':
                    return '✓';
                case 'pending':
                    return '⏰';
                default:
                    return '○';
            }
        };

        return (
            <View style={styles.contributionItem}>
                <View style={styles.contributionLeft}>
                    <View style={[
                        styles.paymentIndicator,
                        item.status === 'paid' && styles.paidIndicator,
                        item.status === 'pending' && styles.pendingIndicator,
                    ]}>
                        <Text style={[
                            styles.paymentNumber,
                            item.status === 'paid' && styles.paidText,
                        ]}>{getStatusMark()}</Text>
                    </View>
                    <View style={styles.contributionDetails}>
                        <Text style={styles.contributionLabel}>{item.monthKey || item.date}</Text>
                        <Text style={styles.contributionDate}>
                            {item.status === 'paid' ? 'Paid' : item.date}
                        </Text>
                    </View>
                </View>
                <View style={styles.contributionRight}>
                    <Text style={styles.contributionAmount}>{formatCurrency(item.amount)}</Text>
                    <Text style={styles.totalValue}>Total: {formatCurrency(item.totalValue)}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Confirmation Modal */}
            <ConfirmationModal
                visible={modalState.visible}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                showCancelButton={modalState.showCancelButton}
                confirmText={modalState.showCancelButton ? 'Yes' : 'OK'}
                cancelText="No"
                onConfirm={modalState.onConfirm}
                onCancel={closeModal}
            />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>{goalName}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Payment Card - Dynamic based on paid state */}
                <View style={styles.upcomingCard}>
                    {hasPaidThisMonth ? (
                        <>
                            {/* Already paid this month */}
                            <View style={styles.upcomingHeader}>
                                <View style={[styles.timerBadge, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
                                    <Text style={styles.timerIcon}>✅</Text>
                                    <Text style={[styles.timerText, { color: '#22c55e' }]}>Paid</Text>
                                </View>
                            </View>

                            <Text style={styles.upcomingLabel}>Last Payment</Text>
                            <Text style={styles.upcomingAmount}>
                                {formatCurrency(contributions.filter(c => c.status === 'paid').slice(-1)[0]?.amount || editedContribution)}
                            </Text>
                            <Text style={styles.upcomingDate}>
                                {contributions.filter(c => c.status === 'paid').slice(-1)[0]?.date || ''}
                            </Text>

                            {/* Next upcoming payment info */}
                            {upcomingPayment && (
                                <View style={styles.nextPaymentInfo}>
                                    <Text style={styles.nextPaymentLabel}>Upcoming Payment</Text>
                                    <Text style={styles.nextPaymentAmount}>{formatCurrency(editedContribution)}</Text>
                                    <Text style={styles.nextPaymentDate}>Due: {upcomingPayment.date}</Text>
                                </View>
                            )}

                            <TouchableOpacity
                                style={[styles.payButton, styles.payButtonDisabled]}
                                disabled={true}
                            >
                                <Text style={styles.payButtonText}>Already Paid</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {/* Not yet paid this month */}
                            <View style={styles.upcomingHeader}>
                                <View style={styles.timerBadge}>
                                    <Text style={styles.timerIcon}>⏰</Text>
                                    <Text style={styles.timerText}>{daysUntilPayment} days left</Text>
                                </View>
                            </View>

                            <Text style={styles.upcomingLabel}>Upcoming Payment</Text>
                            <TouchableOpacity
                                style={styles.editableAmount}
                                onPress={() => setIsEditing(!isEditing)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.upcomingAmount}>{formatCurrency(editedContribution)}</Text>
                                <Text style={styles.editIcon}>✏️</Text>
                            </TouchableOpacity>
                            <Text style={styles.upcomingDate}>Due: {upcomingPayment?.date}</Text>

                            {/* Inline contribution editor */}
                            {isEditing && (
                                <View style={styles.editorContainer}>
                                    <Text style={styles.editorTitle}>Adjust Monthly Contribution</Text>

                                    <View style={styles.contributionInputContainer}>
                                        <Text style={styles.currencyPrefix}>₹</Text>
                                        <TextInput
                                            style={styles.contributionInput}
                                            value={editedContribution > 0 ? editedContribution.toString() : ''}
                                            onChangeText={handleContributionInputChange}
                                            onBlur={handleContributionBlur}
                                            keyboardType="number-pad"
                                            selectTextOnFocus
                                            autoFocus
                                        />
                                    </View>

                                    <View style={styles.editorInfo}>
                                        <Text style={styles.editorInfoText}>
                                            Goal achieved in{' '}
                                            <Text style={styles.editorHighlight}>{effectiveMonths} months</Text>
                                        </Text>
                                        {editedContribution < monthlyContribution && (
                                            <Text style={styles.editorHint}>
                                                Original: {formatCurrency(monthlyContribution)}/mo ({achieveInMonths} months)
                                            </Text>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        style={styles.confirmButton}
                                        onPress={handleConfirmContribution}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.confirmButtonText}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <TouchableOpacity
                                style={[styles.payButton, (!paymentEnabled || isSaving) && styles.payButtonDisabled]}
                                onPress={handleSaveContribution}
                                disabled={!paymentEnabled || isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color={colors.background} />
                                ) : (
                                    <Text style={styles.payButtonText}>
                                        {paymentEnabled ? 'Save Now' : 'Not Due Yet'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Progress Summary */}
                <View style={styles.summaryCard}>
                    {/* Progress Bar */}
                    <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Progress</Text>
                            <Text style={styles.progressPercent}>
                                {targetAmount > 0 ? Math.min(100, Math.round((totalPaid / targetAmount) * 100)) : 0}%
                            </Text>
                        </View>
                        <View style={styles.progressBarBackground}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${targetAmount > 0 ? Math.min(100, (totalPaid / targetAmount) * 100) : 0}%` },
                                ]}
                            />
                        </View>
                        <View style={styles.progressAmounts}>
                            <Text style={styles.progressSaved}>{formatCurrency(totalPaid)} saved</Text>
                            <Text style={styles.progressTarget}>of {formatCurrency(targetAmount)}</Text>
                        </View>
                    </View>

                    <View style={styles.summaryDividerHorizontal} />

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{formatCurrency(targetAmount)}</Text>
                            <Text style={styles.summaryLabel}>Target</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, editedContribution !== monthlyContribution && styles.editedValue]}>
                                {effectiveMonths}
                            </Text>
                            <Text style={styles.summaryLabel}>Months</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, editedContribution !== monthlyContribution && styles.editedValue]}>
                                {formatCurrency(editedContribution)}
                            </Text>
                            <Text style={styles.summaryLabel}>Monthly</Text>
                        </View>
                    </View>
                </View>

                {/* Contributions List */}
                <View style={styles.listSection}>
                    <Text style={styles.sectionTitle}>Payment Schedule</Text>

                    {contributions.map((item) => (
                        <View key={item.id}>
                            {renderContributionItem({ item })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    headerTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.semibold,
        flex: 1,
        marginLeft: spacing.md,
    },
    headerSpacer: {
        width: 36,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    upcomingCard: {
        backgroundColor: '#1a2a3a',
        borderRadius: 20,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: '#2a4a6a',
        alignItems: 'center',
    },
    upcomingHeader: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: spacing.md,
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
    },
    timerIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    timerText: {
        color: '#f59e0b',
        fontSize: typography.caption,
        fontWeight: typography.medium,
    },
    upcomingLabel: {
        color: colors.textMuted,
        fontSize: typography.bodySmall,
        marginBottom: spacing.xs,
    },
    upcomingAmount: {
        color: colors.textPrimary,
        fontSize: 36,
        fontWeight: typography.bold,
        marginBottom: spacing.xs,
    },
    upcomingDate: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
        marginBottom: spacing.lg,
    },
    nextPaymentInfo: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: spacing.md,
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    nextPaymentLabel: {
        color: colors.textMuted,
        fontSize: typography.caption,
        marginBottom: spacing.xs,
    },
    nextPaymentAmount: {
        color: colors.primary,
        fontSize: typography.h3,
        fontWeight: typography.bold,
        marginBottom: spacing.xs,
    },
    nextPaymentDate: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
    },
    payButton: {
        backgroundColor: '#22c55e',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl * 2,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    payButtonDisabled: {
        opacity: 0.7,
    },
    payButtonText: {
        color: colors.background,
        fontSize: typography.body,
        fontWeight: typography.bold,
    },
    summaryCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.xl,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
    },
    summaryValue: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.bold,
        marginBottom: 4,
    },
    summaryLabel: {
        color: colors.textMuted,
        fontSize: typography.caption,
    },
    progressSection: {
        marginBottom: spacing.md,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    progressLabel: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
        fontWeight: typography.medium,
    },
    progressPercent: {
        color: colors.primary,
        fontSize: typography.body,
        fontWeight: typography.bold,
    },
    progressBarBackground: {
        height: 10,
        backgroundColor: colors.inputBackground,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#22c55e',
        borderRadius: 5,
    },
    progressAmounts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xs,
    },
    progressSaved: {
        color: '#22c55e',
        fontSize: typography.caption,
        fontWeight: typography.medium,
    },
    progressTarget: {
        color: colors.textMuted,
        fontSize: typography.caption,
    },
    summaryDividerHorizontal: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: spacing.md,
    },
    listSection: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.semibold,
        marginBottom: spacing.md,
    },
    contributionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    contributionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIndicator: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    paidIndicator: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
    },
    pendingIndicator: {
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
    },
    paymentNumber: {
        color: colors.textPrimary,
        fontSize: typography.bodySmall,
        fontWeight: typography.semibold,
    },
    paidText: {
        color: '#22c55e',
    },
    contributionDetails: {
        justifyContent: 'center',
    },
    contributionLabel: {
        color: colors.textPrimary,
        fontSize: typography.bodySmall,
        fontWeight: typography.medium,
    },
    contributionDate: {
        color: colors.textMuted,
        fontSize: typography.caption,
    },
    contributionRight: {
        alignItems: 'flex-end',
    },
    contributionAmount: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },
    totalValue: {
        color: colors.textMuted,
        fontSize: typography.caption,
    },
    // Contribution editor styles
    editableAmount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    editIcon: {
        fontSize: 16,
    },
    editedValue: {
        color: colors.primary,
    },
    editorContainer: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: 'center',
    },
    editorTitle: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
        fontWeight: typography.medium,
        marginBottom: spacing.sm,
    },
    contributionInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.inputBackground,
        borderWidth: 1.5,
        borderColor: colors.primary + '50',
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        // minWidth: 150,
    },
    currencyPrefix: {
        color: colors.primary,
        fontSize: typography.body,
        fontWeight: typography.semibold,
        marginRight: spacing.xs,
    },
    contributionInput: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.bold,
        flex: 1,
        textAlign: 'center',
        paddingVertical: 0,
    },
    editorInfo: {
        marginTop: spacing.sm,
        alignItems: 'center',
    },
    editorInfoText: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
    },
    editorHighlight: {
        color: colors.primary,
        fontWeight: typography.semibold,
    },
    editorHint: {
        color: colors.textMuted,
        fontSize: typography.caption,
        marginTop: spacing.xs,
    },
    confirmButton: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        margin: spacing.md,
        width: '100%',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: colors.background,
        fontSize: typography.body,
        fontWeight: typography.bold,
    },
});
