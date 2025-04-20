import { UserType } from "./User";

export type SplitType = "EQUAL" | "EXACT" | "PERCENTAGE" | "SHARES";

export type ExpenseCategoryType =
    | "FOOD_DINING"
    | "HOUSING_UTILITIES"
    | "TRANSPORTATION"
    | "ENTERTAINMENT"
    | "SHOPPING"
    | "HEALTH_FITNESS"
    | "TRAVEL"
    | "EDUCATION"
    | "LOANS_DEBTS"
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
    paid: string;
};


export type ExpenseRequestType = {
    description: string;
    createdDate: string;
    paidBy: number;
    groupId: number;
    createdBy: number;
    amount: number;
    splitType: string;
    participants: participantType[];
};

export type participantType = {
    id: number;
    amount: number;
}