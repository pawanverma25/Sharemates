import { FriendType } from "@/definitions/friend";
import apiClient from "./apiClient";

export const friendsService = {
    async getFriends(userId: number) {
        try {
            const response = await apiClient.get(`/getFriends/${userId}`);
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch friends list: " + error.message
            );
        }
    },
    async searchFriends(searchQuery: string, userId: number) {
        try {
            const response = await apiClient.get(
                `/searchFriends/${userId}/${searchQuery}`
            );
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't search friends: " + error.message
            );
        }
    },
    async addFriends(friendRequest: FriendType) {
        try {
            const response = await apiClient.post(`/addFriend/`, friendRequest);
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data || "Couldn't add friend: " + error.message
            );
        }
    },
    async updateFriendRequest(friendRequest: FriendType) {
        try {
            const response = await apiClient.post(
                `/updateFriendRequest/`,
                friendRequest
            );
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't update friend request: " + error.message
            );
        }
    },
    async getFriendRequestList(userId: number) {
        try {
            const response = await apiClient.get(
                `/getFriendRequestList/${userId}`
            );
            return response.data;
        } catch (error: any) {
            throw (
                error.response?.data ||
                "Couldn't fetch friend request list: " + error.message
            );
        }
    },
};
