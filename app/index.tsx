import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { storageService } from "@/services/storageService";
import { RelativePathString, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const { signIn } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            const [user, tokenExpiry, userCredentials, lastLogin] =
                await Promise.all([
                    storageService.getItemAsync("user"),
                    storageService.getItemAsync("tokenExpiry"),
                    storageService.getItemAsync("userCredentials"),
                    storageService.getItemAsync("lastLogin"),
                ]);
            debugger;
            if (user && tokenExpiry && userCredentials && lastLogin) {
                debugger;
                // if (Number(tokenExpiry) + Number(lastLogin) < Date.now()) {
                const { email, password } = JSON.parse(userCredentials);
                await signIn(email, password);
                // }
                router.replace("/dashboard" as RelativePathString);
            } else {
                router.replace("/login" as RelativePathString);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.background,
                }}
            >
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.text }}>Loading...</Text>
            </View>
        );
    }

    return null;
}
