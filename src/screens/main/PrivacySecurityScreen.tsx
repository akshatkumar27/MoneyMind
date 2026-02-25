import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackButton} from '../../components/BackButton';
import {Header} from '../../components/Header';
import {typography, spacing} from '../../constants/theme';
import {globalStyles} from '../../styles/globalStyles';
import { useThemeColors } from "../../context/ThemeContext";

export const PrivacySecurityScreen: React.FC = () => {
    const colors = useThemeColors();
  const navigation = useNavigation();

  const Section = ({title, content}: {title: string; content: string}) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Header title="Privacy & Security" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.mainDescription, { color: colors.textSecondary }]}>
          At Finova AI, we take your privacy and security seriously. This
          document outlines how we protect your data and your rights as a user.
        </Text>

        <Section
          title="1. Data Collection & Usage"
          content="We only collect information necessary to provide you with personalized financial insights. This includes your income, expenses, and financial goals. We do not sell your personal data to third parties."
        />

        <Section
          title="2. Data Security"
          content="Your data is encrypted using industry-standard AES-256 encryption both in transit and at rest. We use secure servers and restrict access to personal information to authorized personnel only."
        />

        <Section
          title="3. User Rights"
          content="You have the right to access, correct, or delete your personal data at any time. You can request a copy of your data or account deletion by contacting our support team."
        />

        <Section
          title="4. Third-Party Services"
          content="We may use trusted third-party services for analytics and payment processing. These services are compliant with GDPR and other data protection regulations."
        />

        <Section
          title="5. Updates to Policy"
          content="We may update this privacy policy from time to time. We will notify you of any significant changes through the app or via email."
        />

        <Text style={[styles.footer, { color: colors.textMuted }]}>Last updated: February 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  mainDescription: {
    fontSize: typography.body,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  sectionContent: {
    fontSize: typography.body,
    lineHeight: 24,
  },
  footer: {
    fontSize: typography.caption,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
});
