import { AuthResponse, UserType } from "@/definitions/User";
import apiClient from "@/services/apiClient";
import { userService } from "@/services/userService";
import { RelativePathString, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useState } from "react";
import { ToastAndroid } from "react-native";
import { usePreferences } from "./PreferencesContext";
import { authService } from "@/services/authService";
import { storageService } from "@/services/storageService";

type AuthContextType = {
    user: UserType | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (
        username: string,
        name: string,
        email: string,
        password: string
    ) => Promise<void>;
    signOut: () => Promise<void>;
    signInAuto: () => Promise<void>;
    error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { preferences, setPreferences } = usePreferences();

    const signInAuto = async () => {
        const curUser = await storageService.getItemAsync("user");
        setUser(curUser ? JSON.parse(curUser) : null);
        if (curUser) router.replace("/dashboard" as RelativePathString);
        else router.replace("/login" as RelativePathString);
    };

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const authResponse: AuthResponse = await authService.login(
                email,
                password
            );
            authResponse.user.emailVerified = authResponse.emailVerified;

            ToastAndroid.showWithGravity(authResponse.message, 1000, 10);

            await Promise.all([
                SecureStore.setItemAsync(
                    "user",
                    JSON.stringify(authResponse.user)
                ),
                SecureStore.setItemAsync("token", authResponse.authorization),
                SecureStore.setItemAsync(
                    "tokenExpiry",
                    authResponse.expiresIn + ""
                ),
                SecureStore.setItemAsync(
                    "userCredentials",
                    JSON.stringify({
                        email,
                        password,
                    })
                ),
                SecureStore.setItemAsync(
                    "lastLogin",
                    JSON.stringify(new Date().getTime())
                ),
            ]);
            setUser(authResponse.user);

            if (!preferences) {
                userService
                    .getUserPreferences(authResponse.user.id)
                    .then((prefs) => {
                        setPreferences(prefs);
                        SecureStore.setItemAsync(
                            "preferences",
                            JSON.stringify(prefs)
                        );
                    })
                    .catch((error) => {
                        console.error(
                            "Failed to fetch user preferences",
                            error
                        );
                    });
            }

            if (authResponse.user.emailVerified === "Y")
                router.replace("/dashboard" as RelativePathString);
            else router.replace("/verify-email" as RelativePathString);
        } catch (e) {
            setError("Invalid email or password");
            ToastAndroid.showWithGravity(
                "Login failed. Please check your credentials.",
                1000,
                10
            );
            await storageService.removeUserSession();
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (
        username: string,
        name: string,
        email: string,
        password: string
    ) => {
        setIsLoading(true);
        setError(null);

        try {
            const authResponse: AuthResponse = await authService.register(
                username,
                name,
                email,
                password
            );
            authResponse.user.emailVerified = authResponse.emailVerified;

            ToastAndroid.showWithGravity(authResponse.message, 1000, 10);

            await Promise.all([
                SecureStore.setItemAsync(
                    "user",
                    JSON.stringify(authResponse.user)
                ),
                SecureStore.setItemAsync("token", authResponse.authorization),
                SecureStore.setItemAsync(
                    "tokenExpiry",
                    authResponse.expiresIn + ""
                ),
                SecureStore.setItemAsync(
                    "userCredentials",
                    JSON.stringify({
                        email,
                        password,
                    })
                ),
                SecureStore.setItemAsync(
                    "lastLogin",
                    JSON.stringify(new Date().getTime())
                ),
            ]);

            router.replace("/verify-email" as RelativePathString);
        } catch (e) {
            setError("Registration failed. Please try again.");
            console.error("Registration failed", e);
            ToastAndroid.showWithGravity(
                "Registration failed. Please try again.",
                1000,
                10
            );
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);

        try {
            storageService.removeUserSession();
            setUser(null);
            router.replace("/" as RelativePathString);
            ToastAndroid.showWithGravity("Logged out successfully.", 1000, 10);
        } catch (e) {
            console.error("Logout failed", e);
            ToastAndroid.showWithGravity(
                "Logout failed. Please try again.",
                1000,
                10
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                signIn,
                signUp,
                signOut,
                error,
                signInAuto,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
