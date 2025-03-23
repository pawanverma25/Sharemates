import apiClient from "./apiClient";

export const dashboardService = {
    async fetchBalances(userId: string) {
        try {
            const response = await apiClient.get(`/getBalance/${userId}`);
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch balances: " + error.message
            );
        }
    },
};
