import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';
import {
    Card,
    GoalCardWithSuggestion,
    ProgressBar,
    SkeletonLoader,
} from '../../components';
import { colors, typography, spacing } from '../../constants';
import { MainStackParamList } from '../../navigation/MainTabNavigator';
import { api } from '../../services';

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
    progressColor = '#22c55e',
    trackColor = colors.cardBackground,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

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
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerText: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreText: {
        color: '#22c55e',
        fontSize: 42,
        fontWeight: '700',
    },
});

export const GoalPulseScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [averageAchievement, setAverageAchievement] = useState(0);
    const [goalBudget, setGoalBudget] = useState<GoalBudget | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchGoals();
        }, [])
    );

    const fetchGoals = async () => {
        try {
            setIsLoading(true);
            const response = await api.get<GoalsResponse>('/api/goals');
            if (response.data.success) {
                setGoals(response.data.goals);
                setAverageAchievement(response.data.averageAchievement);
                setGoalBudget(response.data.goalBudget);
                console.log(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch goals:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
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
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <View style={styles.userIconHead} />
                        <View style={styles.userIconBody} />
                    </TouchableOpacity>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.content}>
                    {/* Skeleton for Pulse Card */}
                    <View style={styles.pulseCard}>
                        <View style={styles.pulseCardGradient}>
                            <SkeletonLoader width={200} height={32} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width={150} height={16} style={{ marginBottom: 24 }} />

                            <View style={styles.pulseScoreContainer}>
                                <SkeletonLoader width={160} height={160} borderRadius={80} />
                            </View>

                            <SkeletonLoader width={250} height={20} />
                        </View>
                    </View>

                    {/* Skeleton for Goals Section */}
                    <View style={styles.goalsSection}>
                        <View style={styles.sectionHeader}>
                            <SkeletonLoader width={120} height={24} />
                        </View>

                        {/* 3 Skeleton Goal Cards */}
                        {[1, 2, 3].map((key) => (
                            <View key={key} style={[styles.combinedCard, { padding: 16, marginBottom: 16 }]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <SkeletonLoader width={150} height={24} />
                                    <SkeletonLoader width={50} height={24} />
                                </View>
                                <SkeletonLoader width={100} height={16} style={{ marginBottom: 16 }} />
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                    <SkeletonLoader width="100%" height={8} />
                                </View>
                                <SkeletonLoader width="100%" height={60} borderRadius={8} />
                            </View>
                        ))}
                    </View>
                </View>
            ) : (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Monthly Pulse Score - Premium Card */}
                    <View style={styles.pulseCard}>
                        <View style={styles.pulseCardGradient}>
                            <Text style={styles.pulseCardTitle}>Monthly Progress Score</Text>
                            <Text style={styles.pulseCardSubtitle}>Your overall goal achievement</Text>

                            <View style={styles.pulseScoreContainer}>
                                <View style={styles.glowEffect} />
                                <CircularProgress progress={averageAchievement} size={160} strokeWidth={14} />
                            </View>

                            <Text style={styles.encourageText}>
                                {averageAchievement >= 75 ? '🚀 Outstanding progress! Keep it up!' :
                                    averageAchievement >= 50 ? '💪 Great job! You\'re on track!' :
                                        averageAchievement >= 25 ? '📈 Good start! Keep pushing!' :
                                            '🌱 Start your journey to financial freedom!'}
                            </Text>
                        </View>
                    </View>

                    {/* Financial Goals */}
                    <View style={styles.goalsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Financial Goals</Text>
                        </View>

                        {goals.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>No goals yet. Tap + to add one!</Text>
                            </View>
                        ) : (
                            goals.map((goal) => (
                                <GoalCardWithSuggestion
                                    key={goal.id}
                                    title={goal.name}
                                    progress={goal.progress}
                                    achieveInMonths={goal.achieve_in_months}
                                    color="#22c55e"
                                    suggestionTitle="AI suggestions"
                                    suggestionDescription="Track your progress and stay on target for this goal."
                                    onCardPress={() => navigation.navigate('Contributions', {
                                        goalId: goal.id,
                                        goalName: goal.name,
                                        targetAmount: goal.target_amount,
                                        monthlyContribution: goal.monthly_contribution,
                                        achieveInMonths: goal.achieve_in_months,
                                        goalCreatedAt: goal.created_at,
                                    })}
                                    onEditPress={() => navigation.navigate('EditGoal', {
                                        name: goal.name,
                                        target: goal.target_amount,
                                        achieveIn: goal.achieve_in_months,
                                        monthlyContribution: goal.monthly_contribution,
                                    })}
                                    onAskAiPress={() => navigation.navigate('GoalChat', {
                                        goalTitle: goal.name,
                                        initialSuggestion: 'How can I achieve this goal faster?',
                                    })}
                                />
                            ))
                        )}
                    </View>
                </ScrollView>
            )}

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddGoal', {
                    availableForNewGoals: goalBudget?.availableForNewGoals
                })}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    logoImage: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: spacing.sm,
    },
    logoText: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: typography.bold,
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
        borderRadius: 18,
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
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    userIconHead: {
        width: 12,
        height: 12,
        borderRadius: 6,
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
    avatarText: {
        fontSize: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    smartSaveCard: {
        backgroundColor: '#1a3a5c',
        marginBottom: spacing.lg,
    },
    smartSaveHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    smartSaveLabel: {
        color: '#22c55e',
        fontSize: typography.caption,
        fontWeight: typography.semibold,
    },
    goldBadge: {
        backgroundColor: '#f59e0b',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: spacing.sm,
    },
    goldBadgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: typography.bold,
    },
    roundUpLabel: {
        color: colors.textSecondary,
        fontSize: typography.caption,
        marginBottom: 4,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    rupeeSymbol: {
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: typography.bold,
    },
    amountValue: {
        color: colors.textPrimary,
        fontSize: 32,
        fontWeight: typography.bold,
    },
    valueAddedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
        alignSelf: 'flex-end',
    },
    valueAddedLabel: {
        color: colors.textMuted,
        fontSize: 10,
        marginRight: spacing.xs,
    },
    valueAddedAmount: {
        color: '#22c55e',
        fontSize: typography.bodySmall,
        fontWeight: typography.semibold,
    },
    pulseScoreSection: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        marginBottom: spacing.lg,
    },
    pulseCard: {
        marginBottom: spacing.xl,
        borderRadius: 20,
        overflow: 'hidden',
    },
    pulseCardGradient: {
        backgroundColor: '#1a2a3a',
        borderRadius: 20,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
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
        borderRadius: 90,
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 0 },
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
    },
    changePositive: {
        color: '#22c55e',
        fontSize: typography.bodySmall,
        fontWeight: typography.semibold,
    },
    pulseScoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: spacing.md,
    },
    scoreCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 3,
        borderColor: '#22c55e',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    scoreValue: {
        color: '#22c55e',
        fontSize: typography.h2,
        fontWeight: typography.bold,
    },
    scoreInfo: {
        flex: 1,
    },
    scoreMessage: {
        color: colors.textPrimary,
        fontSize: typography.bodySmall,
        fontWeight: typography.medium,
    },
    scoreSubtext: {
        color: colors.textMuted,
        fontSize: typography.caption,
        marginTop: 2,
    },
    goalsSection: {
        marginBottom: spacing.xxl,
    },
    analyticsLink: {
        color: colors.primary,
        fontSize: typography.caption,
        fontWeight: typography.semibold,
        letterSpacing: 0.5,
    },
    progressMessage: {
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        padding: spacing.sm,
        alignItems: 'center',
    },
    progressText: {
        color: colors.textSecondary,
        fontSize: typography.caption,
    },
    fab: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    fabText: {
        color: colors.textPrimary,
        fontSize: 28,
        fontWeight: '300',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    combinedCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        marginBottom: spacing.md,
    },
    emptyState: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyStateText: {
        color: colors.textSecondary,
        fontSize: typography.body,
        textAlign: 'center',
    },
});
