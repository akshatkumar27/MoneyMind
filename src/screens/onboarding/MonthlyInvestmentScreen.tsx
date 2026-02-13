import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackButton, Button, AnimatedMascot } from '../../components';
import { colors, typography, spacing } from '../../constants';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { api } from '../../services';
import { formatCurrency } from '../../utils';
import { formatNumberInput } from '../../utils/formatNumber';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;
type ScreenRouteProp = RouteProp<OnboardingStackParamList, 'MonthlyInvestment'>;

export const MonthlyInvestmentScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ScreenRouteProp>();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const onboardingData = route.params?.onboardingData || {};

    const monthlyIncome = onboardingData.monthly_income || 0;
    const monthlyExpenses = onboardingData.monthly_expenses || 0;
    const monthlyEmi = onboardingData.monthly_emi || 0;
    const availableAmount = monthlyIncome - monthlyExpenses - monthlyEmi;

    const investmentAmount = parseInt(amount.replace(/,/g, '')) || 0;
    const isExceedingAvailable = investmentAmount > availableAmount;
    // Investment can be 0, so only validate if amount is entered and exceeds
    const isValid = !isExceedingAvailable;

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const payload = {
                monthly_income: onboardingData.monthly_income || 0,
                monthly_expenses: onboardingData.monthly_expenses || 0,
                monthly_emi: onboardingData.monthly_emi || 0,
                emi_outstanding: onboardingData.emi_outstanding || 0,
                monthly_investment: investmentAmount,
            };

            // Save onboarding data to AsyncStorage for later use
            await AsyncStorage.setItem('onboardingData', JSON.stringify(payload));

            const res = await api.post('/api/insights', payload);
            console.log(res.data, payload);

            navigation.navigate('GoalSelection', {
                onboardingData: { ...onboardingData, monthly_investment: investmentAmount }
            });
        } catch (error) {
            console.error('Onboarding API error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not load your recommended monthly investment. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.stepIndicator}>Step 5 of 5</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.progressSection}>
                    <Text style={styles.progressLabel}>Profile Completion</Text>
                    <Text style={styles.progressPercent}>100%</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '100%' }]} />
                </View>
                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    <Text style={styles.emoji}>📈</Text>
                    <View style={styles.sparkles}>
                        <Text style={styles.sparkle}>✨</Text>
                        <Text style={styles.sparkle}>✨</Text>
                    </View>
                </View>

                <Text style={styles.title}>How much do you save monthly?</Text>

                {/* Available Amount Info */}
                <Text style={styles.availableText}>
                    Available for savings: {formatCurrency(availableAmount)}
                </Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                        style={[styles.amountInput, isExceedingAvailable && styles.inputError]}
                        value={amount}
                        onChangeText={(text) => setAmount(formatNumberInput(text))}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                    />
                </View>

                {/* Error/Warning Message */}
                {isExceedingAvailable && (
                    <Text style={styles.errorText}>
                        Investment cannot exceed available amount ({formatCurrency(availableAmount)})
                    </Text>
                )}
            </ScrollView>

            {/* Mascot at bottom */}
            <View style={styles.mascotContainer}>
                <AnimatedMascot text="Almost there! 🎉
Add monthly savings so I can track them for you." />
            </View>

            <View style={styles.footer}>
                <Button
                    title={isLoading ? 'Saving...' : 'Set Your Goals'}
                    onPress={handleSubmit}
                    disabled={isLoading || !isValid}
                />
                {isLoading && (
                    <ActivityIndicator
                        style={{ marginTop: spacing.md }}
                        size="small"
                        color={colors.primary}
                    />
                )}
            </View>
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
    stepIndicator: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.medium as any,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    progressSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    progressLabel: {
        color: colors.textMuted,
        fontSize: typography.caption,
    },
    progressPercent: {
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: typography.medium as any,
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        marginBottom: spacing.xl,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    illustrationContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    emoji: {
        fontSize: 80,
    },
    sparkles: {
        flexDirection: 'row',
        gap: 16,
        marginTop: spacing.sm,
    },
    sparkle: {
        fontSize: 20,
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: typography.bold as any,
        marginBottom: spacing.sm,
        textAlign: 'center',
        lineHeight: 32,
    },
    availableText: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    currencySymbol: {
        color: colors.textPrimary,
        fontSize: 32,
        fontWeight: typography.bold as any,
        marginRight: spacing.sm,
    },
    amountInput: {
        color: colors.textPrimary,
        fontSize: 48,
        fontWeight: typography.bold as any,
        minWidth: 200,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        paddingBottom: spacing.sm,
    },
    inputError: {
        borderBottomColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        fontSize: typography.bodySmall,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    mascotContainer: {
        paddingHorizontal: spacing.xs,
    },
});
