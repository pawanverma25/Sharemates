import apiClient from "./apiClient";

export const groupService = {
    async getGroups(userId: number) {
        try {
            const response = await apiClient.get(`/getGroups/${userId}`);
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch groups List: " + error.message
            );
        }
    },
    async getMembers(groupId: number) {
        try {
            const response = await apiClient.get(`/getGroupMembers/${groupId}`);
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch group members: " + error.message
            );
        }
    },
    async getGroupDetails(groupId: number) {
        try {
            const response = await apiClient.get(`/getGroupDetails/${groupId}`);
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch groups List: " + error.message
            );
        }
    },
};
