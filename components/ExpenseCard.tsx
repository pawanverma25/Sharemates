import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

type ExpenseCardProps = {
  id: number;
  description: string;
  amount: number;
  date: string;
  paidBy: string;
  group?: string;
  participants?: string[];
};

export default function ExpenseCard({ id, description, amount, date, paidBy, group, participants }: ExpenseCardProps) {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push(`/expenses/${id}`)}
    >
      <View style={styles.header}>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.amount}>
          <Text style={styles.amountText}>{formatCurrency(amount)}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.info}>
          <Text style={styles.date}>{formatDate(date)}</Text>
          {group && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.group}>{group}</Text>
            </>
          )}
        </View>
        
        <View style={styles.participants}>
          <Text style={styles.paidBy}>
            {paidBy === 'You' ? 'You paid' : `${paidBy} paid`}
          </Text>
          {participants && (
            <Text style={styles.participantsText}>
              {`Split with ${participants.length} people`}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.action}>
        <ArrowRight size={16} color="#888" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  amount: {
    backgroundColor: '#F0F9F6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  amountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#00A86B',
  },
  details: {
    marginBottom: 8,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#888',
  },
  dot: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#888',
    marginHorizontal: 4,
  },
  group: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#888',
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidBy: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  participantsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#888',
  },
  action: {
    alignItems: 'flex-end',
  },
});