import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Wallet, TrendingUp } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { Wallet as WalletType } from '../types';

interface WalletCardProps {
  wallet: WalletType;
  organizationName: string;
}

export default function WalletCard({ wallet, organizationName }: WalletCardProps) {
  const usagePercentage = ((wallet.monthlyAllowance - wallet.balance) / wallet.monthlyAllowance) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary[600], theme.colors.primary[800]]}
        style={styles.gradient}
      >
        <BlurView intensity={20} style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Wallet size={24} color={theme.colors.secondary[50]} />
              <Text style={styles.title}>Monthly Transport Allowance</Text>
            </View>
            <Text style={styles.organization}>Allocated by {organizationName}</Text>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.currency}>{wallet.currency}</Text>
            <Text style={styles.balance}>{wallet.balance.toLocaleString()}</Text>
            <Text style={styles.remaining}>Remaining Balance</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.allowanceContainer}>
              <Text style={styles.allowanceLabel}>Monthly Allowance</Text>
              <Text style={styles.allowanceAmount}>
                {wallet.currency} {wallet.monthlyAllowance.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.usageContainer}>
              <TrendingUp size={16} color={theme.colors.secondary[300]} />
              <Text style={styles.usageText}>
                {usagePercentage.toFixed(0)}% used this month
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${usagePercentage}%` }
                ]} 
              />
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  gradient: {
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
  },
  organization: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[300],
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  currency: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[300],
  },
  balance: {
    fontSize: theme.fontSizes['4xl'],
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
    marginVertical: theme.spacing.xs,
  },
  remaining: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[300],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.sm,
  },
  allowanceContainer: {
    flex: 1,
  },
  allowanceLabel: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[400],
    marginBottom: 2,
  },
  allowanceAmount: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[50],
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  usageText: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[300],
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.glass.medium,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.secondary[50],
    borderRadius: 2,
  },
});