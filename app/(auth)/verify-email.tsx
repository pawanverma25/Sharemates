import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { userService } from "@/services/userService";
import { RelativePathString, router } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { ArrowLeft, Mail } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
    Animated,
} from "react-native";

export default function VerifyEmailScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();
    const { showAlert } = useAlert();

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const shakeInputs = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleCodeChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        setError(""); // Clear error when user types
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            inputRefs.current[index - 1]?.clear();
        }
    };

    const handleResend = async () => {
        if (timer === 0) {
            setIsResending(true);
            try {
                userService.sendVerificationEmail(user?.id ?? -1);
                showAlert(
                    "Success",
                    "Verification code has been resent to your email"
                );
            } catch (error) {
                showAlert("Error", "Failed to resend verification code");
            } finally {
                setIsResending(false);
            }
        }
    };

    const handleVerify = async () => {
        const enteredCode = code.join("");
        if (enteredCode.length !== 6) {
            setError("Please enter all 6 digits");
            shakeInputs();
            return;
        }

        if (!/^\d+$/.test(enteredCode)) {
            setError("Verification code should only contain numbers");
            shakeInputs();
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            if (user) {
                const response = await userService.verifyEmail(
                    user.id,
                    enteredCode
                );
                if (response.status === 200) {
                    ToastAndroid.showWithGravity(
                        response.data,
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM
                    );
                    router.replace("/dashboard" as RelativePathString);
                } else if(response.status === 400) {
                    setError(response.data);
                    shakeInputs();
                } else {
                    throw new Error(response.data);
                }
            }
        } catch (error: any) {
            showAlert("Error", error.message || "Failed to verify email");
            shakeInputs();
        } finally {
            setIsVerifying(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 50,
            paddingBottom: 16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        backButton: {
            padding: 4,
        },
        headerTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 18,
            color: colors.text,
        },
        content: {
            flex: 1,
            alignItems: "center",
            padding: 24,
        },
        iconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.card,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
        },
        title: {
            fontFamily: "Inter-Bold",
            fontSize: 24,
            color: colors.text,
            marginBottom: 12,
        },
        description: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.secondaryText,
            textAlign: "center",
            marginBottom: 32,
        },
        email: {
            fontFamily: "Inter-SemiBold",
            color: colors.text,
        },
        codeContainer: {
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            marginBottom: 16,
        },
        codeInput: {
            width: 50,
            height: 56,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            fontSize: 24,
            fontFamily: "Inter-SemiBold",
            textAlign: "center",
            color: colors.text,
        },
        codeInputError: {
            borderColor: colors.error,
            backgroundColor: colors.card,
        },
        errorText: {
            color: colors.error,
            fontFamily: "Inter-Regular",
            fontSize: 14,
            marginBottom: 16,
            textAlign: "center",
        },
        verifyButton: {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 8,
            width: "100%",
            alignItems: "center",
            marginBottom: 16,
        },
        verifyButtonDisabled: {
            backgroundColor: colors.border,
        },
        verifyButtonText: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.background,
        },
        verifyButtonTextDisabled: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.secondaryText,
        },
        resendContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        resendText: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        resendButton: {
            fontFamily: "Inter-SemiBold",
            fontSize: 14,
            color: colors.primary,
        },
        resendButtonDisabled: {
            color: colors.secondaryText,
        },
    });

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verify Email</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Mail size={48} color={colors.primary} />
                </View>

                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.description}>
                    We've sent a 6-digit verification code to{"\n"}
                    <Text style={styles.email}>{user?.email}</Text>
                </Text>

                <Animated.View
                    style={[
                        styles.codeContainer,
                        { transform: [{ translateX: shakeAnimation }] },
                    ]}
                >
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={[
                                styles.codeInput,
                                error && styles.codeInputError,
                            ]}
                            value={digit}
                            onChangeText={(text) =>
                                handleCodeChange(text.slice(-1), index)
                            }
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </Animated.View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={[
                        styles.verifyButton,
                        (code.join("").length !== 6 || isVerifying) &&
                            styles.verifyButtonDisabled,
                    ]}
                    onPress={handleVerify}
                    disabled={code.join("").length !== 6 || isVerifying}
                >
                    <Text
                        style={[
                            styles.verifyButtonText,
                            (code.join("").length !== 6 || isVerifying) &&
                                styles.verifyButtonTextDisabled,
                        ]}
                    >
                        {isVerifying ? "Verifying..." : "Verify Email"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>
                        Didn't receive the code?{" "}
                    </Text>
                    <TouchableOpacity
                        onPress={handleResend}
                        disabled={timer > 0 || isResending}
                    >
                        <Text
                            style={[
                                styles.resendButton,
                                (timer > 0 || isResending) &&
                                    styles.resendButtonDisabled,
                            ]}
                        >
                            {isResending
                                ? "Sending..."
                                : timer > 0
                                ? `Resend in ${timer}s`
                                : "Resend"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
