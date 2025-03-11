import Alert from "@/components/ui/Alert";
import { useTheme } from "@/context/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import { RelativePathString, router } from "expo-router";
import {
    ArrowLeft,
    Camera,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react-native";
import { useState } from "react";
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

export default function ProfileEditScreen() {
    const { colors } = useTheme();
    const [name, setName] = useState("John Appleseed");
    const [email, setEmail] = useState("john.appleseed@example.com");
    const [phone, setPhone] = useState("+1 (555) 123-4567");
    const [location, setLocation] = useState("San Francisco, CA");
    const [avatar, setAvatar] = useState(
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop"
    );
    const [showSaveAlert, setShowSaveAlert] = useState(false);
    const [showVerifyAlert, setShowVerifyAlert] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "livePhotos"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        setShowSaveAlert(true);
    };

    const handleVerifyEmail = () => {
        setShowVerifyAlert(true);
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
        saveButton: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 16,
            backgroundColor: colors.primary,
        },
        saveButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: "#fff",
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
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.input}>
                            <Mail
                                size={20}
                                color={colors.secondaryText}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.secondaryText}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.verifyButton}
                                onPress={handleVerifyEmail}
                            >
                                <Text style={styles.verifyButtonText}>
                                    Verify
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
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
                    </View>

                    <View style={styles.inputContainer}>
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
                    </View>
                </View>
            </ScrollView>

            <Alert
                visible={showSaveAlert}
                title="Save Changes"
                message="Are you sure you want to save these changes to your profile?"
                buttons={[
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => setShowSaveAlert(false),
                    },
                    {
                        text: "Save",
                        onPress: () => {
                            setShowSaveAlert(false);
                            router.back();
                        },
                    },
                ]}
            />

            <Alert
                visible={showVerifyAlert}
                title="Verify Email"
                message="We'll send a verification code to your email address. Would you like to proceed?"
                buttons={[
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => setShowVerifyAlert(false),
                    },
                    {
                        text: "Send Code",
                        onPress: () => {
                            setShowVerifyAlert(false);
                            router.push(
                                "/auth/verify-email" as RelativePathString
                            );
                        },
                    },
                ]}
            />
        </KeyboardAvoidingView>
    );
}
