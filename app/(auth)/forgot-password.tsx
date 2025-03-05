import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = () => {
    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    // In a real app, you would call your API here
    // For now, we'll just show a success message
    setSuccess(true);
    setError(null);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Reset Password</Text>
          <Text style={styles.subHeaderText}>
            Enter your email address and we'll send you instructions to reset your password
          </Text>
        </View>

        <View style={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {success && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                Password reset instructions have been sent to your email address.
              </Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handleResetPassword}
          >
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
            <Send size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 30,
  },
  headerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#333',
    marginBottom: 8,
  },
  subHeaderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
  },
  successContainer: {
    backgroundColor: '#E6F7EF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  successText: {
    color: '#00A86B',
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  resetButton: {
    backgroundColor: '#00A86B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  loginLink: {
    fontFamily: 'Inter-SemiBold',
    color: '#00A86B',
  },
});