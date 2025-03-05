import { useState } from 'react';
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
  ArrowRight,
  PlusCircle,
  DollarSign,
  Check,
  AlertCircle,
} from 'lucide-react-native';
import { useTheme } from '@/components/context/ThemeContext';

// Mock data for activity feed
const mockActivities = [
  {
    id: 1,
    type: 'expense_added',
    description: 'You added "Dinner at Italian Restaurant"',
    amount: 45.8,
    date: '2023-06-15',
    group: 'Trip to Paris',
  },
  {
    id: 2,
    type: 'payment_made',
    description: 'You paid John Doe',
    amount: 25.5,
    date: '2023-06-14',
    group: null,
  },
  {
    id: 3,
    type: 'expense_added',
    description: 'John Doe added "Groceries"',
    amount: 32.5,
    date: '2023-06-12',
    group: 'Roommates',
  },
  {
    id: 4,
    type: 'group_created',
    description: 'You created group "Office Lunch"',
    amount: null,
    date: '2023-06-11',
    group: 'Office Lunch',
  },
  {
    id: 5,
    type: 'expense_added',
    description: 'You added "Movie tickets"',
    amount: 24.0,
    date: '2023-06-10',
    group: 'Friends',
  },
  {
    id: 6,
    type: 'friend_added',
    description: 'You added Sarah Williams as a friend',
    amount: null,
    date: '2023-06-09',
    group: null,
  },
  {
    id: 7,
    type: 'payment_received',
    description: 'Jane Smith paid you',
    amount: 18.25,
    date: '2023-06-08',
    group: null,
  },
];

export default function ActivityScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you would fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Group activities by date
  const groupedActivities: { [key: string]: typeof mockActivities } = {};
  mockActivities.forEach((activity) => {
    const dateKey = formatDate(activity.date);
    if (!groupedActivities[dateKey]) {
      groupedActivities[dateKey] = [];
    }
    groupedActivities[dateKey].push(activity);
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'expense_added':
        return <PlusCircle size={20} color="#00A86B" />;
      case 'payment_made':
      case 'payment_received':
        return <DollarSign size={20} color="#5B7FFF" />;
      case 'group_created':
        return <Check size={20} color="#00A86B" />;
      case 'friend_added':
        return <Check size={20} color="#5B7FFF" />;
      default:
        return <AlertCircle size={20} color="#FF9500" />;
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    dateSection: {
      marginBottom: 16,
    },
    dateHeader: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.text,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    activityIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    activityContent: {
      flex: 1,
    },
    activityDescription: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.text,
      marginBottom: 2,
    },
    activityGroup: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.secondaryText,
    },
    activityAmount: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
      color: colors.primary,
      marginTop: 2,
    },
    activityAction: {
      marginLeft: 8,
    },
  });
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {Object.keys(groupedActivities).map((dateKey) => (
        <View key={dateKey} style={styles.dateSection}>
          <Text style={styles.dateHeader}>{dateKey}</Text>

          {groupedActivities[dateKey].map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityItem}
              onPress={() => {
                if (activity.type === 'expense_added') {
                  router.push(`/expenses/${activity.id}`);
                } else if (
                  activity.type === 'payment_made' ||
                  activity.type === 'payment_received'
                ) {
                  router.push(`/expenses/payments/${activity.id}`);
                } else if (activity.type === 'group_created') {
                  router.push(`/groups/${activity.id}`);
                } else if (activity.type === 'friend_added') {
                  router.push(`/groups/friends/${activity.id}`);
                }
              }}
            >
              <View style={styles.activityIconContainer}>
                {getActivityIcon(activity.type)}
              </View>

              <View style={styles.activityContent}>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>

                {activity.group && (
                  <Text style={styles.activityGroup}>in {activity.group}</Text>
                )}

                {activity.amount && (
                  <Text style={styles.activityAmount}>
                    {formatCurrency(activity.amount)}
                  </Text>
                )}
              </View>

              <View style={styles.activityAction}>
                <ArrowRight size={16} color={colors.secondaryText} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
