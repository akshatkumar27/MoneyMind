import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useCurrency } from '../../context/CurrencyContext';
import { Card } from '../../components/dashboard/Card';
import { AssetRow } from '../../components/dashboard/AssetRow';
import { AIInsightCard } from '../../components/dashboard/AIInsightCard';
import { typography, spacing, radii } from '../../constants/theme';
import { globalStyles } from '../../styles/globalStyles';
import { useThemeColors } from "../../context/ThemeContext";

export const InvestHubScreen: React.FC = () => {
  const colors = useThemeColors();
  const { currencySymbol } = useCurrency();
  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoText, { color: colors.textPrimary }]}>◀▶</Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Invest Hub</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>SMART PORTFOLIO</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.cardBackground }]}>
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Portfolio Value */}
        <View style={styles.portfolioSection}>
          <Text style={[styles.portfolioLabel, { color: colors.textMuted }]}>Total Portfolio Value</Text>
          <View style={styles.portfolioRow}>
            <Text style={[styles.rupeeSymbol, { color: colors.textPrimary }]}>{currencySymbol}</Text>
            <Text style={[styles.portfolioValue, { color: colors.textPrimary }]}>24,85,420</Text>
            <View style={[styles.changePositiveBadge, { backgroundColor: colors.success }]}>
              <Text style={[styles.changePositiveText, { color: colors.textPrimary }]}>+1.2%</Text>
            </View>
          </View>
          <View style={styles.dayChangeRow}>
            <Text style={[styles.dayChangeLabel, { color: colors.textMuted }]}>24h Change:</Text>
            <Text style={[styles.dayChangeValue, { color: colors.success }]}>+{currencySymbol}28,620</Text>
            <TouchableOpacity>
              <Text style={[styles.historyLink, { color: colors.primary }]}>HISTORY</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Portfolio Optimizer */}
        <Card style={StyleSheet.flatten([styles.optimizerCard, { backgroundColor: colors.cardBackground }])}>
          <View style={styles.optimizerHeader}>
            <Text style={styles.optimizerIcon}>✨</Text>
            <Text style={[styles.optimizerTitle, { color: colors.success }]}>AI PORTFOLIO OPTIMIZER</Text>
          </View>
          <Text style={[styles.optimizerText, { color: colors.textSecondary }]}>
            Move {currencySymbol}10,000 from Savings to{' '}
            <Text style={[styles.highlightText, { color: colors.primary }]}>Index Fund</Text> for better
            long-term growth.
          </Text>
          <TouchableOpacity style={[styles.rebalanceButton, { backgroundColor: colors.warning }]}>
            <Text style={styles.rebalanceButtonText}>Apply Rebalance</Text>
          </TouchableOpacity>
        </Card>

        {/* Asset Allocation */}
        <View style={styles.assetSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Asset Allocation</Text>

          <AssetRow
            icon="📈"
            name="Mutual Funds"
            subtitle="10 Active SIPs"
            value={`${currencySymbol}14,20,000`}
            change="+18.4%"
            isPositive={true}
          />

          <AssetRow
            icon="🪙"
            name="Digital Gold"
            subtitle="45.2g"
            value={`${currencySymbol}3,15,420`}
            change="+6.2%"
            isPositive={true}
          />

          <AssetRow
            icon="🏦"
            name="Fixed Deposits"
            subtitle="3 FDs Active"
            value={`${currencySymbol}7,50,000`}
            change="-7.1%"
            isPositive={false}
          />
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]}>
        <Text style={[styles.fabText, { color: colors.textPrimary }]}>+</Text>
      </TouchableOpacity>
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
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  logoText: {
    fontSize: 12,
    fontWeight: typography.bold,
  },
  headerTitle: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
  headerSubtitle: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  portfolioSection: {
    marginBottom: spacing.lg,
  },
  portfolioLabel: {
    fontSize: typography.caption,
    marginBottom: spacing.xs,
  },
  portfolioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rupeeSymbol: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    marginRight: 4,
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: typography.bold,
  },
  changePositiveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.xs,
    marginLeft: spacing.sm,
  },
  changePositiveText: {
    fontSize: typography.caption,
    fontWeight: typography.semibold,
  },
  dayChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dayChangeLabel: {
    fontSize: typography.caption,
  },
  dayChangeValue: {
    fontSize: typography.caption,
    fontWeight: typography.medium,
    marginLeft: spacing.xs,
    flex: 1,
  },
  historyLink: {
    fontSize: typography.caption,
    fontWeight: typography.semibold,
  },
  optimizerCard: {
    marginBottom: spacing.lg,
  },
  optimizerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  optimizerIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  optimizerTitle: {
    fontSize: typography.caption,
    fontWeight: typography.semibold,
    letterSpacing: 0.5,
  },
  optimizerText: {
    fontSize: typography.bodySmall,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  highlightText: {
    fontWeight: typography.medium,
  },
  rebalanceButton: {
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  rebalanceButtonText: {
    color: '#000',
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
  },
  assetSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    marginBottom: spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radii.full,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    fontWeight: '300',
  },
});
