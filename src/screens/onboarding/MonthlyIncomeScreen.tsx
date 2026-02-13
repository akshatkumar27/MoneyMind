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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackButton, Button, AnimatedMascot } from '../../components';
import { colors, typography, spacing } from '../../constants';
import { formatNumberInput } from '../../utils/formatNumber';

type OnboardingStackParamList = {
    MonthlyIncome: undefined;
    MonthlyExpenses: undefined;
    MonthlyEMI: undefined;
    EMIOutstanding: undefined;
    MonthlyInvestment: undefined;
    GoalSelection: undefined;
};

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

export const MonthlyIncomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [amount, setAmount] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.stepIndicator}>Step 1 of 5</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.progressSection}>
                    <Text style={styles.progressLabel}>Profile Completion</Text>
                    <Text style={styles.progressPercent}>20%</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '20%' }]} />
                </View>
                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    <Text style={styles.emoji}>💰</Text>
                </View>

                <Text style={styles.title}>What is your monthly income?</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={(text) => setAmount(formatNumberInput(text))}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                    />
                </View>
            </ScrollView>

            {/* Mascot at bottom */}
            <View style={styles.mascotContainer}>
                <AnimatedMascot text="Let me know your monthly income so I can understand your financial capacity!" />
            </View>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={() => navigation.navigate('MonthlyExpenses', {
                        onboardingData: { monthly_income: parseInt(amount.replace(/,/g, '')) || 0 }
                    })}
                    disabled={!amount.trim()}
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
        fontWeight: typography.medium,
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
        fontWeight: typography.medium,
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
        fontWeight: typography.bold,
        marginBottom: spacing.sm,
        textAlign: 'center',
        lineHeight: 32,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: typography.body,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    currencySymbol: {
        color: colors.textPrimary,
        fontSize: 32,
        fontWeight: typography.bold,
        marginRight: spacing.sm,
    },
    amountInput: {
        color: colors.textPrimary,
        fontSize: 48,
        fontWeight: typography.bold,
        minWidth: 200,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        paddingBottom: spacing.sm,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    mascotContainer: {
        paddingHorizontal: spacing.xs,
    },
});
