import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { BlurView } from 'expo-blur';
import { CircleArrowUp as ArrowUpCircle, CircleArrowDown as ArrowDownCircle, Receipt } from 'lucide-react-native';
import { theme } from '../theme/theme';
import CustomHeader from '../components/CustomHeader';
import WalletCard from '../components/WalletCard';
import EmptyState from '../components/EmptyState';
import { mockWallet, mockTransactions, mockUser } from '../utils/mockData';
import { Transaction } from '../types';

export default function WalletScreen() {
  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isDeduction = item.type === 'deduction';
    
    return (
      <View style={styles.transactionContainer}>
        <BlurView intensity={10} style={styles.transactionCard}>
          <View style={styles.transactionHeader}>
            <View style={styles.transactionIcon}>
              {isDeduction ? (
                <ArrowDownCircle size={24} color={theme.colors.error[500]} />
              ) : (
                <ArrowUpCircle size={24} color={theme.colors.success[500]} />
              )}
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.transactionDate}>
                {new Date(item.timestamp).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              isDeduction ? styles.deductionAmount : styles.allowanceAmount
            ]}>
              {isDeduction ? '-' : '+'}{mockWallet.currency} {Math.abs(item.amount).toLocaleString()}
            </Text>
          </View>
        </BlurView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Wallet" showProfile={false} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <WalletCard wallet={mockWallet} organizationName={mockUser.organizationName} />
        
        <View style={styles.transactionsSection}>
          <BlurView intensity={15} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
          </BlurView>
          
          {mockTransactions.length === 0 ? (
            <EmptyState
              icon={<Receipt size={64} color={theme.colors.secondary[400]} />}
              title="No transactions yet"
              description="Your transport allowance and trip deductions will appear here."
            />
          ) : (
            <FlatList
              data={mockTransactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.transactionsList}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary[50],
  },
  content: {
    flex: 1,
  },
  transactionsSection: {
    marginTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  sectionHeader: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary[800],
  },
  transactionsList: {
    paddingHorizontal: theme.spacing.md,
  },
  transactionContainer: {
    marginBottom: theme.spacing.sm,
  },
  transactionCard: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: theme.colors.glass.light,
    ...theme.shadows.sm,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  transactionIcon: {
    marginRight: theme.spacing.sm,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[800],
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary[500],
  },
  transactionAmount: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.heading,
  },
  deductionAmount: {
    color: theme.colors.error[500],
  },
  allowanceAmount: {
    color: theme.colors.success[500],
  },
});