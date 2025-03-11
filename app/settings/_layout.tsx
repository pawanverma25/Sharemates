import { useTheme } from "@/context/ThemeContext";
import { router, Stack } from "expo-router";
import PrivacyPolicyScreen from "./privacy";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";

export default function AuthLayout() {
    const { colors } = useTheme();

    const handleSave = () => {};

    const styles = StyleSheet.create({
        headerText: {
            fontFamily: "Inter-Bold",
            color: colors.text,
            fontSize: 18,
        },
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        headerTitle: {
            fontFamily: "Inter-Bold",
            fontSize: 18,
            color: colors.text,
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
    });
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                gestureEnabled: true,
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerTintColor: colors.text,
                headerShadowVisible: true,
            }}
        >
            <Stack.Screen
                name="profile"
                options={{
                    headerTitle: (props) => (
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Edit Profile</Text>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="help"
                options={{
                    headerTitle: (props) => (
                        <Text style={styles.headerText}>Help & Support</Text>
                    ),
                }}
            />
            <Stack.Screen
                name="privacy"
                options={{
                    headerTitle: (props) => (
                        <Text style={styles.headerText}>Privacy Policy</Text>
                    ),
                }}
            />
        </Stack>
    );
}
