import { useTheme } from "@/context/ThemeContext";
import { storageService } from "@/services/storageService";
import { RelativePathString, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await storageService.getItemAsync("user");
            if (user) {
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
                <Text>Loading...</Text>
            </View>
        );
    }

    return null;
}
