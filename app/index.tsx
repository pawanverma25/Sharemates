import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { storageService } from "@/services/storageService";
import { RelativePathString, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const { signIn, signInAuto } = useAuth();

    useEffect(() => {
        signInAuto().finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.background,
                gap: 10,
            }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.text }}>Loading...</Text>
            <Text style={{ color: colors.text, marginTop: 10 }}>
                This might take up to a minute...
            </Text>
        </View>
    );
}
