import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
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
    async getGroupExpenses(groupId: number) {
        try {
            const response = await apiClient.get(
                `/getGroupExpenses/${groupId}`
            );
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch recent expenses: " + error.message
            );
        }
    },
    async createGroup(
        userId: number,
        name: string,
        description: string,
        friendIdList: number[]
    ) {
        try {
            const response = await apiClient.post(`/createGroup`, {
                createdBy: userId,
                name,
                description,
                friendIdList,
            });
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't create a group: " + error.message
            );
        }
    },
};
