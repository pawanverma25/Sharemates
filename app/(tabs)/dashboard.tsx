import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import {
  PlusCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from 'lucide-react-native';
import { useTheme } from '@/components/context/ThemeContext';

// Mock data for dashboard
const mockBalances = [
  { id: 1, name: 'John Doe', amount: 25.5, isOwed: true },
  { id: 2, name: 'Jane Smith', amount: 12.75, isOwed: false },
  { id: 3, name: 'Mike Johnson', amount: 8.3, isOwed: true },
];

const mockRecentExpenses = [
  {
    id: 1,
    description: 'Dinner at Italian Restaurant',
    amount: 45.8,
    date: '2023-06-15',
    paidBy: 'You',
  },
  {
    id: 2,
    description: 'Groceries',
    amount: 32.5,
    date: '2023-06-12',
    paidBy: 'John Doe',
  },
  {
    id: 3,
    description: 'Movie tickets',
    amount: 24.0,
    date: '2023-06-10',
    paidBy: 'You',
  },
];

export default function DashboardScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalOwe, setTotalOwe] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  useEffect(() => {
    calculateBalances();
  }, []);

  const calculateBalances = () => {
    let owed = 0;
    let owe = 0;

    mockBalances.forEach((balance) => {
      if (balance.isOwed) {
        owed += balance.amount;
      } else {
        owe += balance.amount;
      }
    });

    setTotalOwed(owed);
    setTotalOwe(owe);
    setNetBalance(owed - owe);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you would fetch fresh data here
    setTimeout(() => {
      calculateBalances();
      setRefreshing(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    balanceSummary: {
      padding: 16,
      backgroundColor: colors.background,
      marginBottom: 8,
    },
    balanceCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    balanceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    balanceTitle: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.secondaryText,
    },
    balanceAmount: {
      fontFamily: 'Inter-Bold',
      fontSize: 32,
      marginBottom: 4,
    },
    balanceDescription: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.secondaryText,
    },
    positiveAmount: {
      color: colors.success,
      fontFamily: 'Inter-SemiBold',
    },
    negativeAmount: {
      color: colors.error,
      fontFamily: 'Inter-SemiBold',
    },
    neutralAmount: {
      color: colors.text,
      fontFamily: 'Inter-SemiBold',
    },
    detailedBalances: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    balanceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      flex: 0.48,
      borderWidth: 1,
      borderColor: colors.border,
    },
    balanceIconPositive: {
      backgroundColor: colors.success,
      borderRadius: 8,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    balanceIconNegative: {
      backgroundColor: colors.error,
      borderRadius: 8,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    balanceDetails: {
      flex: 1,
    },
    balanceLabel: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.secondaryText,
      marginBottom: 2,
    },
    section: {
      backgroundColor: colors.background,
      marginBottom: 8,
      paddingVertical: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      color: colors.text,
    },
    seeAllText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.success,
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardHighlight,
      borderRadius: 8,
      padding: 12,
      marginRight: 12,
    },
    actionButtonText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.primary,
      marginLeft: 8,
    },
    expenseItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    expenseDetails: {
      flex: 1,
    },
    expenseDescription: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,
    },
    expenseDate: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.secondaryText,
    },
    expenseAmount: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    expenseAmountText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.text,
      marginRight: 8,
    },
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    balanceName: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.text,
    },
    balanceRowAmount: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
    },
  });
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.balanceSummary}>
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
          </View>
          <Text
            style={[
              styles.balanceAmount,
              netBalance > 0
                ? styles.positiveAmount
                : netBalance < 0
                ? styles.negativeAmount
                : styles.neutralAmount,
            ]}
          >
            {formatCurrency(Math.abs(netBalance))}
          </Text>
          <Text style={styles.balanceDescription}>
            {netBalance > 0
              ? 'You are owed in total'
              : netBalance < 0
              ? 'You owe in total'
              : 'All settled up!'}
          </Text>
        </View>

        <View style={styles.detailedBalances}>
          <View style={styles.balanceItem}>
            <View style={styles.balanceIconPositive}>
              <TrendingUp size={20} color="#fff" />
            </View>
            <View style={styles.balanceDetails}>
              <Text style={styles.balanceLabel}>You are owed</Text>
              <Text style={styles.positiveAmount}>
                {formatCurrency(totalOwed)}
              </Text>
            </View>
          </View>

          <View style={styles.balanceItem}>
            <View style={styles.balanceIconNegative}>
              <TrendingDown size={20} color="#fff" />
            </View>
            <View style={styles.balanceDetails}>
              <Text style={styles.balanceLabel}>You owe</Text>
              <Text style={styles.negativeAmount}>
                {formatCurrency(totalOwe)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/expenses/add')}
          >
            <PlusCircle size={24} color="#00A86B" />
            <Text style={styles.actionButtonText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/expenses/settle')}
          >
            <DollarSign size={24} color="#00A86B" />
            <Text style={styles.actionButtonText}>Settle Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity onPress={() => router.push('/expenses')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {mockRecentExpenses.map((expense) => (
          <TouchableOpacity
            key={expense.id}
            style={styles.expenseItem}
            onPress={() => router.push(`/expenses/${expense.id}`)}
          >
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseDescription}>
                {expense.description}
              </Text>
              <Text style={styles.expenseDate}>
                {formatDate(expense.date)} • {expense.paidBy}
              </Text>
            </View>
            <View style={styles.expenseAmount}>
              <Text style={styles.expenseAmountText}>
                {formatCurrency(expense.amount)}
              </Text>
              <ArrowRight size={16} color="#888" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Balances</Text>
          <TouchableOpacity onPress={() => router.push('/groups')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {mockBalances.map((balance) => (
          <TouchableOpacity
            key={balance.id}
            style={styles.balanceRow}
            onPress={() => router.push(`/groups/friends/${balance.id}`)}
          >
            <Text style={styles.balanceName}>{balance.name}</Text>
            <Text
              style={[
                styles.balanceRowAmount,
                balance.isOwed ? styles.positiveAmount : styles.negativeAmount,
              ]}
            >
              {balance.isOwed ? 'owes you ' : 'you owe '}
              {formatCurrency(balance.amount)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
