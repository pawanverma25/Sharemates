import apiClient from "./apiClient";

export const authService = {
    async login(email: string, password: string) {
        try {
            const response = await apiClient.post("/login", {
                email,
                password,
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || "Login failed";
        }
    },

    async register(name: string, email: string, password: string) {
        try {
            const response = await apiClient.post("/register", {
                name,
                email,
                password,
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || "Registration failed";
        }
    },

    async logout() {
        try {
            await apiClient.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    },
};
