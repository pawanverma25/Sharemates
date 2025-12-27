import { ExpenseType } from "./expense";
import { UserType } from "./User";

export type GroupType = {
    id: number;
    name: string;
    description: string;
    createdBy: number;
    amountOwed: number;
    createdDate: Date;
    members?: UserType[];
    positiveBalance: number;
    negativeBalance: number;
    recentExpenses: ExpenseType[];
};
