import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ReceiptScanner from '../../components/ReceiptScanner';

export default function ScanScreen() {
  const handleScanComplete = (data: {
    total?: number;
    date?: string;
    merchant?: string;
    items?: Array<{ description: string; amount: number }>;
  }) => {
    // Navigate to add expense screen with pre-filled data
    router.push({
      pathname: '/expenses/add',
      params: {
        amount: data.total?.toString() || '',
        description: data.merchant || '',
        date: data.date || new Date().toISOString().split('T')[0],
      },
    });
  };

  return (
    <View style={styles.container}>
      <ReceiptScanner
        onScanComplete={handleScanComplete}
        onClose={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});