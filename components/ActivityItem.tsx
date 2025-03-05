import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { PlusCircle, DollarSign, Check, AlertCircle, ArrowRight } from 'lucide-react-native';

type ActivityItemProps = {
  id: number;
  type: 'expense_added' | 'payment_made' | 'payment_received' | 'group_created' | 'friend_added';
  description: string;
  amount?: number;
  date: string;
  group?: string | null;
};

export default function ActivityItem({ id, type, description, amount, date, group }: ActivityItemProps) {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getActivityIcon = () => {
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

  const handlePress = () => {
    if (type === 'expense_added') {
      router.push(`/expenses/${id}`);
    } else if (type === 'payment_made' || type === 'payment_received') {
      router.push(`/expenses/payments/${id}`);
    } else if (type === 'group_created') {
      router.push(`/groups/${id}`);
    } else if (type === 'friend_added') {
      router.push(`/groups/friends/${id}`);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        {getActivityIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>{description}</Text>
        
        {group && (
          <Text style={styles.group}>in {group}</Text>
        )}
        
        {amount !== undefined && (
          <Text style={styles.amount}>{formatCurrency(amount)}</Text>
        )}
      </View>
      
      <View style={styles.action}>
        <ArrowRight size={16} color="#888" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  description: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  group: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#888',
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#00A86B',
    marginTop: 2,
  },
  action: {
    marginLeft: 8,
  },
});