import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { userService } from "@/services/userService";
import { ValidationUtil } from "@/util/validations";
import { Link, router } from "expo-router";
import { ArrowRight, Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface FieldErrors {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

export default function RegisterScreen() {
    const { colors } = useTheme();
    const { user, isLoading, signUp } = useAuth();
    const { showAlert } = useAlert();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [usernameApiCallTimeout, setUsernameApiCallTimeout] = useState<NodeJS.Timeout | null>(null);
    const [emailApiCallTimeout, setEmailApiCallTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateName = (text: string) => {
        try{
            ValidationUtil.validateName(text);
        } catch (error: any){
            setFieldErrors((prev) => ({
                ...prev,
                name: error.message,
            }));
            return false;
        }
        setFieldErrors((prev) => ({ ...prev, email: undefined }));
        return true;
    };

    const validateUsername = (text: string) => {
        try{
            ValidationUtil.validateUsername(text);
        } catch (error: any){
            setFieldErrors((prev) => ({
                ...prev,
                username: error.message,
            }));
            return false;
        }
        setFieldErrors((prev) => ({ ...prev, username: undefined }));
        return true;
    };

    const validateEmail = (text: string) => {
        try{
            ValidationUtil.validateEmail(text);
        } catch (error: any){
            setFieldErrors((prev) => ({
                ...prev,
                email: error.message,
            }));
            return false;
        }
        setFieldErrors((prev) => ({ ...prev, email: undefined }));
        return true;
    };

    const validatePassword = (text: string) => {
        try{
            ValidationUtil.validatePassword(text);
        } catch (error: any){
            setFieldErrors((prev) => ({
                ...prev,
                password: error.message,
            }));
            return false;
        }
        setFieldErrors((prev) => ({ ...prev, password: undefined }));
        return true;
    };

    const validateConfirmPassword = (text: string) => {
        try{
            ValidationUtil.validateConfirmPassword(text, password);
        } catch (error: any){
            setFieldErrors((prev) => ({
                ...prev,
                confirmPassword: error.message,
            }));
            return false;
        }
        setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        return true;
    };

    const checkUsernameExists = async (username: string) => {
        try {
            const response = await userService.checkUsernameExists(username);
            return response.exists;
        } catch (error: any) {
            setFieldErrors((prev) => ({
                ...prev,
                username: "Couldn't check username availability. Please try again.",
            }));
            return false;
        }
    };

    const checkEmailExists = async (email: string) => {
        try {
            const response = await userService.checkEmailExists(email);
            return response.exists;
        } catch (error: any) {
            setFieldErrors((prev) => ({
                ...prev,
                email: "Couldn't check email availability. Please try again.",
            }));
            return false;
        }
    };

    const handleNameChange = (text: string) => {
        setName(text);
        validateName(text);
    };

    const handleUsernameChange = async (text: string) => {
        setUsername(text);
        if (validateUsername(text)) {
            if (usernameApiCallTimeout) {
                clearTimeout(usernameApiCallTimeout);
            }
            const timeout = setTimeout(async () => {
                const exists = await checkUsernameExists(text);
                if (exists) {
                    setFieldErrors((prev) => ({
                        ...prev,
                        username: "Username already exists",
                    }));
                }
            }, 1000);
            setUsernameApiCallTimeout(timeout);
        }
    };

    const handleEmailChange = async (text: string) => {
        setEmail(text.trim());
        if (validateEmail(text)) {
            if (emailApiCallTimeout) {
                clearTimeout(emailApiCallTimeout);
            }
            const timeout = setTimeout(async () => {
                const exists = await checkEmailExists(text);
                if (exists) {
                    setFieldErrors((prev) => ({
                        ...prev,
                        email: "Email already exists",
                    }));
                }
            }, 1000);
            setEmailApiCallTimeout(timeout);
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        validatePassword(text);
        if (confirmPassword) {
            validateConfirmPassword(confirmPassword);
        }
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        validateConfirmPassword(text);
    };

    const handleRegister = async () => {
        setIsSubmitting(true);
        setFieldErrors({});

        const isNameValid = validateName(name);
        const isUsernameValid = validateUsername(username);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

        if (!isNameValid || !isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            setIsSubmitting(false);
            return;
        }

        try {
            await signUp(username, name, email, password);
            router.replace("/verify-email");
        } catch (error: any) {
            setFieldErrors((prev) => ({
                ...prev,
                general: error.response?.data || "Registration failed. Please try again.",
            }));
            setIsSubmitting(false);
        }
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
        headerContainer: {
            marginTop: 60,
            marginBottom: 30,
        },
        headerText: {
            fontFamily: "Inter-Bold",
            fontSize: 28,
            color: colors.primary,
            marginBottom: 8,
        },
        subHeaderText: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.text,
        },
        formContainer: {
            width: "100%",
        },
        errorText: {
            color: colors.error,
            fontSize: 12,
            marginTop: 4,
            fontFamily: "Inter-Regular",
        },
        generalErrorText: {
            color: colors.error,
            fontSize: 14,
            marginBottom: 16,
            textAlign: "center",
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
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            fontFamily: "Inter-Regular",
            color: colors.text,
        },
        inputError: {
            borderColor: colors.error,
            borderWidth: 1.5,
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
        registerButton: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 20,
            opacity: isSubmitting ? 0.7 : 1,
        },
        registerButtonText: {
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
            color: colors.text,
        },
        loginLink: {
            fontFamily: "Inter-SemiBold",
            color: colors.primary,
        },
    });

    return (
        <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Create Account</Text>
                    <Text style={styles.subHeaderText}>
                        Join Sharemates to split expenses with friends
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    {fieldErrors.general && (
                        <Text style={styles.generalErrorText}>
                            {fieldErrors.general}
                        </Text>
                    )}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={[
                                styles.input,
                                fieldErrors.username && styles.inputError,
                            ]}
                            placeholder="Username"
                            value={username}
                            onChangeText={handleUsernameChange}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor={colors.secondaryText}
                            editable={!isSubmitting}
                        />
                        {fieldErrors.username && (
                            <Text style={styles.errorText}>
                                {fieldErrors.username}
                            </Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={[
                                styles.input,
                                fieldErrors.name && styles.inputError,
                            ]}
                            placeholder="Your Name"
                            value={name}
                            onChangeText={handleNameChange}
                            placeholderTextColor={colors.secondaryText}
                            editable={!isSubmitting}
                        />
                        {fieldErrors.name && (
                            <Text style={styles.errorText}>
                                {fieldErrors.name}
                            </Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[
                                styles.input,
                                fieldErrors.email && styles.inputError,
                            ]}
                            placeholder="your@email.com"
                            value={email}
                            onChangeText={handleEmailChange}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={colors.secondaryText}
                            editable={!isSubmitting}
                        />
                        {fieldErrors.email && (
                            <Text style={styles.errorText}>
                                {fieldErrors.email}
                            </Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View
                            style={[
                                styles.passwordContainer,
                                fieldErrors.password && styles.inputError,
                            ]}
                        >
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Create a password"
                                value={password}
                                onChangeText={handlePasswordChange}
                                secureTextEntry={!showPassword}
                                placeholderTextColor={colors.secondaryText}
                                editable={!isSubmitting}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color={colors.text} />
                                ) : (
                                    <Eye size={20} color={colors.text} />
                                )}
                            </TouchableOpacity>
                        </View>
                        {fieldErrors.password && (
                            <Text style={styles.errorText}>
                                {fieldErrors.password}
                            </Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View
                            style={[
                                styles.passwordContainer,
                                fieldErrors.confirmPassword &&
                                    styles.inputError,
                            ]}
                        >
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChangeText={handleConfirmPasswordChange}
                                secureTextEntry={!showConfirmPassword}
                                placeholderTextColor={colors.secondaryText}
                                editable={!isSubmitting}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                disabled={isSubmitting}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} color={colors.text} />
                                ) : (
                                    <Eye size={20} color={colors.text} />
                                )}
                            </TouchableOpacity>
                        </View>
                        {fieldErrors.confirmPassword && (
                            <Text style={styles.errorText}>
                                {fieldErrors.confirmPassword}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegister}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator
                                size="small"
                                color={colors.background}
                            />
                        ) : (
                            <>
                                <Text style={styles.registerButtonText}>
                                    Create Account
                                </Text>
                                <ArrowRight
                                    size={20}
                                    color={colors.background}
                                />
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>
                            Already have an account?{" "}
                        </Text>
                        <Link href="/" asChild>
                            <TouchableOpacity disabled={isSubmitting}>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
