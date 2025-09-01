export interface NotificationData {
    templateCode: string;
    errorCode: string;
    message: string;
    data: {
        friendId?: number;
        expenseId?: number;
        groupId?: number;
    };
}
