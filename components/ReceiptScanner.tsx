import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { Camera, Upload, X, RefreshCw } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { createWorker } from 'tesseract.js';

interface ReceiptScannerProps {
  onScanComplete: (data: {
    total?: number;
    date?: string;
    merchant?: string;
    items?: Array<{ description: string; amount: number }>;
  }) => void;
  onClose: () => void;
}

export default function ReceiptScanner({ onScanComplete, onClose }: ReceiptScannerProps) {
  const { colors } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImagePickerAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        processReceipt(result.assets[0].uri);
      }
    } catch (err) {
      setError('Failed to pick image');
      console.error('Image picker error:', err);
    }
  };

  const processReceipt = async (imageUri: string) => {
    setScanning(true);
    setError(null);

    try {
      const worker = await createWorker('eng');
      
      const { data: { text } } = await worker.recognize(imageUri);
      
      await worker.terminate();

      // Process the extracted text
      const result = parseReceiptText(text);
      
      onScanComplete(result);
    } catch (err) {
      setError('Failed to process receipt');
      console.error('OCR error:', err);
    } finally {
      setScanning(false);
    }
  };

  const parseReceiptText = (text: string) => {
    // Basic receipt parsing logic
    const lines = text.split('\n');
    let total: number | undefined;
    let date: string | undefined;
    let merchant: string | undefined;
    const items: Array<{ description: string; amount: number }> = [];

    // Look for total amount (usually preceded by "TOTAL" or "AMOUNT")
    const totalLine = lines.find(line => 
      line.toLowerCase().includes('total') || 
      line.toLowerCase().includes('amount')
    );
    if (totalLine) {
      const matches = totalLine.match(/\$?\d+\.\d{2}/);
      if (matches) {
        total = parseFloat(matches[0].replace('$', ''));
      }
    }

    // Look for date (common formats: MM/DD/YYYY or DD/MM/YYYY)
    const dateLine = lines.find(line => 
      line.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/)
    );
    if (dateLine) {
      date = dateLine.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/)?.[0];
    }

    // Assume merchant name is one of the first lines
    merchant = lines[0]?.trim();

    // Look for items with prices
    lines.forEach(line => {
      const priceMatch = line.match(/\$?\d+\.\d{2}/);
      if (priceMatch) {
        const amount = parseFloat(priceMatch[0].replace('$', ''));
        const description = line.replace(priceMatch[0], '').trim();
        if (description && amount) {
          items.push({ description, amount });
        }
      }
    });

    return { total, date, merchant, items };
  };

  const retryScanning = () => {
    if (image) {
      processReceipt(image);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 3/4,
      backgroundColor: colors.cardHighlight,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 20,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.secondaryText,
      textAlign: 'center',
      marginTop: 12,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 12,
    },
    buttonText: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: '#fff',
      marginLeft: 8,
    },
    error: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.error,
      marginTop: 8,
      textAlign: 'center',
    },
    scanningContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanningText: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: '#fff',
      marginTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Receipt</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={styles.placeholder}>
              <Upload size={48} color={colors.secondaryText} />
              <Text style={styles.placeholderText}>
                Upload a receipt photo{'\n'}or take a new one
              </Text>
            </View>
          )}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Camera size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {image ? 'Retake Photo' : 'Take Photo'}
          </Text>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity style={[styles.button, { marginTop: 8 }]} onPress={retryScanning}>
            <RefreshCw size={20} color="#fff" />
            <Text style={styles.buttonText}>Retry Scanning</Text>
          </TouchableOpacity>
        )}
      </View>

      {scanning && (
        <View style={styles.scanningContainer}>
          <RefreshCw size={32} color="#fff" />
          <Text style={styles.scanningText}>Processing receipt...</Text>
        </View>
      )}
    </View>
  );
}