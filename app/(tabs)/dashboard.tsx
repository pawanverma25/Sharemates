import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";
import { useRefresh } from "@/context/RefreshContext";
import { useTheme } from "@/context/ThemeContext";
import { BalanceType } from "@/definitions/balance";
import { ExpenseType } from "@/definitions/expense";
import { dashboardService } from "@/services/dashboardService";
import { expensesService } from "@/services/expensesService";
import { formatCurrency, formatDate } from "@/util/commonFunctions";
import { RelativePathString, router } from "expo-router";
import {
    ArrowRight,
    DollarSign,
    PlusCircle,
    TrendingDown,
    TrendingUp,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DashboardScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const { isRefreshing, setIsRefreshing } = useRefresh();

    const [balances, setBalances] = useState<BalanceType[]>([]);
    const [expenses, setExpenses] = useState<ExpenseType[]>([]);
    const [totalOwed, setTotalOwed] = useState(0);
    const [totalOwe, setTotalOwe] = useState(0);
    const [netBalance, setNetBalance] = useState(0);

    const calculateBalances = () => {
        let owed = 0;
        let owe = 0;

        balances.forEach((balance) => {
            if (balance.amount > 0) owed += balance.amount;
            else owe += Math.abs(balance.amount);
        });

        setTotalOwed(owed);
        setTotalOwe(owe);
        setNetBalance(owed - owe);
    };

    const onLoadCallAPIs = async () => {
        setIsRefreshing(true);
        Promise.all([
            dashboardService
                .fetchBalances(user?.id ?? -1)
                .then((res) => {
                    setBalances(res);
                })
                .catch((error) => {
                    showAlert("Error", error);
                }),
            expensesService
                .fetchExpenses(user?.id ?? -1, 3)
                .then((res) => {
                    setExpenses(res);
                })
                .catch((error) => {
                    showAlert("Error", error);
                }),
        ])
            .then(() => {
                setIsRefreshing(false);
            })
            .catch((error) => {
                showAlert("Error", error);
            });
    };

    useEffect(() => {
        onLoadCallAPIs();
    }, []);

    useEffect(() => {
        calculateBalances();
    }, [balances]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        balanceSummary: {
            padding: 16,
            backgroundColor: colors.background,
            marginBottom: 8,
        },
        balanceCard: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
        },
        balanceHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
        },
        balanceTitle: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.secondaryText,
        },
        balanceAmount: {
            fontFamily: "Inter-Bold",
            fontSize: 32,
            marginBottom: 4,
        },
        balanceDescription: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        positiveAmount: {
            color: colors.success,
            fontFamily: "Inter-SemiBold",
        },
        negativeAmount: {
            color: colors.error,
            fontFamily: "Inter-SemiBold",
        },
        neutralAmount: {
            color: colors.text,
            fontFamily: "Inter-SemiBold",
        },
        detailedBalances: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        balanceItem: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 12,
            flex: 0.48,
            borderWidth: 1,
            borderColor: colors.border,
        },
        balanceIconPositive: {
            backgroundColor: colors.success,
            borderRadius: 8,
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        balanceIconNegative: {
            backgroundColor: colors.error,
            borderRadius: 8,
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        balanceDetails: {
            flex: 1,
        },
        balanceLabel: {
            fontFamily: "Inter-Regular",
            fontSize: 12,
            color: colors.secondaryText,
            marginBottom: 2,
        },
        section: {
            backgroundColor: colors.background,
            marginBottom: 8,
            paddingVertical: 16,
        },
        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            marginBottom: 12,
        },
        sectionTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 18,
            color: colors.text,
        },
        seeAllText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.success,
        },
        quickActions: {
            flexDirection: "row",
            paddingHorizontal: 16,
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.cardHighlight,
            borderRadius: 8,
            padding: 12,
            marginRight: 12,
        },
        actionButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.primary,
            marginLeft: 8,
        },
        expenseItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        expenseDetails: {
            flex: 1,
        },
        expenseDescription: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.text,
            marginBottom: 4,
        },
        expenseDate: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        expenseAmount: {
            flexDirection: "row",
            alignItems: "center",
        },
        expenseAmountText: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            marginRight: 8,
        },
        balanceRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        balanceName: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.text,
        },
        balanceRowAmount: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
        },
    });
    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onLoadCallAPIs}
                />
            }
        >
            <View style={styles.balanceSummary}>
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <Text style={styles.balanceTitle}>Total Balance</Text>
                    </View>
                    <Text
                        style={[
                            styles.balanceAmount,
                            netBalance > 0
                                ? styles.positiveAmount
                                : netBalance < 0
                                ? styles.negativeAmount
                                : styles.neutralAmount,
                        ]}
                    >
                        {formatCurrency(Math.abs(netBalance))}
                    </Text>
                    <Text style={styles.balanceDescription}>
                        {netBalance > 0
                            ? "You are owed in total"
                            : netBalance < 0
                            ? "You owe in total"
                            : "All settled up!"}
                    </Text>
                </View>

                <View style={styles.detailedBalances}>
                    <View style={styles.balanceItem}>
                        <View style={styles.balanceIconPositive}>
                            <TrendingUp size={20} color="#fff" />
                        </View>
                        <View style={styles.balanceDetails}>
                            <Text style={styles.balanceLabel}>
                                You are owed
                            </Text>
                            <Text style={styles.positiveAmount}>
                                {formatCurrency(totalOwed)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.balanceItem}>
                        <View style={styles.balanceIconNegative}>
                            <TrendingDown size={20} color="#fff" />
                        </View>
                        <View style={styles.balanceDetails}>
                            <Text style={styles.balanceLabel}>You owe</Text>
                            <Text style={styles.negativeAmount}>
                                {formatCurrency(totalOwe)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push("/expenses/add")}
                    >
                        <PlusCircle size={24} color="#00A86B" />
                        <Text style={styles.actionButtonText}>Add Expense</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push("/expenses/settle")}
                    >
                        <DollarSign size={24} color="#00A86B" />
                        <Text style={styles.actionButtonText}>Settle Up</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Expenses</Text>
                    <TouchableOpacity onPress={() => router.push("/expenses")}>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                {expenses.map((expense) => (
                    <TouchableOpacity
                        key={expense.id}
                        style={styles.expenseItem}
                        onPress={() =>
                            router.push({
                                pathname:
                                    `/expenses/${expense.id}` as RelativePathString,
                                params: { expense: JSON.stringify(expense) },
                            })
                        }
                    >
                        <View style={styles.expenseDetails}>
                            <Text style={styles.expenseDescription}>
                                {expense.description}
                            </Text>
                            <Text style={styles.expenseDate}>
                                {formatDate(expense.date)} •{" "}
                                {expense.paidBy.id == user?.id
                                    ? "You"
                                    : expense.paidBy.name}
                            </Text>
                        </View>
                        <View style={styles.expenseAmount}>
                            <Text style={styles.expenseAmountText}>
                                {formatCurrency(expense.amountOwed)}
                            </Text>
                            <ArrowRight size={16} color="#888" />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Balances</Text>
                    <TouchableOpacity onPress={() => router.push("/groups")}>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                {balances.map((balance, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.balanceRow}
                        onPress={() =>
                            router.push(`/groups/friends/${balance.id}`)
                        }
                    >
                        <Text style={styles.balanceName}>
                            {balance.friendName}
                        </Text>
                        <Text
                            style={[
                                styles.balanceRowAmount,
                                balance.amount > 0
                                    ? styles.positiveAmount
                                    : styles.negativeAmount,
                            ]}
                        >
                            {balance.amount > 0 ? "owes you " : "you owe "}
                            {formatCurrency(Math.abs(balance.amount))}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}
