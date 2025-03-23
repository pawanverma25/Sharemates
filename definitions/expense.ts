import { User } from "./User";

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
    expenseUid: string;
    groupId: number;
    groupName: string;
    createdBy: User;
    description: string;
    amount: number;
    date: string;
    splitType: SplitType;
    splits?: [];
    amountOwed: number;
    paidBy: User;
};

export type ExpenseSplitType = {
    id: number;
    expenseId: number;
    user: User;
    amountOwed: number;
    paid: string;
};
