import { useAlert } from "@/context/AlertContext";
import { ExpenseSplitType, ExpenseType } from "@/definitions/expense";
import { expensesService } from "@/services/expensesService";
import { formatCurrency, formatDate } from "@/util/commonFunctions";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Pencil,
    Trash2,
    Users,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { expenseCategoryLabels } from "@/constants/expense";

export default function ExpenseDetailsScreen() {
    const route = useRoute<
        RouteProp<
            Record<
                string,
                {
                    expense: string;
                }
            >
        >
    >();
    const expense: ExpenseType = JSON.parse(route.params?.expense);
    const { colors } = useTheme();
    const { id } = useLocalSearchParams();
    const { showAlert } = useAlert();
    const [splits, setSplits] = useState<ExpenseSplitType[]>([]);

    const handleEdit = () => {
        router.push({
            pathname: `/expenses/edit/${id}` as RelativePathString,
            params: {
                expense: JSON.stringify(expense),
            },
        });
    };

    const handleDelete = () => {
        showAlert(
            "Delete Expense",
            "Are you sure you want to delete this expense? This action cannot be undone."
        );
    };

    const handleSettleUp = () => {
        showAlert("Settle Up", "Do you want to mark this expense as settled?");
    };

    const onLoadCallAPIs = async () => {
        expensesService
            .getExpenseSplits(Number(id))
            .then((res) => {
                setSplits(res);
            })
            .catch((error) => {
                showAlert("Error", error);
            });
    };

    useEffect(() => {
        onLoadCallAPIs();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            backgroundColor: colors.background,
            paddingTop: 60,
            paddingBottom: 20,
            paddingHorizontal: 16,
        },
        headerTop: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
        },
        backButton: {
            padding: 8,
            marginLeft: -8,
        },
        actionButtons: {
            flexDirection: "row",
            gap: 16,
        },
        headerContentContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
        },
        headerContent: {
            alignItems: "flex-start",
        },
        amount: {
            fontFamily: "Inter-SemiBold",
            fontSize: 18,
            color: colors.text,
            marginBottom: 4,
        },
        description: {
            fontFamily: "Inter-Bold",
            fontSize: 36,
            color: colors.text,
            marginBottom: 8,
        },
        body: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        created: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        section: {
            backgroundColor: colors.card,
            marginTop: 16,
            paddingVertical: 16,
        },
        sectionTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            paddingHorizontal: 16,
            marginBottom: 12,
        },
        infoRow: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        infoIcon: {
            marginRight: 12,
        },
        infoContent: {
            flex: 1,
        },
        infoLabel: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
            marginBottom: 2,
        },
        infoValue: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.text,
        },
        splitItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        splitName: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.text,
        },
        splitAmount: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
        },
        paidStatus: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            marginTop: 2,
        },
        paidStatusPaid: {
            color: colors.success,
        },
        paidStatusUnpaid: {
            color: colors.error,
        },
        receiptContainer: {
            paddingHorizontal: 16,
        },
        receiptImage: {
            width: "100%",
            height: 200,
            borderRadius: 8,
            marginBottom: 16,
        },
        notes: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.text,
            lineHeight: 24,
            paddingHorizontal: 16,
        },
        settleButton: {
            backgroundColor: colors.primary,
            marginHorizontal: 16,
            marginVertical: 16,
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
        },
        settleButtonText: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: "#fff",
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity onPress={handleEdit}>
                            <Pencil size={24} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete}>
                            <Trash2 size={24} color={colors.error} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.headerContentContainer}>
                    {(() => {
                        const categoryKey =
                            expense.expenseCategory as keyof typeof expenseCategoryLabels;
                        const IconComponent =
                            expenseCategoryLabels[categoryKey]?.icon;
                        const iconColor =
                            expenseCategoryLabels[categoryKey]?.color;
                        return IconComponent ? (
                            <IconComponent size={64} color={iconColor} />
                        ) : null;
                    })()}
                    <View style={styles.headerContent}>
                        <Text style={styles.description}>
                            {expense.description}
                        </Text>
                        <Text style={styles.amount}>
                            {formatCurrency(expense.amount)}
                        </Text>
                        <Text style={styles.body}>
                            Added by {expense.createdBy.name}, on{" "}
                            {formatDate(expense.createdDate)}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Details</Text>
                    <View style={styles.infoRow}>
                        <Users
                            size={20}
                            color={colors.primary}
                            style={styles.infoIcon}
                        />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Group</Text>
                            <Text style={styles.infoValue}>
                                {expense.groupName}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Calendar
                            size={20}
                            color={colors.primary}
                            style={styles.infoIcon}
                        />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Date</Text>
                            <Text style={styles.infoValue}>
                                {formatDate(expense.createdDate)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <DollarSign
                            size={20}
                            color={colors.primary}
                            style={styles.infoIcon}
                        />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Paid by</Text>
                            <Text style={styles.infoValue}>
                                {expense.paidBy.name}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Split Details</Text>
                    {splits?.map((split: ExpenseSplitType, index: number) => {
                        if (split.amountOwed == 0) return null;
                        return (
                            <View key={index} style={styles.splitItem}>
                                <View>
                                    <Text style={styles.splitName}>
                                        {split.user.name}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.paidStatus,
                                            split.paid == "Y"
                                                ? styles.paidStatusPaid
                                                : styles.paidStatusUnpaid,
                                        ]}
                                    >
                                        {split.paid == "Y"
                                            ? "Paid"
                                            : "Not paid"}
                                    </Text>
                                </View>
                                <Text style={styles.splitAmount}>
                                    {formatCurrency(split?.amountOwed)}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={styles.settleButton}
                    onPress={handleSettleUp}
                >
                    <Text style={styles.settleButtonText}>Settle Up</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
