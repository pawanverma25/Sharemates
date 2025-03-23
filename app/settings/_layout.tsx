import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileEditScreen from "./profile";

export default function AuthLayout() {
    const { colors } = useTheme();

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
                        <Text style={styles.headerText}>Edit Profile</Text>
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
