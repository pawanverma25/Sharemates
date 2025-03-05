import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Users } from 'lucide-react-native';

type GroupCardProps = {
  id: number;
  name: string;
  members: number;
  totalBalance: number;
};

export default function GroupCard({ id, name, members, totalBalance }: GroupCardProps) {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push(`/groups/${id}`)}
    >
      <View style={styles.icon}>
        <Users size={24} color="#fff" />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.members}>{members} members</Text>
      </View>
      <View style={styles.balance}>
        <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
        <Text style={styles.balanceLabel}>total</Text>
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
    backgroundColor: '#00A86B',
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
  members: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#888',
  },
  balance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  balanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#888',
  },
});