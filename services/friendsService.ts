import apiClient from "./apiClient";

export const friendsService = {
    async getFriends(userId: number) {
        try {
            const response = await apiClient.get(`/getFriends/${userId}`);
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch friends List: " + error.message
            );
        }
    },
};
