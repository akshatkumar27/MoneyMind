import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/OnboardingNavigator';
import {formatNumberInput} from '../../utils/formatNumber';
import {useCurrency} from '../../context/CurrencyContext';
import {BackButton} from '../../components/BackButton';
import {Button} from '../../components/Button';
import {AnimatedMascot} from '../../components/AnimatedMascot';
import {Header} from '../../components/Header';
import {
  typography,
  spacing,
  radii,
  borderWidths,
} from '../../constants/theme';
import {globalStyles} from '../../styles/globalStyles';
import {formatCurrency} from '../../utils/formatNumber';
import { useThemeColors } from "../../context/ThemeContext";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;
type ScreenRouteProp = RouteProp<OnboardingStackParamList, 'MonthlyEMI'>;

export const MonthlyEMIScreen: React.FC = () => {
    const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const [amount, setAmount] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);
  const {currencySymbol} = useCurrency();
  const onboardingData = route.params?.onboardingData || {};

  const monthlyIncome = onboardingData.monthly_income || 0;
  const monthlyExpenses = onboardingData.monthly_expenses || 0;
  const availableAmount = monthlyIncome - monthlyExpenses;
  const emiAmount =
    amount.trim() === '' ? -1 : parseInt(amount.replace(/,/g, '')) || 0;
  const isExceedingAvailable = emiAmount > availableAmount;

  const handleContinue = () => {
    if (amount.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Invalid Input',
        text2: 'Please enter your EMI amount (0 is allowed).',
      });
      return;
    }

    if (isExceedingAvailable) {
      Toast.show({
        type: 'error',
        text1: 'Excessive EMI',
        text2: `EMI cannot exceed available amount (${currencySymbol}${availableAmount.toLocaleString()})`,
      });
      return;
    }

    navigation.navigate('EMIOutstanding', {
      onboardingData: {...onboardingData, monthly_emi: emiAmount},
    });
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Header title="Step 3 of 5" titleStyle={styles.stepIndicator} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({animated: true})
          }>
          <View style={globalStyles.rowSpaceBetween}>
            <Text style={globalStyles.caption}>Profile Completion</Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>60%</Text>
          </View>
          <View style={globalStyles.progressBar}>
            <View style={[globalStyles.progressFill, {width: '60%'}]} />
          </View>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Text style={styles.emoji}>📋</Text>
          </View>

          <Text
            style={[
              globalStyles.headingMedium,
              {textAlign: 'center', lineHeight: 32, marginBottom: spacing.sm},
            ]}>
            What is your monthly EMI payment?
          </Text>

          {/* Available Amount Info */}
          <Text style={[styles.availableText, { color: colors.textSecondary }]}>
            Available after expenses:{' '}
            {formatCurrency(availableAmount, currencySymbol)}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.currencySymbol, { color: colors.textPrimary }]}>{currencySymbol}</Text>
            <TextInput
              style={[
                                                                styles.amountInput,
                                                                isExceedingAvailable && styles.inputError,
                                                              , { color: colors.textPrimary, borderBottomColor: colors.primary }, { borderBottomColor: colors.danger }]}
              value={amount}
              onChangeText={text => setAmount(formatNumberInput(text))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Error Message */}
          {isExceedingAvailable && (
            <Text
              style={[
                globalStyles.errorText,
                {
                  textAlign: 'center',
                  marginBottom: spacing.md,
                  fontSize: typography.bodySmall,
                },
              ]}>
              EMI cannot exceed available amount (
              {formatCurrency(availableAmount, currencySymbol)})
            </Text>
          )}

          <View style={[styles.noteCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={styles.noteIcon}>💡</Text>
            <Text style={[styles.noteText, { color: colors.textSecondary }]}>
              Enter 0 if you don't have any active EMIs
            </Text>
          </View>
        </ScrollView>

        {/* Mascot at bottom */}
        <View style={styles.mascotContainer}>
          <AnimatedMascot text="How much do you pay in EMIs? Include home, car, and personal loans!" />
        </View>

        <View style={styles.footer}>
          <Button title="Continue" onPress={handleContinue} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    flex: 1,
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  progressPercent: {
    fontSize: typography.caption,
    fontWeight: typography.medium as any,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {fontSize: 80},
  availableText: {
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
    fontSize: 32,
    fontWeight: typography.bold as any,
    marginRight: spacing.sm,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: typography.bold as any,
    minWidth: 20,
    maxWidth: 280,
    textAlign: 'left',
    borderBottomWidth: borderWidths.medium,
    paddingBottom: spacing.sm,
  },
  inputError: {},
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  noteIcon: {fontSize: 20, marginRight: spacing.sm},
  noteText: {
    flex: 1,
    fontSize: typography.bodySmall,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  mascotContainer: {paddingHorizontal: spacing.xs},
});
