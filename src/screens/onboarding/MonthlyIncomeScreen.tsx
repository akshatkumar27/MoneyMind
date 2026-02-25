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
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {formatNumberInput} from '../../utils/formatNumber';

import {OnboardingStackParamList} from '../../navigation/OnboardingNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCurrency} from '../../context/CurrencyContext';
import {BackButton} from '../../components/BackButton';
import {Button} from '../../components/Button';
import {AnimatedMascot} from '../../components/AnimatedMascot';
import {Header} from '../../components/Header';
import {typography, spacing, borderWidths} from '../../constants/theme';
import {globalStyles} from '../../styles/globalStyles';
import { useThemeColors } from "../../context/ThemeContext";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList>;

export const MonthlyIncomeScreen: React.FC = () => {
    const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const [amount, setAmount] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);
  const {currencySymbol} = useCurrency();

  const handleContinue = () => {
    const incomeValue = parseInt(amount.replace(/,/g, '')) || 0;

    if (!amount.trim() || incomeValue <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Input',
        text2: 'Please enter a valid monthly income greater than 0.',
      });
      return;
    }

    navigation.navigate('MonthlyExpenses', {
      onboardingData: {monthly_income: incomeValue},
    });
  };

  // React.useEffect(() => {
  //     const saveStatus = async () => {
  //         await AsyncStorage.setItem('onboardingStatus', 'MonthlyIncome');
  //     };
  //     saveStatus();
  // }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Header title="Step 1 of 5" titleStyle={styles.stepIndicator} />

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
            <Text style={[styles.progressPercent, { color: colors.primary }]}>20%</Text>
          </View>
          <View style={globalStyles.progressBar}>
            <View style={[globalStyles.progressFill, {width: '20%'}]} />
          </View>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Text style={styles.emoji}>💰</Text>
          </View>

          <Text
            style={[
              globalStyles.headingMedium,
              {textAlign: 'center', lineHeight: 32, marginBottom: spacing.sm},
            ]}>
            What is your monthly income?
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.currencySymbol, { color: colors.textPrimary }]}>{currencySymbol}</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.textPrimary, borderBottomColor: colors.primary }]}
              value={amount}
              onChangeText={text => setAmount(formatNumberInput(text))}
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
    fontWeight: typography.medium,
    textAlign: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  progressPercent: {
    fontSize: typography.caption,
    fontWeight: typography.medium,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {fontSize: 80},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: typography.bold,
    marginRight: spacing.sm,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: typography.bold,
    minWidth: 20,
    maxWidth: 280,
    textAlign: 'left',
    borderBottomWidth: borderWidths.medium,
    paddingBottom: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  mascotContainer: {paddingHorizontal: spacing.xs},
});
