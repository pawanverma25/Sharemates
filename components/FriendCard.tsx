import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { User } from 'lucide-react-native';

type FriendCardProps = {
  id: number;
  name: string;
  balance: number;
  isOwed: boolean;
};

export default function FriendCard({ id, name, balance, isOwed }: FriendCardProps) {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push(`/groups/friends/${id}`)}
    >
      <View style={styles.icon}>
        <User size={24} color="#fff" />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        {balance > 0 ? (
          <Text style={[
            styles.balance,
            isOwed ? styles.positiveBalance : styles.negativeBalance
          ]}>
            {isOwed ? `owes you ${formatCurrency(balance)}` : `you owe ${formatCurrency(balance)}`}
          </Text>
        ) : (
          <Text style={styles.settledBalance}>all settled up</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  icon: {
    backgroundColor: '#5B7FFF',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  balance: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  positiveBalance: {
    color: '#00A86B',
  },
  negativeBalance: {
    color: '#FF3B30',
  },
  settledBalance: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#888',
  },
});