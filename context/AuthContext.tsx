import React, { createContext, useState, useContext, useEffect } from "react";
import { RelativePathString, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import apiClient from "@/services/apiClient";
import { ToastAndroid } from "react-native";
import { AuthResponse, User } from "@/definitions/User";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     const loadUser = async () => {
    //         try {
    //             const userJson = await SecureStore.getItemAsync("user");
    //             const token = await SecureStore.getItemAsync("token");

    //             if (userJson && token) {
    //                 setUser(JSON.parse(userJson));
    //                 router.replace("/(tabs)" as RelativePathString);
    //             }
    //         } catch (e) {
    //             console.error("Failed to load user from storage", e);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     loadUser();
    // }, []);

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post("/login", {
                email,
                password,
            });

            const authResponse: AuthResponse = response.data;

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
            router.replace("/dashboard" as RelativePathString);
        } catch (e) {
            setError("Invalid email or password");
            console.error("Login failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post("/register", {
                name,
                email,
                password,
            });
            const authResponse: AuthResponse = JSON.parse(response.data);

            ToastAndroid.showWithGravity(authResponse.message, 1000, 10);

            // Store user data and token
            await SecureStore.setItemAsync(
                "user",
                JSON.stringify(authResponse.user)
            );
            await SecureStore.setItemAsync("token", authResponse.authorization);

            setUser(authResponse.user);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            router.replace("/" as RelativePathString);
        } catch (e) {
            setError("Registration failed. Please try again.");
            console.error("Registration failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);

        try {
            // Clear stored user data and token
            await SecureStore.deleteItemAsync("user");
            await SecureStore.deleteItemAsync("token");

            setUser(null);
            router.replace("/" as RelativePathString);
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoading, signIn, signUp, signOut, error }}
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
