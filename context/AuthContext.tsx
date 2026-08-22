import { AuthResponse, UserType } from "@/definitions/User";
import { authService } from "@/services/authService";
import { storageService } from "@/services/storageService";
import { userService } from "@/services/userService";
import { RelativePathString, router } from "expo-router";
import React, { createContext, useContext, useState } from "react";
import { useAlert } from "./AlertContext";
import { usePreferences } from "./PreferencesContext";

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
    const { showToast } = useAlert();

    const signInAuto = async () => {
        try {
            const [curUser, token, tokenExpiry, lastLogin] = await Promise.all([
                storageService.getItemAsync("user"),
                storageService.getItemAsync("token"),
                storageService.getItemAsync("tokenExpiry"),
                storageService.getItemAsync("lastLogin"),
            ]);

            if (!curUser || !token) {
                await storageService.removeUserSession();
                setUser(null);
                router.replace("/login" as RelativePathString);
                return;
            }

            if (tokenExpiry && lastLogin) {
                const expiryTime = Number(lastLogin) + Number(tokenExpiry);
                if (Date.now() > expiryTime) {
                    await storageService.removeUserSession();
                    setUser(null);
                    router.replace("/login" as RelativePathString);
                    return;
                }
            }

            const parsedUser: UserType = JSON.parse(curUser);
            setUser(parsedUser);

            if (!preferences) {
                userService
                    .getUserPreferences(parsedUser.id)
                    .then((prefs) => {
                        setPreferences(prefs);
                        storageService.setItemAsync(
                            "preferences",
                            JSON.stringify(prefs)
                        );
                    })
                    .catch((error) => {
                        console.error("Failed to fetch user preferences", error);
                    });
            }

            if (parsedUser.emailVerified === "Y") {
                router.replace("/dashboard" as RelativePathString);
            } else {
                router.replace("/verify-email" as RelativePathString);
            }
        } catch (e) {
            console.error("Auto sign-in failed", e);
            await storageService.removeUserSession();
            setUser(null);
            router.replace("/login" as RelativePathString);
        }
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

            showToast(authResponse.message);

            await Promise.all([
                storageService.setItemAsync(
                    "user",
                    JSON.stringify(authResponse.user)
                ),
                storageService.setItemAsync(
                    "token",
                    authResponse.authorization
                ),
                storageService.setItemAsync(
                    "tokenExpiry",
                    authResponse.expiresIn + ""
                ),
                storageService.setItemAsync(
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
                        storageService.setItemAsync(
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
            showToast("Login failed. Please check your credentials.");
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

            showToast(authResponse.message);

            await Promise.all([
                storageService.setItemAsync(
                    "user",
                    JSON.stringify(authResponse.user)
                ),
                storageService.setItemAsync(
                    "token",
                    authResponse.authorization
                ),
                storageService.setItemAsync(
                    "tokenExpiry",
                    authResponse.expiresIn + ""
                ),
                storageService.setItemAsync(
                    "lastLogin",
                    JSON.stringify(new Date().getTime())
                ),
            ]);

            router.replace("/verify-email" as RelativePathString);
        } catch (e) {
            setError("Registration failed. Please try again.");
            console.error("Registration failed", e);
            showToast("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);

        try {
            await storageService.removeUserSession();
            setUser(null);
            router.replace("/login" as RelativePathString);
            showToast("Logged out successfully.");
        } catch (e) {
            console.error("Logout failed", e);
            showToast("Logout failed. Please try again.");
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
            }}>
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
