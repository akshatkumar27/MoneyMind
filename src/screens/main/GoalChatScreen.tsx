import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {MainStackParamList} from '../../navigation/MainTabNavigator';
import {typography, spacing, borderWidths} from '../../constants/theme';
import {ENDPOINTS} from '../../constants/endpoints';
import {globalStyles} from '../../styles/globalStyles';
import {Header} from '../../components/Header';
import {api} from '../../services/api';
import { useThemeColors } from "../../context/ThemeContext";

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type GoalChatRouteProp = RouteProp<MainStackParamList, 'GoalChat'>;

export const GoalChatScreen: React.FC = () => {
    const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<GoalChatRouteProp>();
  const goalTitle = route.params?.goalTitle || 'Goal Chat';

  const [isLoading, setIsLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoinWaitlist = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(ENDPOINTS.WAITLIST.JOIN, {
        feature: 'ai_goals',
      });

      if (response.data.success) {
        setJoined(true);
        Toast.show({
          type: 'success',
          text1: "You're on the list!",
          text2: "We'll notify you when AI Goals are available.",
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: response.data.message || 'Please try again later.',
        });
      }
    } catch (error: any) {
      console.error('Failed to join waitlist:', error);
      if (error.response && error.response.status === 409) {
        setJoined(true);
        Toast.show({
          type: 'info',
          text1: 'Already Joined',
          text2: 'You have already joined the waitlist!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Connection Error',
          text2: 'Please check your internet connection.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <Header title={goalTitle} />

      {/* Coming Soon Content */}
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.cardBackground }]}>
          <Text style={styles.icon}>🤖</Text>
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>AI Chat Coming Soon</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We're working on an intelligent AI assistant to help you achieve your
          financial goals faster.
        </Text>
        <View style={styles.featureList}>
          <Text style={[styles.featureItem, { color: colors.textSecondary }]}>✨ Personalized advice</Text>
          <Text style={[styles.featureItem, { color: colors.textSecondary }]}>📊 Smart goal tracking</Text>
          <Text style={[styles.featureItem, { color: colors.textSecondary }]}>💡 Investment insights</Text>
        </View>

        {joined ? (
          <View style={[styles.joinedContainer, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
            <Text style={[styles.joinedText, { color: colors.primary }]}>You're on the list! 🚀</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton, { backgroundColor: colors.primary }]}
            onPress={handleJoinWaitlist}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={colors.textPrimary} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Join Waitlist</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  featureList: {
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  featureItem: {
    fontSize: typography.body,
    marginBottom: spacing.sm,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
  joinedContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: borderWidths.thin
  },
  joinedText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
