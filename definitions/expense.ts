import { UserType } from "./User";

export type SplitType = "EQUAL" | "EXACT" | "PERCENTAGE" | "SHARES";

export type ExpenseCategoryType =
    | "FOOD_DINING"
    | "HOUSING_UTILITIES"
    | "ENTERTAINMENT"
    | "SHOPPING"
    | "HEALTH_FITNESS"
    | "TRAVEL"
    | "EDUCATION"
    | "MISCELLANEOUS";

export type ExpenseType = {
    id: number;
    groupId: number;
    groupName: string;
    createdBy: UserType;
    description: string;
    amount: number;
    createdDate: string;
    modifiedDate: string;
    splitType: SplitType;
    splits?: [];
    amountOwed: number;
    paidBy: UserType;
    expenseCategory: ExpenseCategoryType;
};

export type ExpenseSplitType = {
    id: number;
    expenseId: number;
    user: UserType;
    amountOwed: number;
    amountPaid: number;
};

export type ExpenseRequestType = {
    description: string;
    createdDate: string;
    paidBy: number;
    groupId: number;
    createdBy: number;
    amount: number;
    splitType: string;
    participants: ParticipantType[];
};

export type ParticipantType = {
    id: number;
    amount: number;
};

export type SettleExpenseRequestType = {
    expenseId?: number;
    userId: number;
    friendId?: number;
};
