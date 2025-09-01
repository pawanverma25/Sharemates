import { AlertProvider } from "@/context/AlertContext";
import { PreferencesContextProvider } from "@/context/PreferencesContext";
import { RefreshProvider } from "@/context/RefreshContext";
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts,
} from "@expo-google-fonts/inter";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ThemeProvider } from "../context/ThemeContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

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
            <PreferencesContextProvider>
                <AuthProvider>
                    <NotificationProvider>
                        <AlertProvider>
                            <RefreshProvider>
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
                            </RefreshProvider>
                        </AlertProvider>
                    </NotificationProvider>
                </AuthProvider>
            </PreferencesContextProvider>
        </ThemeProvider>
    );
}
