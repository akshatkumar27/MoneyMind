import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../constants';
import { MainStackParamList } from '../../navigation/MainTabNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type GoalChatRouteProp = RouteProp<MainStackParamList, 'GoalChat'>;

export const GoalChatScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<GoalChatRouteProp>();
    const goalTitle = route.params?.goalTitle || 'Goal Chat';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{goalTitle}</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Coming Soon Content */}
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🤖</Text>
                </View>
                <Text style={styles.title}>AI Chat Coming Soon</Text>
                <Text style={styles.subtitle}>
                    We're working on an intelligent AI assistant to help you achieve your financial goals faster.
                </Text>
                <View style={styles.featureList}>
                    <Text style={styles.featureItem}>✨ Personalized advice</Text>
                </View>
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
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: typography.medium,
    },
    headerTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.semibold,
        flex: 1,
        marginLeft: spacing.md,
    },
    headerSpacer: {
        width: 36,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    icon: {
        fontSize: 48,
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.h2,
        fontWeight: typography.bold,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: typography.body,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    featureList: {
        alignItems: 'flex-start',
    },
    featureItem: {
        color: colors.textSecondary,
        fontSize: typography.body,
        marginBottom: spacing.sm,
    },
});

