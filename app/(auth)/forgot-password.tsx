import { useTheme } from "@/context/ThemeContext";
import { Link, router } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ForgotPasswordScreen() {
    const { colors } = useTheme();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = () => {
        // Basic validation
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        // In a real app, you would call your API here
        // For now, we'll just show a success message
        setSuccess(true);
        setError(null);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
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
            fontFamily: "Inter-Bold",
            fontSize: 28,
            color: colors.text,
            marginBottom: 8,
        },
        subHeaderText: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.secondaryText,
            lineHeight: 22,
        },
        formContainer: {
            width: "100%",
        },
        errorText: {
            color: colors.error,
            marginBottom: 15,
            fontFamily: "Inter-Regular",
        },
        successContainer: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
        },
        successText: {
            color: colors.primary,
            fontFamily: "Inter-Medium",
        },
        inputContainer: {
            marginBottom: 20,
        },
        label: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            marginBottom: 8,
            color: colors.text,
        },
        input: {
            borderWidth: 1,
            borderColor: colors.border,
            color: colors.text,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            fontFamily: "Inter-Regular",
        },
        resetButton: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 20,
        },
        resetButtonText: {
            color: colors.background,
            fontSize: 16,
            fontFamily: "Inter-SemiBold",
            marginRight: 8,
        },
        loginContainer: {
            flexDirection: "row",
            justifyContent: "center",
        },
        loginText: {
            fontFamily: "Inter-Regular",
            color: colors.secondaryText,
        },
        loginLink: {
            fontFamily: "Inter-SemiBold",
            color: colors.primary,
        },
    });

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Reset Password</Text>
                    <Text style={styles.subHeaderText}>
                        Enter your email address and we'll send you instructions
                        to reset your password
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {success && (
                        <View style={styles.successContainer}>
                            <Text style={styles.successText}>
                                Password reset instructions have been sent to
                                your email address.
                            </Text>
                        </View>
                    )}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={colors.secondaryText}
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
                        <Text style={styles.resetButtonText}>
                            Send Reset Link
                        </Text>
                        <Send size={20} color={colors.background} />
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>
                            Remember your password?
                        </Text>
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
