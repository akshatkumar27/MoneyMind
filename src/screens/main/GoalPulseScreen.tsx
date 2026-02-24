import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Svg, {Circle} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainStackParamList} from '../../navigation/MainTabNavigator';
import Toast from 'react-native-toast-message';
import {formatNumber} from '../../utils/formatNumber';
import {useCurrency} from '../../context/CurrencyContext';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setFinancialData} from '../../store/slices/financialDataSlice';
import {DeviceEventEmitter} from 'react-native';
import {Card} from '../../components/dashboard/Card';
import {GoalCardWithSuggestion} from '../../components/dashboard/GoalCardWithSuggestion';
import {ProgressBar} from '../../components/dashboard/ProgressBar';
import {AnimatedMascot} from '../../components/AnimatedMascot';
import {MascotLoader} from '../../components/MascotLoader';
import {
  colors,
  typography,
  spacing,
  radii,
  borderWidths,
} from '../../constants/theme';
import {ENDPOINTS} from '../../constants/endpoints';
import {globalStyles} from '../../styles/globalStyles';
import {api} from '../../services/api';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Types for API response
interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  achieve_in_months: number;
  monthly_contribution: number;
  created_at: string;
  updated_at: string;
  saved_amount: number;
  progress: number;
}

interface GoalBudget {
  surplus: number;
  totalGoalContributions: number;
  availableForNewGoals: number;
}

interface GoalsResponse {
  success: boolean;
  message: string;
  goals: Goal[];
  goalBudget: GoalBudget;
  averageAchievement: number;
}

interface Insight {
  title: string;
  description: string;
  amount: number;
  target_months: number;
}

// Extract emoji + text from insight title
const parseInsightTitle = (title: string) => {
  const emojiMatch = title.match(/^(\p{Emoji}+)\s*/u);
  if (emojiMatch) {
    return {icon: emojiMatch[1], text: title.replace(emojiMatch[0], '').trim()};
  }
  return {icon: '🎯', text: title};
};

// Circular Progress Component using SVG
interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
  trackColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 160,
  strokeWidth = 14,
  progressColor = colors.success,
  trackColor = colors.cardBackground,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset =
    circumference - (clampedProgress / 100) * circumference;

  return (
    <View style={circularStyles.container}>
      <Svg width={size} height={size}>
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {/* Center Score Text */}
      <View style={circularStyles.centerText}>
        <Text style={circularStyles.scoreText}>{Math.round(progress)}</Text>
      </View>
    </View>
  );
};

const circularStyles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: typography.bold,
  },
});

