import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from "@expo-google-fonts/inter";
import { SplashScreen } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { AlertProvider } from "@/context/AlertContext";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

declare global {
    interface Window {
        frameworkReady?: () => void;
    }
}

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        "Inter-Regular": Inter_400Regular,
        "Inter-Medium": Inter_500Medium,
        "Inter-SemiBold": Inter_600SemiBold,
        "Inter-Bold": Inter_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
        window.frameworkReady?.();
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <ThemeProvider>
            <AuthProvider>
                <AlertProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen
                            name="(auth)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="+not-found"
                            options={{ title: "Oops!" }}
                        />
                    </Stack>
                    <StatusBar style="auto" />
                </AlertProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
