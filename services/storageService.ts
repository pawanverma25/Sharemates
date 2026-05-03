import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const storageService = {
    async getItemAsync(item: string) {
        if (Platform.OS === "web") {
            return localStorage.getItem(item);
        }
        return await SecureStore.getItemAsync(item);
    },

    async setItemAsync(item: string, value: string) {
        if (Platform.OS === "web") {
            return localStorage.setItem(item, value);
        }
        return await SecureStore.setItemAsync(item, value);
    },

    async deleteItemAsync(item: string) {
        if (Platform.OS === "web") {
            return localStorage.removeItem(item);
        }
        return await SecureStore.deleteItemAsync(item);
    },
    async removeUserSession() {
        await SecureStore.deleteItemAsync("user");
        await SecureStore.deleteItemAsync("token");
    },
};
