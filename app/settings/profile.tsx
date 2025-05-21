import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { userService } from "@/services/userService";
import { ValidationUtil } from "@/util/validations";
import * as ImagePicker from "expo-image-picker";
import { RelativePathString, router } from "expo-router";
import { Camera, Mail, User } from "lucide-react-native";
import { forwardRef, useImperativeHandle, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const ProfileEditScreen = forwardRef((props, ref) => {
    const { colors } = useTheme();

    const { user } = useAuth();
    const { showAlert, hideAlert } = useAlert();

    useImperativeHandle(ref, () => ({
        handleSave,
    }));

    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [username, setUsername] = useState(user?.username);
    const [usernameFieldError, setUsernameFieldError] = useState<string | null>(
        null
    );
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameApiCallTimeout, setUsernameApiCallTimeout] =
        useState<NodeJS.Timeout | null>(null);
    const [avatar, setAvatar] = useState(
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop"
    );

    const validateUsername = (text: string) => {
        try {
            ValidationUtil.validateUsername(text);
        } catch (error: any) {
            setUsernameFieldError(error.message);
            return false;
        }
        setUsernameFieldError(null);
        return true;
    };

    const checkUsernameExists = async (username: string) => {
        try {
            const response = await userService.checkUsernameExists(username);
            return response.exists;
        } catch (error: any) {
            setUsernameFieldError(
                "Couldn't check username availability. Please try again."
            );
            return false;
        }
    };

    const handleUsernameChange = (text: string) => {
        setUsername(text);
        if (validateUsername(text)) {
            if (usernameApiCallTimeout) {
                clearTimeout(usernameApiCallTimeout);
            }
            const timeout = setTimeout(async () => {
                setIsCheckingUsername(true);
                const exists = await checkUsernameExists(text);
                if (exists) {
                    setIsCheckingUsername(false);
                    setIsUsernameAvailable(false);
                    setUsernameFieldError("Username is already taken");
                }
            }, 1000);
            setUsernameApiCallTimeout(timeout);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const handleSave = () => {
        if (usernameFieldError) {
            showAlert("Error", "Please choose a valid username");
            return;
        }

        showAlert(
            "Save Changes",
            "Are you sure you want to save these changes to your profile?",
            () => {
                router.back();
            },
            () => {
                hideAlert();
            }
        );
    };

    const handleVerifyEmail = () => {
        showAlert(
            "Verify Email",
            "We'll send a verification code to your email address. Would you like to proceed?",
            () => {
                router.push("/auth/verify-email" as RelativePathString);
            },
            () => {
                hideAlert();
            }
        );
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
            backgroundColor: colors.card,
            paddingTop: 60,
            paddingBottom: 16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        headerTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 18,
            color: colors.text,
        },
        backButton: {
            padding: 8,
            marginLeft: -8,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "center",
            gap: 40,
            paddingHorizontal: 16,
            marginTop: 16,
        },
        saveButton: {
            paddingVertical: 12,
            paddingHorizontal: 18,
            borderRadius: 18,
            backgroundColor: colors.primary,
        },
        saveButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: "#fff",
            textAlign: "center",
        },
        cancelButton: {
            backgroundColor: colors.cardHighlight,
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: 16,
        },
        cancelButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 12,
            color: colors.primary,
        },
        content: {
            flex: 1,
            padding: 16,
        },
        avatarSection: {
            alignItems: "center",
            marginBottom: 24,
        },
        avatarContainer: {
            position: "relative",
            marginBottom: 12,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
        },
        cameraButton: {
            position: "absolute",
            right: -4,
            bottom: -4,
            backgroundColor: colors.primary,
            padding: 8,
            borderRadius: 20,
            borderWidth: 3,
            borderColor: colors.card,
        },
        changePhotoText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.primary,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            marginBottom: 16,
        },
        inputContainer: {
            marginBottom: 16,
        },
        label: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.secondaryText,
            marginBottom: 8,
        },
        input: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 48,
            backgroundColor: colors.card,
        },
        inputIcon: {
            marginRight: 12,
        },
        textInput: {
            flex: 1,
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.text,
        },
        verifyButton: {
            backgroundColor: colors.cardHighlight,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            marginLeft: 8,
        },
        verifyButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 12,
            color: colors.primary,
        },
        usernameStatus: {
            fontFamily: "Inter-Regular",
            fontSize: 12,
            marginTop: 4,
        },
        usernameAvailable: {
            color: colors.primary,
        },
        usernameUnavailable: {
            color: colors.error,
        },
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView style={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={pickImage}
                        >
                            <Camera size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Personal Information
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.input}>
                            <User
                                size={20}
                                color={colors.secondaryText}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your full name"
                                placeholderTextColor={colors.secondaryText}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username</Text>
                        <View style={styles.input}>
                            <User
                                size={20}
                                color={colors.secondaryText}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                value={username}
                                onBlur={() => {
                                    if (!username) {
                                        setUsername(user?.username);
                                    }
                                }}
                                onChangeText={handleUsernameChange}
                                placeholder="Enter your username"
                                placeholderTextColor={colors.secondaryText}
                                autoCapitalize="none"
                            />
                        </View>
                        {username &&
                            username !== user?.username &&
                            usernameFieldError && (
                                <Text
                                    style={[
                                        styles.usernameStatus,
                                        isUsernameAvailable &&
                                        !usernameFieldError
                                            ? styles.usernameAvailable
                                            : styles.usernameUnavailable,
                                    ]}
                                >
                                    {usernameFieldError
                                        ? usernameFieldError
                                        : isCheckingUsername
                                        ? "Checking availability..."
                                        : isUsernameAvailable
                                        ? "Username is available"
                                        : "Username is not available"}
                                </Text>
                            )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.input}>
                            <Mail
                                size={20}
                                color={colors.secondaryText}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[
                                    styles.textInput,
                                    { color: colors.secondaryText },
                                ]}
                                value={email}
                                onChangeText={setEmail}
                                editable={false}
                                placeholderTextColor={colors.secondaryText}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {(user?.emailVerified === "N" ||
                                user?.email != email) && (
                                <TouchableOpacity
                                    style={styles.verifyButton}
                                    onPress={handleVerifyEmail}
                                >
                                    <Text style={styles.verifyButtonText}>
                                        Verify
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.input}>
                            <Phone
                                size={20}
                                color={colors.secondaryText}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Enter your phone number"
                                placeholderTextColor={colors.secondaryText}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View> */}

                    {/* <View style={styles.inputContainer}>
                        <Text style={styles.label}>Location</Text>
                        <View style={styles.input}>
                            <MapPin
                                size={20}
                                color={colors.secondaryText}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                value={location}
                                onChangeText={setLocation}
                                placeholder="Enter your location"
                                placeholderTextColor={colors.secondaryText}
                            />
                        </View>
                    </View> */}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancel}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
});

export default ProfileEditScreen;
