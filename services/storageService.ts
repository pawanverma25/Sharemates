import * as SecureStore from "expo-secure-store";

export const storageService = {
    async getItemAsync(item: string) {
        return await SecureStore.getItemAsync(item);
    },

    async setItemAsync(item: string, value: string) {
        return await SecureStore.setItemAsync(item, value);
    },

    async deleteItemAsync(item: string) {
        return await SecureStore.deleteItemAsync(item);
    },
    async removeUserSession() {
        await SecureStore.deleteItemAsync("user");
        await SecureStore.deleteItemAsync("token");
    },
};
