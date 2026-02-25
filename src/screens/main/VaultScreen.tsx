import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useCurrency} from '../../context/CurrencyContext';
import {Card} from '../../components/dashboard/Card';
import {StatCard} from '../../components/dashboard/StatCard';
import {AccountRow} from '../../components/dashboard/AccountRow';
import {AIInsightCard} from '../../components/dashboard/AIInsightCard';
import {
  typography,
  spacing,
  radii,
  categoryColors,
} from '../../constants/theme';
import {globalStyles} from '../../styles/globalStyles';
import { useThemeColors } from "../../context/ThemeContext";

export const VaultScreen: React.FC = () => {
    const colors = useThemeColors();
  const [viewMode, setViewMode] = useState<'consolidated' | 'manual'>(
    'consolidated',
  );
  const {currencySymbol} = useCurrency();

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={globalStyles.row}>
          <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoText, { color: colors.textPrimary }]}>◀▶</Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Vault</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              {viewMode === 'consolidated'
                ? 'CONSOLIDATED VIEW'
                : 'MANUAL TRACKING HUB'}
            </Text>
          </View>
        </View>
        <View style={globalStyles.row}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.cardBackground }]}
            onPress={() =>
              setViewMode(
                viewMode === 'consolidated' ? 'manual' : 'consolidated',
              )
            }>
            <Text style={[styles.iconText, { color: colors.textPrimary }]}>⟳</Text>
          </TouchableOpacity>
          {viewMode === 'manual' && (
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.iconText, { color: colors.textPrimary }]}>+</Text>
            </TouchableOpacity>
          )}
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Total Balance */}
        <View style={styles.balanceSection}>
          <Text style={globalStyles.sectionLabel}>TOTAL LIQUID BALANCE</Text>
          <View style={styles.balanceRow}>
            <Text style={[styles.rupeeSymbol, { color: colors.textPrimary }]}>{currencySymbol}</Text>
            <Text style={[styles.balanceValue, { color: colors.textPrimary }]}>12,45,600</Text>
            <Text style={[styles.balanceDecimal, { color: colors.textMuted }]}>
              .{viewMode === 'consolidated' ? '42' : '00'}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {viewMode === 'consolidated' ? (
            <>
              <StatCard
                label="AVAILABLE TO INVEST"
                value={`${currencySymbol}4.2L`}
              />
              <View style={styles.statGap} />
              <StatCard
                label="MONTHLY YIELD"
                value={`${currencySymbol}8,420`}
                valueColor={colors.warning}
              />
            </>
          ) : (
            <>
              <StatCard
                label="MANUAL INPUT BASE"
                value={`${currencySymbol}12.4L`}
              />
              <View style={styles.statGap} />
              <View style={[styles.lastUpdateBadge, { backgroundColor: colors.success }]}>
                <Text style={[styles.lastUpdateLabel, { color: colors.textPrimary }]}>LAST UPDATE</Text>
                <Text style={[styles.lastUpdateValue, { color: colors.textPrimary }]}>Today</Text>
              </View>
            </>
          )}
        </View>

        {/* Accounts Section */}
        <View style={styles.section}>
          <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.headingSmall}>
              {viewMode === 'consolidated'
                ? 'Connected Accounts'
                : 'Manual Accounts'}
            </Text>
            <Text style={globalStyles.caption}>
              {viewMode === 'consolidated' ? '4 Active' : '3 Accounts'}
            </Text>
          </View>

          <Card>
            <AccountRow
              icon="🏦"
              name={
                viewMode === 'consolidated' ? 'HDFC Bank' : 'Savings Account'
              }
              subtitle={
                viewMode === 'consolidated' ? '•••• 5829' : 'UPDATED 2 DAYS AGO'
              }
              amount={`${currencySymbol}8,24,500`}
              badge={viewMode === 'consolidated' ? 'GPAY LINKED' : 'UPDATE'}
              badgeVariant={viewMode === 'consolidated' ? 'success' : 'warning'}
            />
            <AccountRow
              icon="💰"
              name={
                viewMode === 'consolidated' ? 'ICICI Savings' : 'Cash in Hand'
              }
              subtitle={
                viewMode === 'consolidated'
                  ? '•••• 0042'
                  : 'UPDATED 12 DAYS AGO'
              }
              amount={
                viewMode === 'consolidated'
                  ? `${currencySymbol}3,12,000`
                  : `${currencySymbol}12,000`
              }
              badge={viewMode === 'consolidated' ? 'LOW INTEREST' : 'UPDATE'}
              badgeVariant={viewMode === 'consolidated' ? 'danger' : 'warning'}
            />
            <AccountRow
              icon="📱"
              name={
                viewMode === 'consolidated' ? 'Paytm Wallet' : 'Digital Wallet'
              }
              subtitle={
                viewMode === 'consolidated' ? 'Mobile Wallet' : 'UPDATED TODAY'
              }
              amount={`${currencySymbol}9,100`}
              badge={viewMode === 'consolidated' ? 'GPAY LINKED' : 'UPDATE'}
              badgeVariant={viewMode === 'consolidated' ? 'success' : 'warning'}
            />
          </Card>
        </View>

        {/* Monthly Spends */}
        <View style={styles.section}>
          <View style={globalStyles.sectionHeader}>
            <Text style={globalStyles.headingSmall}>Monthly Spends</Text>
            <Text style={globalStyles.headingSmall}>
              {currencySymbol}42,800
            </Text>
          </View>
          <Text style={[globalStyles.caption, styles.spendsSubtitle]}>
            {viewMode === 'consolidated'
              ? 'Smart Categorization'
              : 'Based on manual entries'}
          </Text>

          <Card>
            <View style={styles.chartRow}>
              <View style={styles.chartPlaceholder}>
                <View style={[styles.chartCircle, { borderColor: colors.primary }]}>
                  <Text style={styles.chartIcon}>📊</Text>
                </View>
              </View>
              <View style={styles.chartLegend}>
                {[
                  {
                    label: 'Shopping',
                    value: '35%',
                    color: categoryColors.shopping,
                  },
                  {label: 'Bills', value: '30%', color: categoryColors.bills},
                  {label: 'Food', value: '35%', color: categoryColors.food},
                ].map(item => (
                  <View key={item.label} style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, {backgroundColor: item.color}]}
                    />
                    <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                    <Text style={[styles.legendValue, { color: colors.textPrimary }]}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </View>

        {/* AI Insight */}
        <AIInsightCard
          type="insight"
          title="AI PROACTIVE INSIGHT"
          description={
            viewMode === 'consolidated'
              ? "Your 'Shopping' is 15% higher than usual. Switch to UPI at select stores for 5% cashback."
              : "Your 'Cash in Hand' hasn't been updated for a while. Consider updating for accurate tracking."
          }
        />

        <View style={{height: spacing.xxl}} />
      </ScrollView>
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
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
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
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  iconText: {
    fontSize: 18,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  avatarText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  balanceSection: {
    marginBottom: spacing.lg,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  rupeeSymbol: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    marginRight: 4,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: typography.bold,
  },
  balanceDecimal: {
    fontSize: typography.h3,
    fontWeight: typography.medium,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  statGap: {
    width: spacing.sm,
  },
  lastUpdateBadge: {
    flex: 1,
    borderRadius: radii.sm,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastUpdateLabel: {
    fontSize: 10,
    opacity: 0.8,
  },
  lastUpdateValue: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
  },
  section: {
    marginBottom: spacing.lg,
  },
  spendsSubtitle: {
    marginBottom: spacing.sm,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartPlaceholder: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCircle: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    borderWidth: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartIcon: {
    fontSize: 24,
  },
  chartLegend: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: radii.full,
    marginRight: spacing.sm,
  },
  legendLabel: {
    fontSize: typography.bodySmall,
    flex: 1,
  },
  legendValue: {
    fontSize: typography.bodySmall,
    fontWeight: typography.medium,
  },
});