export const GoalPulseScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const financialData = useAppSelector(state => state.financialData);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [averageAchievement, setAverageAchievement] = useState(0);
  const [goalBudget, setGoalBudget] = useState<GoalBudget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [onboardingInvestment, setOnboardingInvestment] = useState(0);
  const {currencySymbol} = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      const profileData = await checkAndFetchFinancialProfile();
      const {goals: currentGoals, goalBudget: currentBudget} =
        await fetchGoals();
      await fetchInsights(profileData, currentGoals, currentBudget);
      console.log('goalsd');
    };
    fetchData();

    const subscription = DeviceEventEmitter.addListener('refreshGoals', () => {
      fetchData();
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAndFetchFinancialProfile = async () => {
    const hasData =
      financialData.monthlyIncome > 0 ||
      financialData.monthlyExpenses > 0 ||
      financialData.monthlyEmi > 0 ||
      financialData.monthlyInvestment > 0 ||
      financialData.emiOutstanding > 0;
    console.log('hasData-->', hasData);
    if (!hasData) {
      try {
        const response = await api.get(ENDPOINTS.USER.FINANCIAL_PROFILE);
        if (response.data?.success) {
          console.log('newProfileData tot-->', response.data);

          const profile = response.data.profile;
          console.log('profile-->', profile);
          const newProfileData = {
            monthlyIncome: profile.monthly_income || 0,
            monthlyExpenses: profile.monthly_expenses || 0,
            monthlyEmi: profile.monthly_emi || 0,
            emiOutstanding: profile.emi_outstanding || 0,
            monthlyInvestment: profile.monthly_savings || 0,
          };
          console.log('newProfileData-->', newProfileData);
          dispatch(
            setFinancialData({
              ...newProfileData,
              isFinancialProfilePresent: true,
            }),
          );

          return newProfileData;
        }
      } catch (error) {
        console.error('Failed to fetch financial profile:', error);
      }
    }
    return financialData;
  };

  const fetchGoals = async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }
      const response = await api.get<GoalsResponse>(ENDPOINTS.GOALS.BASE);
      if (response.data.success) {
        setGoals(response.data.goals);
        setAverageAchievement(response.data.averageAchievement);
        setGoalBudget(response.data.goalBudget);
        console.log('goalBudget->', response.data.goalBudget);
        return {
          goals: response.data.goals,
          goalBudget: response.data.goalBudget,
        };
      }
      return {goals: [], goalBudget: null};
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      return {goals: [], goalBudget: null};
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  const fetchInsights = async (
    profileData: any,
    currentGoals: Goal[] = [],
    currentBudget: GoalBudget | null = null,
  ) => {
    try {
      setInsightsLoading(true);
      const availableForGoals = currentBudget
        ? currentBudget.availableForNewGoals
        : onboardingInvestment || 0;
      setOnboardingInvestment(availableForGoals);

      const payload = {
        monthly_income: profileData.monthlyIncome || 0,
        monthly_expenses: profileData.monthlyExpenses || 0,
        monthly_emi: profileData.monthlyEmi || 0,
        emi_outstanding: profileData.emiOutstanding || 0,
        monthly_savings: profileData.monthlyInvestment || 0,
        available_budget: availableForGoals,
        goals: currentGoals.map(g => ({
          name: g.name,
          target_amount:
            typeof g.target_amount === 'string'
              ? parseFloat(g.target_amount)
              : g.target_amount,
          monthly_contribution:
            typeof g.monthly_contribution === 'string'
              ? parseFloat(g.monthly_contribution)
              : g.monthly_contribution,
        })),
      };
      const res = await api.post(ENDPOINTS.INSIGHTS.BASE, payload);
      console.log('Insights response:', res.data);
      if (res.data.insights) {
        setInsights(res.data.insights);
      }
    } catch (error) {
      console.error('Insights fetch error:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchGoals(false);
    setRefreshing(false);
  }, []);

  const availableBudget = goalBudget ? goalBudget.availableForNewGoals : 0;

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../asset/mascot.png')}
            style={styles.logoImage}
          />
          <View>
            <Text style={styles.headerTitle}>Finova Pulse</Text>
            <Text style={styles.headerSubtitle}>AI POWERED</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {/* <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Text style={styles.iconText}>🔔</Text>
                    </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('Profile')}>
            <View style={styles.userIconHead} />
            <View style={styles.userIconBody} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading || refreshing ? (
        <View
          style={[
            styles.content,
            {
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 100,
            },
          ]}>
          <MascotLoader size={140} />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }>
          {/* Monthly Pulse Score - only show when there are goals */}
          {goals.length > 0 && (
            <View style={styles.pulseCard}>
              <View style={styles.pulseCardGradient}>
                <Text style={styles.pulseCardTitle}>
                  Monthly Progress Score
                </Text>
                <Text style={styles.pulseCardSubtitle}>
                  Your overall goal achievement
                </Text>

                <View style={styles.pulseScoreContainer}>
                  <View style={styles.glowEffect} />
                  <CircularProgress
                    progress={averageAchievement}
                    size={160}
                    strokeWidth={14}
                  />
                </View>

                <Text style={styles.encourageText}>
                  {averageAchievement >= 75
                    ? '🚀 Outstanding progress! Keep it up!'
                    : averageAchievement >= 50
                    ? "💪 Great job! You're on track!"
                    : averageAchievement >= 25
                    ? '📈 Good start! Keep pushing!'
                    : '🌱 Start your journey to financial freedom!'}
                </Text>

                {availableBudget > 0 && (
                  <View style={{marginTop: spacing.xs, alignItems: 'center'}}>
                    <Text
                      style={[
                        styles.budgetBadge,
                        {
                          fontSize: typography.body,
                          paddingVertical: 6,
                          paddingHorizontal: spacing.md,
                        },
                      ]}>
                      {currencySymbol}
                      {formatNumber(availableBudget, 1)} available for goals
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Financial Goals — only shown when goals exist */}
          {goals.length > 0 && (
            <View style={styles.goalsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>💵 Financial Goals</Text>
              </View>

              {goals.map(goal => (
                <GoalCardWithSuggestion
                  key={goal.id}
                  title={goal.name}
                  progress={goal.progress}
                  achieveInMonths={goal.achieve_in_months}
                  targetAmount={
                    typeof goal.target_amount === 'string'
                      ? parseFloat(goal.target_amount)
                      : goal.target_amount
                  }
                  savedAmount={goal.saved_amount}
                  color={colors.success}
                  suggestionTitle="AI suggestions"
                  suggestionDescription="Track your progress and stay on target for this goal."
                  onCardPress={() =>
                    navigation.navigate('Contributions', {
                      goalId: goal.id,
                      goalName: goal.name,
                      targetAmount: goal.target_amount,
                      monthlyContribution: goal.monthly_contribution,
                      achieveInMonths: goal.achieve_in_months,
                      goalCreatedAt: goal.created_at,
                    })
                  }
                  onEditPress={() =>
                    navigation.navigate('EditGoal', {
                      goalId: goal.id,
                      name: goal.name,
                      target: goal.target_amount,
                      achieveIn: goal.achieve_in_months,
                      monthlyContribution: goal.monthly_contribution,
                      savedAmount: goal.saved_amount,
                      availableForNewGoals: goalBudget?.availableForNewGoals,
                    })
                  }
                  onAskAiPress={() =>
                    navigation.navigate('GoalChat', {
                      goalTitle: goal.name,
                      initialSuggestion: 'How can I achieve this goal faster?',
                    })
                  }
                />
              ))}
            </View>
          )}

          {/* AI Suggested Goals — only when budget available */}
          {availableBudget > 0 && (
            <View style={styles.suggestionsSection}>
              <View
                style={[styles.sectionHeader, {paddingHorizontal: spacing.lg}]}>
                <Text style={styles.sectionTitle}>✨ AI Suggested Goals</Text>
                {goals.length === 0 && (
                  <Text style={styles.budgetBadge}>
                    {currencySymbol}
                    {formatNumber(availableBudget, 1)} available for goals
                  </Text>
                )}
              </View>

              {insightsLoading ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.suggestionsContent}>
                  {[1, 2].map(k => (
                    <View key={k} style={styles.suggestionCard}>
                      <ActivityIndicator
                        size="small"
                        color={colors.primary}
                        style={{marginVertical: 20}}
                      />
                    </View>
                  ))}
                </ScrollView>
              ) : insights.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.suggestionsContent}>
                  {insights.map((insight, idx) => {
                    const {icon, text} = parseInsightTitle(insight.title);
                    return (
                      <View key={idx} style={styles.suggestionCard}>
                        <Text style={styles.suggestionIcon}>{icon}</Text>
                        <Text style={styles.suggestionName} numberOfLines={2}>
                          {text}
                        </Text>
                        <Text style={styles.suggestionAmount}>
                          {currencySymbol}
                          {insight.amount.toLocaleString()}
                        </Text>
                        <Text style={styles.suggestionMonths}>
                          {insight.target_months}{' '}
                          {insight.target_months === 1 ? 'month' : 'months'}
                        </Text>
                        <Text style={styles.suggestionDesc} numberOfLines={2}>
                          {insight.description}
                        </Text>
                        <TouchableOpacity
                          style={styles.suggestionAddBtn}
                          onPress={() =>
                            navigation.navigate('AddGoal', {
                              availableForNewGoals: availableBudget,
                              suggestionName: text,
                              suggestionTarget: insight.amount,
                              suggestionMonths: insight.target_months,
                              suggestionDescription: insight.description,
                            })
                          }>
                          <Text style={styles.suggestionAddBtnText}>
                            + Add Goal
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              ) : null}
            </View>
          )}

          {/* Empty State when no goals exist */}
          {goals.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <Image
                source={require('../../asset/happymascot.png')}
                style={styles.emptyStateMascot}
              />
              <Text style={styles.emptyStateTitle}>Hi, I'm Fino! 👋</Text>
              <Text style={styles.emptyStateDesc}>
                You haven't added any goals yet. Start your financial journey by
                adding a goal from the + button below or pick one from our
                suggestions.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* FAB */}
      {
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            if (availableBudget > 0) {
              navigation.navigate('AddGoal', {
                availableForNewGoals: availableBudget,
              });
            } else {
              Toast.show({
                type: 'error',
                text1: 'No Budget Available',
                text2: 'No more money is left to create a new goal.',
              });
            }
          }}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: spacing.sm,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  iconText: {
    fontSize: 16,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userIconHead: {
    width: 12,
    height: 12,
    borderRadius: radii.full,
    backgroundColor: colors.textPrimary,
    marginBottom: 2,
  },
  userIconBody: {
    width: 20,
    height: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  pulseCard: {
    marginBottom: spacing.xl,
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
  },
  pulseCardGradient: {
    backgroundColor: colors.pulseCardBackground,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: borderWidths.thin,
    borderColor: '#2a4a6a',
  },
  pulseCardTitle: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  pulseCardSubtitle: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  pulseScoreContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  glowEffect: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: radii.full,
    backgroundColor: colors.successSubtle,
    shadowColor: colors.success,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  encourageText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
    fontWeight: typography.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: typography.semibold,
    marginTop: spacing.md,
  },
  goalsSection: {
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '300',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    // paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  emptyStateMascot: {
    width: 140,
    height: 140,
    // marginBottom: spacing.lg,
    resizeMode: 'contain',
  },
  emptyStateTitle: {
    color: colors.textPrimary,
    fontSize: typography.h2,
    fontWeight: typography.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateDesc: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyState: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
  },
  // AI Suggestions
  suggestionsSection: {
    marginBottom: spacing.xxl,
  },
  suggestionsContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  budgetBadge: {
    color: colors.success,
    fontSize: typography.caption,
    fontWeight: typography.semibold,
    backgroundColor: colors.successSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
    overflow: 'hidden',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  suggestionCard: {
    width: 180,
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    borderWidth: borderWidths.thin,
    borderColor: colors.primarySubtle,
  },
  suggestionIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  suggestionName: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: typography.semibold,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  suggestionAmount: {
    color: colors.primary,
    fontSize: typography.h3,
    fontWeight: typography.bold,
    marginBottom: 2,
  },
  suggestionMonths: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginBottom: spacing.sm,
  },
  suggestionDesc: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 16,
    marginBottom: spacing.md,
    flex: 1,
  },
  suggestionAddBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  suggestionAddBtnText: {
    color: '#fff',
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
  },
});
