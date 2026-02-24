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
import {colors, typography, spacing, borderWidths} from '../../constants/theme';
import {globalStyles} from '../../styles/globalStyles';
import {FAQS} from '../../constants/faqs';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const HelpSupportScreen: React.FC = () => {
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
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Need specific help?</Text>
          <Text style={styles.contactText}>
            Our support team is here to assist you with any questions or issues.
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactSupport}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <Text style={globalStyles.sectionLabel}>
          Frequently Asked Questions
        </Text>
        <View style={styles.faqList}>
          {FAQS.map(faq => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleExpand(faq.id)}
                activeOpacity={0.7}>
                <Text style={styles.question}>{faq.question}</Text>
                <Text style={styles.expandIcon}>
                  {expandedId === faq.id ? '−' : '+'}
                </Text>
              </TouchableOpacity>
              {expandedId === faq.id && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyrightText}>© 2026 Finova AI</Text>
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
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    alignItems: 'center',
    borderWidth: borderWidths.thin,
    borderColor: colors.border,
  },
  contactTitle: {
    color: colors.textPrimary,
    fontSize: typography.h3,
    fontWeight: typography.bold,
    marginBottom: spacing.xs,
  },
  contactText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  contactButton: {
    backgroundColor: colors.primary,
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
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: borderWidths.thin,
    borderBottomColor: colors.border,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    minHeight: 60,
  },
  question: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: typography.medium,
    flex: 1,
    paddingRight: spacing.md,
  },
  expandIcon: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  answerContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  answer: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  copyrightText: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
