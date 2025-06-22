import { ExpenseCategoryType } from "@/definitions/expense";
import {
    BookMarked,
    FerrisWheel,
    HeartPulse,
    HousePlug,
    LucideHandPlatter,
    LucideIcon,
    Map,
    ReceiptText,
    ShoppingBasket,
} from "lucide-react-native";

export const expenseCategories: ExpenseCategoryType[] = [
    "FOOD_DINING",
    "HOUSING_UTILITIES",
    "ENTERTAINMENT",
    "SHOPPING",
    "HEALTH_FITNESS",
    "TRAVEL",
    "EDUCATION",
    "MISCELLANEOUS",
];

export const expenseCategoryLabels: Record<
    ExpenseCategoryType,
    {
        label: string;
        icon: LucideIcon | React.ComponentType<any>;
        color: string;
    }
> = {
    FOOD_DINING: {
        label: "Food & Dining",
        icon: LucideHandPlatter,
        color: "#FF6347", // Tomato color
    },
    HOUSING_UTILITIES: {
        label: "Housing & Utilities",
        icon: HousePlug,
        color: "#4682B4", // Steel Blue color
    },
    ENTERTAINMENT: {
        label: "Entertainment",
        icon: FerrisWheel,
        color: "#FFD700", // Gold color
    },
    SHOPPING: {
        label: "Shopping",
        icon: ShoppingBasket,
        color: "#FF69B4", // Hot Pink color
    },
    HEALTH_FITNESS: {
        label: "Health & Fitness",
        icon: HeartPulse,
        color: "#FF4500", // Orange Red color
    },
    TRAVEL: {
        label: "Travel",
        icon: Map,
        color: "#1E90FF", // Dodger Blue color
    },
    EDUCATION: {
        label: "Education",
        icon: BookMarked,
        color: "#8A2BE2", // Blue Violet color
    },
    MISCELLANEOUS: {
        label: "Miscellaneous",
        icon: ReceiptText,
        color: "#808080", // Gray color
    },
};
