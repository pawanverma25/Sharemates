import apiClient from "./apiClient";

export const expensesService = {
    async getExpenseSplits(expenseId: number) {
        try {
            const response = await apiClient.get(
                `/expenses-splits/${expenseId}`
            );
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch expense details: " + error.message
            );
        }
    },
    async fetchExpenses(userId: number, pageable?: number) {
        try {
            const response = await apiClient.get(`/expenses`, {
                params: {
                    userId: userId,
                    pageable: pageable,
                },
            });
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch balances: " + error.message
            );
        }
    },
};
