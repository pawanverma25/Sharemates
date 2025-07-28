import apiClient from "./apiClient";

export const userService = {
    async checkUsernameExists(username: string) {
        try {
            const response = await apiClient.get(`/usernameexists/${username}`);
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't check if username already exists: " + error.message
            );
        }
    },
    async checkEmailExists(email: string) {
        try {
            const response = await apiClient.get(`/emailexists/${email}`);
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't check if email already exists: " + error.message
            );
        }
    },
    async verifyEmail(userId: number, verificationCode: string) {
        try {
            const response = await apiClient.post("/verifyEmail/", {
                userId,
                verificationCode,
            });
            return response;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't check if email already exists: " + error.message
            );
        }
    },
    async sendVerificationEmail(userId: number) {
        try {
            const response = await apiClient.post(
                `/sendVerificationEmail/${userId}`
            );
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't check if email already exists: " + error.message
            );
        }
    },
    async getUserPreferences(userId: number) {
        try {
            const response = await apiClient.get(
                `/getUserPreferences/${userId}`
            );
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch user preferences: " + error.message
            );
        }
    },
    async updateUserPreferences(userId: number, preferences: object) {
        try {
            const response = await apiClient.post(
                `/updateUserPreferences/${userId}`,
                preferences
            );
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't update user preferences: " + error.message
            );
        }
    },
};
