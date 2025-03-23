import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Link, RelativePathString, router } from "expo-router";
import { Eye, EyeOff, ArrowRight, LoaderCircle } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
    const { colors } = useTheme();
    const { user, isLoading, signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        signIn(email, password);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContainer: {
            flexGrow: 1,
            padding: 20,
            justifyContent: "center",
        },
        logoContainer: {
            alignItems: "center",
            marginBottom: 40,
        },
        logoText: {
            fontFamily: "Inter-Bold",
            fontSize: 32,
            color: colors.primary,
            marginBottom: 8,
        },
        tagline: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.text,
        },
        formContainer: {
            width: "100%",
        },
        errorText: {
            color: colors.error,
            marginBottom: 15,
            fontFamily: "Inter-Regular",
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
            borderRadius: 8,
            padding: 12,
            color: colors.text,
            fontSize: 16,
            fontFamily: "Inter-Regular",
        },
        passwordContainer: {
            flexDirection: "row",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            overflow: "hidden",
        },
        passwordInput: {
            flex: 1,
            padding: 12,
            fontSize: 16,
            fontFamily: "Inter-Regular",
            color: colors.text,
        },
        eyeIcon: {
            padding: 12,
            justifyContent: "center",
            alignItems: "center",
        },
        forgotPassword: {
            fontFamily: "Inter-Medium",
            color: colors.primary,
            textAlign: "right",
            marginBottom: 24,
        },
        loginButton: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 20,
        },
        loginButtonText: {
            color: colors.background,
            fontSize: 16,
            fontFamily: "Inter-SemiBold",
            marginRight: 8,
        },
        registerContainer: {
            flexDirection: "row",
            justifyContent: "center",
        },
        registerText: {
            fontFamily: "Inter-Regular",
            color: colors.text,
        },
        registerLink: {
            fontFamily: "Inter-SemiBold",
            color: colors.primary,
        },
    });
    return (
        <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Sharemates</Text>
                    <Text style={styles.tagline}>
                        Split expenses, not friendships
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="your@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={colors.secondaryText}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                placeholderTextColor={colors.secondaryText}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color={colors.text} />
                                ) : (
                                    <Eye size={20} color={colors.text} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Link href="/forgot-password" asChild>
                        <TouchableOpacity>
                            <Text style={styles.forgotPassword}>
                                Forgot password?
                            </Text>
                        </TouchableOpacity>
                    </Link>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                    >
                        {isLoading ? (
                            <LoaderCircle
                                color={colors.background}
                                rotation={20}
                            />
                        ) : (
                            <>
                                <Text style={styles.loginButtonText}>
                                    Login
                                </Text>
                                <ArrowRight
                                    size={20}
                                    color={colors.background}
                                />
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Don't have an account?{" "}
                        </Text>
                        <Link href="/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.registerLink}>Sign up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
