import { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, Mail } from "lucide-react-native";

export default function VerifyEmailScreen() {
    const [email] = useState("john.appleseed@example.com");
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [isResending, setIsResending] = useState(false);
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

    const handleCodeChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Auto-focus next input
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        if (timer === 0) {
            setIsResending(true);
            // Simulate API call
            setTimeout(() => {
                setTimer(30);
                setIsResending(false);
            }, 1000);
        }
    };

    const handleVerify = () => {
        const enteredCode = code.join("");
        if (enteredCode.length === 6) {
            // In a real app, verify the code with your API
            router.back();
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verify Email</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Mail size={48} color="#00A86B" />
                </View>

                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.description}>
                    We've sent a 6-digit verification code to{"\n"}
                    <Text style={styles.email}>{email}</Text>
                </Text>

                <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.codeInput}
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
                </View>

                <TouchableOpacity
                    style={[
                        styles.verifyButton,
                        code.join("").length !== 6 &&
                            styles.verifyButtonDisabled,
                    ]}
                    onPress={handleVerify}
                    disabled={code.join("").length !== 6}
                >
                    <Text style={styles.verifyButtonText}>Verify Email</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E1E1",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontFamily: "Inter-SemiBold",
        fontSize: 18,
        color: "#333",
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
        backgroundColor: "#F0F9F6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontFamily: "Inter-Bold",
        fontSize: 24,
        color: "#333",
        marginBottom: 12,
    },
    description: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 32,
    },
    email: {
        fontFamily: "Inter-SemiBold",
        color: "#333",
    },
    codeContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        marginBottom: 32,
    },
    codeInput: {
        width: 50,
        height: 56,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        borderRadius: 8,
        fontSize: 24,
        fontFamily: "Inter-SemiBold",
        textAlign: "center",
        color: "#333",
    },
    verifyButton: {
        backgroundColor: "#00A86B",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginBottom: 16,
    },
    verifyButtonDisabled: {
        backgroundColor: "#E1E1E1",
    },
    verifyButtonText: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: "#fff",
    },
    resendContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    resendText: {
        fontFamily: "Inter-Regular",
        fontSize: 14,
        color: "#666",
    },
    resendButton: {
        fontFamily: "Inter-SemiBold",
        fontSize: 14,
        color: "#00A86B",
    },
    resendButtonDisabled: {
        color: "#888",
    },
});
