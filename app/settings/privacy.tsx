import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../components/context/ThemeContext';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    title: {
      fontFamily: 'Inter-Bold',
      fontSize: 24,
      color: colors.text,
      marginBottom: 16,
    },
    heading: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 12,
    },
    paragraph: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.secondaryText,
      lineHeight: 24,
      marginBottom: 16,
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: 8,
      paddingLeft: 16,
    },
    bullet: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.secondaryText,
      marginRight: 8,
    },
    bulletText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.secondaryText,
      flex: 1,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.paragraph}>
            At Sharemates, we take your privacy seriously. This policy describes how we collect, use,
            and protect your personal information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Information We Collect</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Account information (name, email, profile picture)
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Transaction data (expenses, payments, group activities)
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Device information and usage statistics
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your information to provide and improve our services, including:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Processing your expenses and payments
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Maintaining and improving our services
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Sending you important notifications and updates
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Data Security</Text>
          <Text style={styles.paragraph}>
            We implement industry-standard security measures to protect your data. This includes
            encryption, secure servers, and regular security audits.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Access your personal data
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Request data correction or deletion
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Opt-out of marketing communications
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about our privacy policy or your data, please contact us at
            privacy@sharemates.app
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}