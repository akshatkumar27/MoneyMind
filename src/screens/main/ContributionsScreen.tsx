import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  DeviceEventEmitter,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../navigation/MainTabNavigator';
import api from '../../services/api';
import {useCurrency} from '../../context/CurrencyContext';
import {
  colors,
  typography,
  spacing,
  radii,
  borderWidths,
} from '../../constants/theme';
import {ENDPOINTS} from '../../constants/endpoints';
import {globalStyles} from '../../styles/globalStyles';
import {BackButton} from '../../components/BackButton';
import {ConfirmationModal} from '../../components/ConfirmationModal';
import {AppModal} from '../../components/AppModal';
import {SkeletonLoader} from '../../components/SkeletonLoader';
import {AnimatedMascot} from '../../components/AnimatedMascot';
import {Header} from '../../components/Header';
import {formatCurrency} from '../../utils/formatNumber';

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
  const {currencySymbol} = useCurrency();

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
  const [editedContribution, setEditedContribution] =
    useState(monthlyContribution);
  // State for inline editing of past contributions
  // State for Edit Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedContribution, setSelectedContribution] =
    useState<ContributionItem | null>(null);
  const [editModalValue, setEditModalValue] = useState<string>('');
  const [editError, setEditError] = useState<string>('');
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    showCancelButton: true,
    onConfirm: () => {},
  });

  const STEP_AMOUNT = 500;
  const MIN_CONTRIBUTION = 50;

  // Recalculate months when contribution changes
  const effectiveMonths =
    editedContribution > 0
      ? Math.ceil(targetAmount / editedContribution)
      : achieveInMonths;

  // Compute estimated completion date based on actual remaining amount.
  // This accounts for partial payments — e.g. paying ₹150 when ₹300 is due
  // means the remaining balance is higher, so the goal takes longer.
  const completionDate = (() => {
    const remaining = Math.max(0, targetAmount - totalPaid);
    const monthsLeft =
      editedContribution > 0
        ? Math.ceil(remaining / editedContribution)
        : effectiveMonths;
    const base = new Date();
    base.setMonth(base.getMonth() + monthsLeft);
    return base.toLocaleDateString('en-US', {month: 'short', year: 'numeric'});
  })();

  const handleContributionInputChange = (text: string) => {
    const value = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(value)) {
      // Clamp: can't exceed original, can't go below MIN
      setEditedContribution(
        Math.max(MIN_CONTRIBUTION, Math.min(value, monthlyContribution)),
      );
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
    }, [goalId]),
  );

  const fetchContributions = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(ENDPOINTS.CONTRIBUTIONS.LIST, {
        goal_id: goalId,
      });
      console.log(response.data);

      // Store total paid from API
      const apiTotal = parseFloat(response.data.total) || 0;
      setTotalPaid(apiTotal);

      // Each paid contribution is its own row
      const rawContributions = response.data.contributions || [];

      // Sort by date ascending
      const sortedContributions = [...rawContributions].sort(
        (a: any, b: any) =>
          new Date(a.contributed_at).getTime() -
          new Date(b.contributed_at).getTime(),
      );

      let runningTotal = 0;
      const paidContributions: ContributionItem[] = sortedContributions.map(
        (item: any, index: number) => {
          const amount = parseFloat(item.amount) || 0;
          runningTotal += amount;
          const date = new Date(item.contributed_at);
          const monthKey = date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          });
          return {
            id: item.id || `paid-${index + 1}`,
            paymentNumber: index + 1,
            amount: amount,
            totalValue: runningTotal,
            status: 'paid' as const,
            date: date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            monthKey: monthKey,
            rawDate: item.contributed_at || '',
          };
        },
      );

      // Calculate remaining upcoming contributions
      const paidCount = paidContributions.length;
      const remainingCount = Math.max(0, achieveInMonths - paidCount);

      // Use last paid date as base for upcoming dates
      const lastPaidDate =
        paidCount > 0
          ? new Date(paidContributions[paidCount - 1].rawDate || new Date())
          : new Date();

      const upcomingContributions: ContributionItem[] = Array.from(
        {length: remainingCount},
        (_, index) => {
          const paymentNum = paidCount + index + 1;
          const upcomingDate = new Date(lastPaidDate);

          // If no contributions yet, start from current month (index 0)
          // If contributions exist, start from next month after last payment (index + 1)
          const monthOffset = paidCount === 0 ? index : index + 1;
          upcomingDate.setMonth(upcomingDate.getMonth() + monthOffset);

          const formattedDate = upcomingDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          const monthKey = upcomingDate.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          });
          return {
            id: `upcoming-${paymentNum}`,
            paymentNumber: paymentNum,
            amount: editedContribution,
            totalValue: apiTotal + editedContribution * (index + 1),
            status: index === 0 ? ('pending' as const) : ('upcoming' as const),
            date: formattedDate,
            monthKey: monthKey,
          };
        },
      );

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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Calculate days until next payment based on goal creation date
  const calculateDaysUntilPayment = (): number => {
    const today = new Date();

    // Parse goal creation date
    const createdDate = goalCreatedAt ? new Date(goalCreatedAt) : new Date();
    const paymentDay = createdDate.getDate(); // Day of month when goal was created

    // Find next payment date (same day next month)
    let nextPaymentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      paymentDay,
    );

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
  const getPaymentStatus = (): {
    enabled: boolean;
    hasPaidThisMonth: boolean;
  } => {
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
      if (!c.rawDate) {
        return false;
      }
      const paidDate = new Date(c.rawDate);
      return (
        paidDate.getMonth() === currentMonth &&
        paidDate.getFullYear() === currentYear
      );
    });

    // Button is enabled if we're on/after payment day AND haven't paid this month
    return {
      enabled: isOnOrAfterPaymentDay && !hasPaidThisMonth,
      hasPaidThisMonth,
    };
  };

  const upcomingPayment =
    contributions.find(c => c.status === 'pending') ||
    contributions.find(c => c.status === 'upcoming');
  const daysUntilPayment = calculateDaysUntilPayment();
  const {enabled: paymentEnabled, hasPaidThisMonth} = getPaymentStatus();

  const isCurrentMonth = (dateString?: string) => {
    if (!dateString) {
      return false;
    }
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleOpenEditModal = (item: ContributionItem) => {
    setSelectedContribution(item);
    setEditModalValue(item.amount.toString());
    setEditError('');
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedContribution(null);
    setEditModalValue('');
    setEditError('');
  };

  const handleSaveEdit = async () => {
    if (!selectedContribution) {
      return;
    }

    const newAmount = parseFloat(editModalValue);

    // Validation
    if (isNaN(newAmount)) {
      setEditError('Please enter a valid amount');
      return;
    }

    if (newAmount > monthlyContribution) {
      setEditError(
        `Cannot exceed monthly contribution of ${formatCurrency(
          monthlyContribution,
          currencySymbol,
        )}`,
      );
      return;
    }

    // Call API
    try {
      setIsSaving(true);
      await api.post(ENDPOINTS.CONTRIBUTIONS.UPDATE, {
        contribution_id: selectedContribution.id,
        amount: newAmount,
        note: 'Updated monthly savings',
      });

      // Success & Refresh
      handleCloseEditModal();
      fetchContributions();
      DeviceEventEmitter.emit('refreshGoals');

      setModalState({
        visible: true,
        type: 'success',
        title: 'Success!',
        message: 'Contribution updated successfully!',
        showCancelButton: false,
        onConfirm: closeModal,
      });
    } catch (error) {
      console.error('Failed to update contribution:', error);
      setModalState({
        visible: true,
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update contribution. Please try again.',
        showCancelButton: false,
        onConfirm: closeModal,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setModalState(prev => ({...prev, visible: false}));
  };

  const handleSaveContribution = () => {
    if (!paymentEnabled) {
      Toast.show({
        type: 'error',
        text1: 'Not Due Yet',
        text2: 'Your monthly contribution is not due yet.',
      });
      return;
    }

    if (isSaving) {
      return;
    }

    setModalState({
      visible: true,
      type: 'warning',
      title: 'Confirm Savings',
      message: `Are you sure you want to save ${formatCurrency(
        editedContribution,
        currencySymbol,
      )} towards your "${goalName}" goal?`,
      showCancelButton: true,
      onConfirm: saveContribution,
    });
  };

  const saveContribution = async () => {
    closeModal();
    try {
      setIsSaving(true);
      await api.post(ENDPOINTS.CONTRIBUTIONS.BASE, {
        goal_id: goalId,
        amount: editedContribution,
        note: 'Monthly savings deposit',
      });
      // Refresh contributions list to update button state
      await fetchContributions();
      DeviceEventEmitter.emit('refreshGoals');
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

  // Only paid contributions are shown in history
  const paidHistory = contributions.filter(c => c.status === 'paid');

  return (
    <SafeAreaView style={globalStyles.container}>
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

      <AppModal
        visible={editModalVisible}
        title="Edit Contribution"
        subtitle={`Enter a new amount for ${selectedContribution?.monthKey}`}
        confirmText="Save"
        cancelText="Cancel"
        showCancelButton
        confirmLoading={isSaving}
        confirmVariant="primary"
        onConfirm={handleSaveEdit}
        onCancel={handleCloseEditModal}>
        <View style={styles.modalInputContainer}>
          <Text style={styles.modalCurrencyPrefix}>{currencySymbol}</Text>
          <TextInput
            style={styles.modalInput}
            value={editModalValue}
            onChangeText={text => {
              setEditModalValue(text);
              setEditError('');
            }}
            keyboardType="number-pad"
            autoFocus
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        {editError ? (
          <Text style={styles.modalErrorText}>{editError}</Text>
        ) : null}
        <Text style={styles.modalHintText}>
          Max allowed: {formatCurrency(monthlyContribution, currencySymbol)}
        </Text>
      </AppModal>

      {/* Header */}
      <Header title={goalName} />

      {isLoading ? (
        <View style={styles.content}>
          {/* Upcoming Card Skeleton */}
          <SkeletonLoader
            height={200}
            borderRadius={20}
            style={{
              marginBottom: spacing.lg,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              marginTop: spacing.md,
            }}
          />

          {/* Summary Card Skeleton */}
          <SkeletonLoader
            height={150}
            borderRadius={16}
            style={{
              marginBottom: spacing.xl,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          />

          {/* List Section Title Skeleton */}
          <SkeletonLoader
            width={150}
            height={24}
            style={{
              marginBottom: spacing.md,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          />

          {/* List Items Skeleton */}
          {[1, 2, 3].map(key => (
            <SkeletonLoader
              key={key}
              height={70}
              borderRadius={12}
              style={{
                marginBottom: spacing.sm,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />
          ))}
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Payment Card - Dynamic based on paid state */}
          <View style={styles.upcomingCard}>
            {hasPaidThisMonth ? (
              <>
                {/* Already paid this month */}
                <View style={styles.upcomingHeader}>
                  <View
                    style={[
                      styles.timerBadge,
                      {backgroundColor: colors.successSubtle},
                    ]}>
                    <Text style={styles.timerIcon}>✅</Text>
                    <Text style={[styles.timerText, {color: colors.success}]}>
                      Paid
                    </Text>
                  </View>
                </View>

                <Text style={styles.upcomingLabel}>Last Payment</Text>
                <Text style={styles.upcomingAmount}>
                  {formatCurrency(
                    contributions.filter(c => c.status === 'paid').slice(-1)[0]
                      ?.amount || editedContribution,
                    currencySymbol,
                  )}
                </Text>
                <Text style={styles.upcomingDate}>
                  {contributions.filter(c => c.status === 'paid').slice(-1)[0]
                    ?.date || ''}
                </Text>

                {/* Next upcoming payment info */}
                {upcomingPayment && (
                  <View style={styles.nextPaymentInfo}>
                    <Text style={styles.nextPaymentLabel}>
                      Upcoming Payment
                    </Text>
                    <Text style={styles.nextPaymentAmount}>
                      {formatCurrency(editedContribution, currencySymbol)}
                    </Text>
                    <Text style={styles.nextPaymentDate}>
                      Due: {upcomingPayment.date}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                {/* Not yet paid this month */}
                <View style={styles.upcomingHeader}>
                  <View style={styles.timerBadge}>
                    <Text style={styles.timerIcon}>⏰</Text>
                    <Text style={styles.timerText}>
                      {daysUntilPayment} days left
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEditing(!isEditing)}
                    activeOpacity={0.7}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.upcomingLabel}>Upcoming Payment</Text>
                <Text style={styles.upcomingAmount}>
                  {formatCurrency(editedContribution, currencySymbol)}
                </Text>
                <Text style={styles.upcomingDate}>
                  Due: {upcomingPayment?.date}
                </Text>

                {/* Inline contribution editor */}
                {isEditing && (
                  <View style={styles.editorContainer}>
                    <Text style={styles.editorTitle}>
                      Adjust This Month's Contribution
                    </Text>

                    <View style={styles.contributionInputContainer}>
                      <Text style={styles.currencyPrefix}>
                        {currencySymbol}
                      </Text>
                      <TextInput
                        style={styles.contributionInput}
                        value={
                          editedContribution > 0
                            ? editedContribution.toString()
                            : ''
                        }
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
                        <Text style={styles.editorHighlight}>
                          {effectiveMonths}{' '}
                          {effectiveMonths === 1 ? 'month' : 'months'}
                        </Text>
                      </Text>
                      {editedContribution < monthlyContribution && (
                        <Text style={styles.editorHint}>
                          Original:{' '}
                          {formatCurrency(monthlyContribution, currencySymbol)}
                          /mo ({achieveInMonths}{' '}
                          {achieveInMonths === 1 ? 'month' : 'months'})
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={handleConfirmContribution}
                      activeOpacity={0.7}>
                      <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.payButton,
                    (!paymentEnabled || isSaving) && styles.payButtonDisabled,
                  ]}
                  onPress={handleSaveContribution}>
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

          {editedContribution <= MIN_CONTRIBUTION && (
            <View style={{}}>
              <AnimatedMascot
                text={`Since you can't save less than ${currencySymbol}50, try to save at least this amount to keep your goal ongoing! 🚀`}
                mascotWidth={60}
                mascotHeight={100}
              />
            </View>
          )}

          {/* Progress Summary */}
          <View style={styles.summaryCard}>
            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercent}>
                  {targetAmount > 0
                    ? Math.min(
                        100,
                        Math.round((totalPaid / targetAmount) * 100),
                      )
                    : 0}
                  %
                </Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${
                        targetAmount > 0
                          ? Math.min(100, (totalPaid / targetAmount) * 100)
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressAmounts}>
                <Text style={styles.progressSaved}>
                  {formatCurrency(totalPaid, currencySymbol)} saved
                </Text>
                <Text style={styles.progressTarget}>
                  of {formatCurrency(targetAmount, currencySymbol)}
                </Text>
              </View>
              <Text style={styles.completionDate}>
                📅 Completes by {completionDate}
              </Text>
            </View>

            <View style={styles.summaryDividerHorizontal} />

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {formatCurrency(targetAmount, currencySymbol)}
                </Text>
                <Text style={styles.summaryLabel}>Target</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text
                  style={[
                    styles.summaryValue,
                    editedContribution !== monthlyContribution &&
                      styles.editedValue,
                  ]}>
                  {effectiveMonths}
                </Text>
                <Text style={styles.summaryLabel}>Months</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text
                  style={[
                    styles.summaryValue,
                    editedContribution !== monthlyContribution &&
                      styles.editedValue,
                  ]}>
                  {formatCurrency(editedContribution, currencySymbol)}
                </Text>
                <Text style={styles.summaryLabel}>Monthly</Text>
              </View>
            </View>
          </View>

          {/* Contribution History */}
          {paidHistory.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Contribution History</Text>
              {paidHistory.map(item => {
                const canEdit = isCurrentMonth(item.rawDate);
                return (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyDot} />
                    <View style={styles.historyContent}>
                      <View style={styles.historyRow}>
                        <Text style={styles.historyMonth}>{item.monthKey}</Text>
                        <Text style={styles.historyAmount}>
                          {formatCurrency(item.amount, currencySymbol)}
                        </Text>
                      </View>
                      <View style={styles.historyRowSub}>
                        <Text style={styles.historyDate}>{item.date}</Text>
                        {canEdit && (
                          <TouchableOpacity
                            onPress={() => handleOpenEditModal(item)}
                            style={styles.historyEditBtn}>
                            <Text style={styles.historyEditBtnText}>Edit</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  upcomingCard: {
    backgroundColor: colors.pulseCardBackground,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: borderWidths.thin,
    borderColor: '#2a4a6a',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  upcomingHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
  },
  timerIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  timerText: {
    color: colors.warning,
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
    borderTopWidth: borderWidths.thin,
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
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: radii.md,
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
    borderRadius: radii.lg,
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
    backgroundColor: colors.success,
    borderRadius: 5,
  },
  progressAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  progressSaved: {
    color: colors.success,
    fontSize: typography.caption,
    fontWeight: typography.medium,
  },
  progressTarget: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  completionDate: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  summaryDividerHorizontal: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  historySection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: typography.semibold,
    marginBottom: spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: radii.full,
    backgroundColor: colors.success,
    marginTop: 4,
    marginRight: spacing.md,
    flexShrink: 0,
  },
  historyContent: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: borderWidths.thin,
    borderColor: colors.successSubtle,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  historyRowSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyMonth: {
    color: colors.textPrimary,
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
  },
  historyAmount: {
    color: colors.success,
    fontSize: typography.bodySmall,
    fontWeight: typography.bold,
  },
  historyDate: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  historyEditBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: borderWidths.thin,
    borderColor: colors.primary + '60',
  },
  historyEditBtnText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: typography.semibold,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: borderWidths.thin,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  editedValue: {
    color: colors.primary,
  },
  editorContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: borderWidths.thin,
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
    borderWidth: borderWidths.base,
    borderColor: colors.primary + '50',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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

  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: borderWidths.thin,
    borderColor: colors.border,
    width: '100%',
  },
  modalCurrencyPrefix: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: spacing.sm,
  },
  modalInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  modalErrorText: {
    color: colors.error,
    fontSize: typography.caption,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  modalHintText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginBottom: spacing.xl,
    alignSelf: 'flex-start',
  },
});
