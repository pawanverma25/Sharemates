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
            setLoading(true);
            const [user, tokenExpiry, userCredentials, lastLogin] =
                await Promise.all([
                    storageService.getItemAsync("user"),
                    storageService.getItemAsync("tokenExpiry"),
                    storageService.getItemAsync("userCredentials"),
                    storageService.getItemAsync("lastLogin"),
                ]);
            if (user && tokenExpiry && userCredentials && lastLogin) {
                if (Number(tokenExpiry) + Number(lastLogin) < Date.now()) {
                    const { email, password } = JSON.parse(userCredentials);
                    signIn(email, password);
                }
            } else {
                router.replace("/login" as RelativePathString);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.background,
                gap: 10,
            }}
        >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.text }}>Loading...</Text>
            <Text style={{ color: colors.text, marginTop: 10 }}>
                This might take up to a minute...
            </Text>
        </View>
    );
}
