import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackButton} from '../../components/BackButton';
import {Header} from '../../components/Header';
import {typography, spacing, borderWidths} from '../../constants/theme';
import {globalStyles} from '../../styles/globalStyles';
import {FAQS} from '../../constants/faqs';
import { useThemeColors } from "../../context/ThemeContext";

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const HelpSupportScreen: React.FC = () => {
    const colors = useThemeColors();
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContactSupport = () => {
    // Replace with your actual WhatsApp number
    Linking.openURL(
      'https://wa.me/919569937537?text=Hello%20Finova%20AI%20Support',
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Header title="Help & Support" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Section */}
        <View style={[styles.contactCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>Need specific help?</Text>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            Our support team is here to assist you with any questions or issues.
          </Text>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: colors.primary }]}
            onPress={handleContactSupport}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <Text style={globalStyles.sectionLabel}>
          Frequently Asked Questions
        </Text>
        <View style={[styles.faqList, { backgroundColor: colors.cardBackground }]}>
          {FAQS.map(faq => (
            <View key={faq.id} style={[styles.faqItem, { borderBottomColor: colors.border }]}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleExpand(faq.id)}
                activeOpacity={0.7}>
                <Text style={[styles.question, { color: colors.textPrimary }]}>{faq.question}</Text>
                <Text style={[styles.expandIcon, { color: colors.primary }]}>
                  {expandedId === faq.id ? '−' : '+'}
                </Text>
              </TouchableOpacity>
              {expandedId === faq.id && (
                <View style={styles.answerContainer}>
                  <Text style={[styles.answer, { color: colors.textSecondary }]}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.copyrightText, { color: colors.textMuted }]}>© 2026 Finova AI</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  contactCard: {
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    alignItems: 'center',
    borderWidth: borderWidths.thin
  },
  contactTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  contactText: {
    fontSize: typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  contactButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: typography.bold,
  },
  faqList: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: borderWidths.thin
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    minHeight: 60,
  },
  question: {
    fontSize: typography.body,
    fontWeight: typography.medium,
    flex: 1,
    paddingRight: spacing.md,
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  answerContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  answer: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  copyrightText: {
    fontSize: typography.caption,
  },
});
