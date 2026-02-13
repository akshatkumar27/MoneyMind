import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackButton, Button, AnimatedMascot } from '../../components';
import { colors, typography, spacing } from '../../constants';
import { formatNumberInput } from '../../utils/formatNumber';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { formatCurrency } from '../../utils';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;
type ScreenRouteProp = RouteProp<OnboardingStackParamList, 'MonthlyExpenses'>;

export const MonthlyExpensesScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ScreenRouteProp>();
    const [amount, setAmount] = useState('');
    const onboardingData = route.params?.onboardingData || {};
    const monthlyIncome = onboardingData.monthly_income || 0;

    const expenseAmount = parseInt(amount.replace(/,/g, '')) || 0;
    const isExceedingIncome = expenseAmount > monthlyIncome;
    const isValid = amount.trim() && !isExceedingIncome;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.stepIndicator}>Step 2 of 5</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.progressSection}>
                    <Text style={styles.progressLabel}>Profile Completion</Text>
                    <Text style={styles.progressPercent}>40%</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '40%' }]} />
                </View>
                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    <Text style={styles.emoji}>🛒</Text>
                </View>

                <Text style={styles.title}>What are your monthly expenses?</Text>

                {/* Available Income Info */}
                <Text style={styles.availableText}>
                    Your income: {formatCurrency(monthlyIncome)}
                </Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                        style={[styles.amountInput, isExceedingIncome && styles.inputError]}
                        value={amount}
                        onChangeText={(text) => setAmount(formatNumberInput(text))}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                    />
                </View>

                {/* Error Message */}
                {isExceedingIncome && (
                    <Text style={styles.errorText}>
                        Expenses cannot exceed your income ({formatCurrency(monthlyIncome)})
                    </Text>
                )}
            </ScrollView>

            {/* Mascot at bottom */}
            <View style={styles.mascotContainer}>
                <AnimatedMascot text="Tell me about your monthly expenses like rent, utilities, and groceries!" />
            </View>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={() => navigation.navigate('MonthlyEMI', {
                        onboardingData: { ...onboardingData, monthly_expenses: expenseAmount }
                    })}
                    disabled={!isValid}
                />
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
