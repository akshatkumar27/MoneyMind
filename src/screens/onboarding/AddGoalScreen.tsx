import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TextInput,
    Platform,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BackButton, Button, AnimatedMascot, Header } from '../../components';
import { MainStackParamList } from '../../navigation/MainTabNavigator';
import { colors, typography, spacing } from '../../constants';
import { api } from '../../services';
import { formatCurrency } from '../../utils';
import { formatNumberInput, formatNumber } from '../../utils/formatNumber';
import { useCurrency } from '../../context/CurrencyContext';

// Time duration options in months
const DURATION_OPTIONS = [
    { label: '6 months', value: 6 },
    { label: '1 year', value: 12 },
    { label: '2 years', value: 24 },
    { label: '3 years', value: 36 },
    { label: '5 years', value: 60 },
];

export const AddGoalScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<MainStackParamList, 'AddGoal'>>();
    const availableForNewGoals = route.params?.availableForNewGoals;
    const suggestionName = route.params?.suggestionName;
    const suggestionTarget = route.params?.suggestionTarget;
    const suggestionMonths = route.params?.suggestionMonths;
    const suggestionDescription = route.params?.suggestionDescription;

    // Determine initial duration selection from suggestion
    const isPreset = DURATION_OPTIONS.some(d => d.value === suggestionMonths);
    const { currencySymbol } = useCurrency();
    const [name, setName] = useState(suggestionName || '');
    const [target, setTarget] = useState(suggestionTarget ? formatNumberInput(suggestionTarget.toString()) : '');
    const [selectedDuration, setSelectedDuration] = useState<number | 'custom'>(
        suggestionMonths
            ? (isPreset ? suggestionMonths : 'custom')
            : 12
    );
    const [customMonths, setCustomMonths] = useState(
        suggestionMonths && !isPreset ? String(suggestionMonths) : ''
    );
    const [monthlyContribution, setMonthlyContribution] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isContributionManuallyEdited, setIsContributionManuallyEdited] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    // useEffect(() => {
    //     const saveStatus = async () => {
    //         await AsyncStorage.setItem('onboardingStatus', 'AddGoal');
    //     };
    //     saveStatus();
    // }, []);

    // Get actual months value
    const achieveInMonths = selectedDuration === 'custom'
        ? (parseInt(customMonths) || 0)
        : selectedDuration;

    const targetAmount = parseInt(target.replace(/,/g, '')) || 0;
    const contributionAmount = parseInt(monthlyContribution.replace(/,/g, '')) || 0;

    // Auto-calculate monthly contribution when target or duration changes
    useEffect(() => {
        if (!isContributionManuallyEdited && targetAmount > 0 && achieveInMonths > 0) {
            const calculated = Math.ceil(targetAmount / achieveInMonths);
            setMonthlyContribution(formatNumberInput(calculated.toString()));
        }
    }, [targetAmount, achieveInMonths, isContributionManuallyEdited]);

    // When contribution is manually edited, recalculate months
    const handleContributionChange = (value: string) => {
        const formattedValue = formatNumberInput(value);
        let contribution = parseInt(formattedValue.replace(/,/g, '')) || 0;
        let finalValue = formattedValue;

        // Clamp contribution to target amount
        if (targetAmount > 0 && contribution > targetAmount) {
            contribution = targetAmount;
            finalValue = formatNumberInput(targetAmount.toString());
            // Optional: You could show a toast or small error text here
        }

        setMonthlyContribution(finalValue);
        setIsContributionManuallyEdited(true);

        if (contribution > 0 && targetAmount > 0) {
            const calculatedMonths = Math.ceil(targetAmount / contribution);
            if (calculatedMonths > 0 && calculatedMonths <= 600) { // Max 50 years
                setSelectedDuration('custom');
                setCustomMonths(calculatedMonths.toString());
            }
        }
    };

    // Reset manual edit flag when duration is selected from chips
    const handleDurationSelect = (value: number) => {
        setSelectedDuration(value);
        setCustomMonths('');
        setIsContributionManuallyEdited(false);
    };

    const handleCustomSelect = () => {
        setSelectedDuration('custom');
        setIsContributionManuallyEdited(false);
    };

    const handleCustomMonthsChange = (value: string) => {
        setCustomMonths(value);
        setIsContributionManuallyEdited(false);
    };

    const handleSaveGoal = async () => {
        const contributionAmount = parseFloat(monthlyContribution.replace(/,/g, '')) || 0;

        if (!name.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Missing Name',
                text2: 'Please enter a name for your financial goal.',
            });
            return;
        }

        if (!target.trim() || targetAmount <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Missing Target',
                text2: 'Please enter a valid target amount for your goal.',
            });
            return;
        }
        if (achieveInMonths <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter a valid duration',
            });
            return;
        }

        if (availableForNewGoals !== undefined && contributionAmount > availableForNewGoals) {
            Toast.show({
                type: 'error',
                text1: 'Excessive Contribution',
                text2: `Your contribution cannot exceed your available monthly savings (${currencySymbol}${formatCurrency(availableForNewGoals)}).`,
            });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                name: name.trim(),
                target_amount: targetAmount,
                achieve_in_months: achieveInMonths,
                monthly_contribution: contributionAmount,
            };

            console.log('Creating goal:', payload);
            const response = await api.post('/api/goals', payload);
            console.log('Goal created:', response.data);

            // Update local user data if this was part of onboarding
            try {
                const userStr = await AsyncStorage.getItem('user');
                console.log('Current user in storage (AddGoal):', userStr);
                if (userStr) {
                    const user = JSON.parse(userStr);
                    // Update checking: if new user, mark as not new
                    if (user.isNewUser) {
                        user.isNewUser = false;
                        await AsyncStorage.setItem('user', JSON.stringify(user));
                        // await AsyncStorage.setItem('onboardingStatus', 'COMPLETED');
                        await AsyncStorage.removeItem('onboarding_progress_data');
                        console.log('Updated user in storage (AddGoal):', JSON.stringify(user));
                    }
                }
            } catch (err) {
                console.error('Error updating user onboarding status:', err);
            }

            // Navigate to main app after saving
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' as never }],
            });
        } catch (error) {
            console.error('Save goal error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to save your goal. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <Header title="Add Your Goal" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    contentContainerStyle={styles.contentContainer}
                >
                    {/* Mascot with AI suggestion description — inside scroll so it scrolls with the form */}
                    {suggestionDescription ? (
                        <AnimatedMascot
                            text={suggestionDescription}
                            mascotImage={require('../../asset/happymascot.png')}
                            mascotWidth={80}
                            mascotHeight={110}
                            arrowTopRatio={0.38}
                        />
                    ) : null}

                    {/* Available Budget Card */}
                    {availableForNewGoals !== undefined && availableForNewGoals > 0 && (
                        <View style={styles.budgetCard}>
                            <View style={styles.budgetIconContainer}>
                                <Text style={styles.budgetIcon}>✨</Text>
                            </View>
                            <View style={styles.budgetTextContainer}>
                                <Text style={styles.budgetLabel}>Monthly Savings Available</Text>
                                <Text style={styles.budgetAmount}>
                                    {currencySymbol}{formatNumber(availableForNewGoals, 1)}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Name Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.textInput}
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g., Emergency Fund"
                            placeholderTextColor={colors.textMuted}
                        />
                    </View>

                    {/* Target Row */}
                    <View style={styles.inputRow}>
                        <Text style={styles.rowLabel}>Target</Text>
                        <View style={styles.compactInput}>
                            <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
                            <TextInput
                                style={styles.compactInputText2}
                                value={target}
                                onChangeText={(text) => setTarget(formatNumberInput(text))}
                                keyboardType="number-pad"
                                placeholder="50000"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>
                    </View>

                    {/* Achieve In - Duration Options */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Achieve in</Text>
                        <View style={styles.durationContainer}>
                            {DURATION_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.durationOption,
                                        selectedDuration === option.value && styles.durationOptionSelected,
                                    ]}
                                    onPress={() => handleDurationSelect(option.value)}
                                >
                                    <Text
                                        style={[
                                            styles.durationText,
                                            selectedDuration === option.value && styles.durationTextSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            {/* Custom Option */}
                            <TouchableOpacity
                                style={[
                                    styles.durationOption,
                                    selectedDuration === 'custom' && styles.durationOptionSelected,
                                ]}
                                onPress={handleCustomSelect}
                            >
                                <Text
                                    style={[
                                        styles.durationText,
                                        selectedDuration === 'custom' && styles.durationTextSelected,
                                    ]}
                                >
                                    Custom
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Custom months input */}
                        {selectedDuration === 'custom' && (
                            <View style={styles.customInputContainer}>
                                <TextInput
                                    style={styles.customMonthsInput}
                                    value={customMonths}
                                    onChangeText={handleCustomMonthsChange}
                                    keyboardType="number-pad"
                                    placeholder="Enter months"
                                    placeholderTextColor={colors.textMuted}
                                    autoFocus={!customMonths}
                                />
                                <Text style={styles.customMonthsLabel}>{customMonths === '1' ? 'month' : 'months'}</Text>
                            </View>
                        )}
                    </View>

                    {/* Monthly Contribution Row */}
                    <View style={styles.inputRow}>
                        <Text style={styles.rowLabel}>Monthly contribution</Text>
                        <View style={[styles.compactInput, styles.highlightedInput]}>
                            <Text style={[styles.currencyPrefix, styles.highlightedText]}>{currencySymbol}</Text>
                            <TextInput
                                style={[styles.compactInputText, styles.highlightedText]}
                                value={monthlyContribution}
                                onChangeText={handleContributionChange}
                                keyboardType="number-pad"
                                placeholder="0"
                                placeholderTextColor={colors.primary + '80'}
                            />
                        </View>
                    </View>

                    {/* Suggested contribution hint */}
                    {/* {target && achieveInMonths > 0 && (
                        <Text style={styles.suggestionText}>
                            💡 Suggested: {currencySymbol}{Math.ceil(parseInt(target) / achieveInMonths).toLocaleString('en-IN')}/month
                        </Text>
                    )} */}
                </ScrollView>

                {/* Budget warning mascot — only shown when suggestion mascot is not visible */}
                {!suggestionDescription && availableForNewGoals !== undefined && contributionAmount > availableForNewGoals && (
                    <View style={styles.mascotContainer}>
                        <AnimatedMascot
                            text={`You only have ${formatCurrency(availableForNewGoals ?? 0, currencySymbol)} available for new goals!`}
                        />
                    </View>
                )}

                <View style={styles.footer}>
                    <Button
                        title="Create Goal"
                        onPress={handleSaveGoal}
                        loading={isLoading}
                        disabled={isLoading}
                    />
                </View>
            </KeyboardAvoidingView>
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
        flex: 1,
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.semibold as any,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    contentContainer: {
        paddingTop: spacing.xl,
        paddingBottom: spacing.xl,
    },
    inputGroup: {
        marginBottom: spacing.xl,
    },
    label: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.medium as any,
        marginBottom: spacing.sm,
    },
    textInput: {
        backgroundColor: colors.cardBackground,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        color: colors.textPrimary,
        fontSize: typography.body,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
        paddingVertical: spacing.sm,
    },
    rowLabel: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.medium as any,
        flex: 1,
    },
    compactInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        minWidth: 120,
    },
    compactInputText2: {
        paddingHorizontal: spacing.md,
        paddingVertical: 2,
        minWidth: 90,
        maxWidth: 180,
    },
    currencyPrefix: {
        color: colors.textSecondary,
        fontSize: typography.body,
        marginRight: spacing.xs,
    },
    highlightedInput: {
        backgroundColor: colors.primary + '10',
        borderColor: colors.primary + '40',
    },
    compactInputText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        textAlign: 'right',
        minWidth: 60,
        paddingVertical: 0,
        flex: 1,
    },
    highlightedText: {
        color: colors.primary,
    },
    durationContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    durationOption: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        backgroundColor: colors.cardBackground,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    durationOptionSelected: {
        backgroundColor: colors.primary + '20',
        borderColor: colors.primary,
    },
    durationText: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
        fontWeight: typography.medium as any,
    },
    durationTextSelected: {
        color: colors.primary,
    },
    customInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    customMonthsInput: {
        backgroundColor: colors.cardBackground,
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderRadius: 10,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        color: colors.textPrimary,
        fontSize: typography.body,
        width: 180,
        textAlign: 'center',
    },
    customMonthsLabel: {
        color: colors.textSecondary,
        fontSize: typography.body,
        marginLeft: spacing.sm,
    },
    suggestionText: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
        textAlign: 'center',
        marginTop: -spacing.sm,
        marginBottom: spacing.lg,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        paddingTop: spacing.md,
    },
    mascotContainer: {
        paddingHorizontal: spacing.xs,
        paddingBottom: spacing.sm,
    },
    mascotTopContainer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
        marginTop: -spacing.sm,
    },
    budgetCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(34,197,94,0.3)',
        marginHorizontal: spacing.lg, // Make it align with standard paddings
    },
    budgetIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(34,197,94,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    budgetIcon: {
        fontSize: 20,
    },
    budgetTextContainer: {
        flex: 1,
    },
    budgetLabel: {
        color: colors.textSecondary,
        fontSize: typography.caption,
        marginBottom: 2,
    },
    budgetAmount: {
        color: '#22c55e',
        fontSize: typography.h3,
        fontWeight: typography.bold,
    },
});
