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
    expenseUid: string;
    groupId: number;
    groupName: string;
    createdBy: UserType;
    description: string;
    amount: number;
    date: string;
    splitType: SplitType;
    splits?: [];
    amountOwed: number;
    paidBy: UserType;
};

export type ExpenseSplitType = {
    id: number;
    expenseId: number;
    user: UserType;
    amountOwed: number;
    paid: string;
};
