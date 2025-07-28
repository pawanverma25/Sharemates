import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from "react-native";
import { RelativePathString, router } from "expo-router";
import {
    User,
    CreditCard,
    Bell,
    Globe,
    Moon,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { usePreferences } from "@/context/PreferencesContext";
export default function SettingsScreen() {
    const { user, signOut } = useAuth();
    const { isDark, setTheme, colors } = useTheme();
    const { showAlert } = useAlert();
    const { preferences, setPreferences } = usePreferences();

    const handleLogout = () => {
        showAlert(
            "Logout",
            "Are you sure you want to logout?",
            async () => await signOut()
        );
    };
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        profileSection: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.background,
            padding: 16,
            marginBottom: 16,
        },
        profileIconContainer: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
        },
        profileInfo: {
            flex: 1,
        },
        profileName: {
            fontFamily: "Inter-SemiBold",
            fontSize: 18,
            color: colors.text,
            marginBottom: 4,
        },
        profileEmail: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        editButton: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 16,
            backgroundColor: colors.card,
        },
        editButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.primary,
        },
        section: {
            backgroundColor: colors.background,
            marginBottom: 16,
            paddingTop: 12,
        },
        sectionTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            paddingHorizontal: 16,
            marginBottom: 8,
        },
        settingItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        settingIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.card,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        settingText: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.text,
            flex: 1,
        },
        settingValue: {
            flexDirection: "row",
            alignItems: "center",
        },
        settingValueText: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
            marginRight: 4,
        },
        logoutButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.background,
            padding: 16,
            marginBottom: 16,
        },
        logoutText: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.error,
            marginLeft: 8,
        },
        versionText: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
            textAlign: "center",
            marginBottom: 24,
        },
    });
    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileSection}>
                <View style={styles.profileIconContainer}>
                    <User size={32} color={colors.text} />
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{user?.name}</Text>
                    <Text style={styles.profileEmail}>{user?.email}</Text>
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                        router.push("/settings/profile" as RelativePathString)
                    }
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>

                <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() =>
                        router.push("/settings/profile" as RelativePathString)
                    }
                >
                    <View style={styles.settingIconContainer}>
                        <User size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.settingText}>Personal Information</Text>
                    <ChevronRight size={20} color={colors.secondaryText} />
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() =>
                        router.push(
                            "/settings/payment-methods" as RelativePathString
                        )
                    }
                >
                    <View style={styles.settingIconContainer}>
                        <CreditCard size={20} color="#5B7FFF" />
                    </View>
                    <Text style={styles.settingText}>Payment Methods</Text>
                    <ChevronRight size={20} color={colors.secondaryText} />
                </TouchableOpacity> */}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingIconContainer}>
                        <Bell size={20} color="#FF9500" />
                    </View>
                    <Text style={styles.settingText}>Push Notifications</Text>
                    <Switch
                        value={preferences?.pushNotifications}
                        onValueChange={() =>
                            setPreferences({
                                ...preferences,
                                pushNotifications:
                                    !preferences?.pushNotifications,
                            })
                        }
                        trackColor={{ false: "#E1E1E1", true: colors.primary }}
                        thumbColor="#fff"
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingIconContainer}>
                        <Bell size={20} color="#FF9500" />
                    </View>
                    <Text style={styles.settingText}>Email Notifications</Text>
                    <Switch
                        value={preferences?.emailNotifications}
                        onValueChange={() =>
                            setPreferences({
                                ...preferences,
                                emailNotifications:
                                    !preferences?.emailNotifications,
                            })
                        }
                        trackColor={{ false: "#E1E1E1", true: colors.primary }}
                        thumbColor="#fff"
                    />
                </View>

                {/* <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() =>
                        router.push("/settings/currency" as RelativePathString)
                    }
                >
                    <View style={styles.settingIconContainer}>
                        <Globe size={20} color="#5B7FFF" />
                    </View>
                    <Text style={styles.settingText}>Currency</Text>
                    <View style={styles.settingValue}>
                        <Text style={styles.settingValueText}>USD</Text>
                        <ChevronRight size={20} color={colors.secondaryText} />
                    </View>
                </TouchableOpacity> */}

                <View style={styles.settingItem}>
                    <View style={styles.settingIconContainer}>
                        <Moon size={20} color="#6C63FF" />
                    </View>
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <Switch
                        value={isDark}
                        onValueChange={() =>
                            setTheme(isDark ? "light" : "dark")
                        }
                        trackColor={{ false: "#E1E1E1", true: colors.primary }}
                        thumbColor="#fff"
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>

                <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() => router.push("/settings/privacy")}
                >
                    <View style={styles.settingIconContainer}>
                        <Shield size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.settingText}>Privacy Policy</Text>
                    <ChevronRight size={20} color={colors.secondaryText} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() => router.push("/settings/help")}
                >
                    <View style={styles.settingIconContainer}>
                        <HelpCircle size={20} color="#5B7FFF" />
                    </View>
                    <Text style={styles.settingText}>Help & Support</Text>
                    <ChevronRight size={20} color={colors.secondaryText} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <LogOut size={20} color={colors.error} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
    );
}
