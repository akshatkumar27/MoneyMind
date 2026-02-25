import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {ENDPOINTS} from '../../constants/endpoints';
import {api} from '../../services/api';
import {formatCurrency} from '../../utils/formatNumber';
import {STORAGE_KEYS} from '../../constants/storage';
import { useThemeColors } from "../../context/ThemeContext";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;
type ScreenRouteProp = RouteProp<OnboardingStackParamList, 'MonthlyInvestment'>;

export const MonthlyInvestmentScreen: React.FC = () => {
    const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const [amount, setAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const {currencySymbol} = useCurrency();
  const onboardingData = route.params?.onboardingData || {};

  const monthlyIncome = onboardingData.monthly_income || 0;
  const monthlyExpenses = onboardingData.monthly_expenses || 0;
  const monthlyEmi = onboardingData.monthly_emi || 0;
  const availableAmount = monthlyIncome - monthlyExpenses - monthlyEmi;

  const investmentAmount = parseInt(amount.replace(/,/g, '')) || 0;
  const isExceedingAvailable = investmentAmount > availableAmount;

  const handleComplete = async () => {
    if (amount.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Invalid Input',
        text2: 'Please enter your monthly savings amount (0 is allowed).',
      });
      return;
    }

    if (isExceedingAvailable) {
      Toast.show({
        type: 'error',
        text1: 'Excessive Savings',
        text2: `Savings cannot exceed available amount (${currencySymbol}${availableAmount.toLocaleString()})`,
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        monthly_income: onboardingData.monthly_income || 0,
        monthly_expenses: onboardingData.monthly_expenses || 0,
        monthly_emi: onboardingData.monthly_emi || 0,
        emi_outstanding: onboardingData.emi_outstanding || 0,
        monthly_investment: investmentAmount,
      };
      console.log('payload--', payload);

      // Save onboarding data for use in Pulse screen suggestions
      await AsyncStorage.setItem(
        STORAGE_KEYS.ONBOARDING_DATA,
        JSON.stringify(payload),
      );

      // Save financial profile to backend
      const response = await api.post(
        ENDPOINTS.USER.FINANCIAL_PROFILE,
        payload,
      );
      console.log('Financial profile saved:', response.data);

      // Mark onboarding as complete in local storage
      const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userStr) {
        const user = JSON.parse(userStr);
        user.isNewUser = false;
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
      // await AsyncStorage.setItem('onboardingStatus', 'COMPLETED');

      // Go directly to the main app (Pulse screen)
      navigation.reset({
        index: 0,
        routes: [{name: 'Main' as never}],
      });
    } catch (error) {
      console.error('Onboarding submit error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Header title="Step 5 of 5" titleStyle={styles.stepIndicator} />

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
          <View style={styles.progressSection}>
            <Text style={[styles.progressLabel, { color: colors.textMuted }]}>Profile Completion</Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>100%</Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, {width: '100%'}, { backgroundColor: colors.primary }]} />
          </View>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Text style={styles.emoji}>📈</Text>
            <View style={styles.sparkles}>
              <Text style={styles.sparkle}>✨</Text>
              <Text style={styles.sparkle}>✨</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>How much do you save monthly?</Text>

          {/* Available Amount Info */}
          <Text style={[styles.availableText, { color: colors.textSecondary }]}>
            Available for savings:{' '}
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

          {/* Error/Warning Message */}
          {isExceedingAvailable && (
            <Text style={[styles.errorText, { color: colors.danger }]}>
              Investment cannot exceed available amount (
              {formatCurrency(availableAmount, currencySymbol)})
            </Text>
          )}
        </ScrollView>

        {/* Mascot at bottom */}
        <View style={styles.mascotContainer}>
          <AnimatedMascot
            text="Almost there! 🎉
Add monthly savings so I can track them for you."
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Set Your Goals"
            onPress={handleComplete}
            loading={isSaving}
            disabled={isSaving}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: typography.caption,
  },
  progressPercent: {
    fontSize: typography.caption,
    fontWeight: typography.medium as any,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.xl,
  },
  progressFill: {
    height: '100%',
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
    fontSize: typography.h2,
    fontWeight: typography.bold as any,
    marginBottom: spacing.sm,
    textAlign: 'center',
    lineHeight: 32,
  },
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
  inputError: {
},
  errorText: {
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
