import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ExpenseType } from "@/definitions/expense";
import { expensesService } from "@/services/expensesService";
import { formatCurrency, formatDate } from "@/util/commonFunctions";
import { RelativePathString, router } from "expo-router";
import { ArrowRight, Filter, Plus, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ExpensesScreen() {
    const { user } = useAuth();
    const { colors } = useTheme();
    const { showAlert } = useAlert();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterVisible, setFilterVisible] = useState(false);
    const [expenses, setExpenses] = useState<ExpenseType[]>([]);

    const filteredExpenses = expenses.filter(
        (expense) =>
            expense.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            expense.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onLoadCallAPIs = () => {
        expensesService
            .fetchExpenses(user?.id ?? "-1", 100)
            .then((res) => {
                setExpenses(res);
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
        searchContainer: {
            flexDirection: "row",
            padding: 16,
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        searchBar: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
            borderRadius: 8,
            paddingHorizontal: 12,
            marginRight: 12,
            color: colors.text,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            height: 40,
            fontFamily: "Inter-Regular",
            color: colors.text,
        },
        filterButton: {
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.cardHighlight,
            borderRadius: 8,
        },
        filterContainer: {
            backgroundColor: colors.background,
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        filterTitle: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.secondaryText,
            marginBottom: 8,
        },
        filterOptions: {
            flexDirection: "row",
        },
        filterOption: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 16,
            marginRight: 8,
            backgroundColor: colors.card,
        },
        activeFilterOption: {
            backgroundColor: colors.primary,
        },
        filterOptionText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.secondaryText,
        },
        activeFilterOptionText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.text,
        },
        content: {
            flex: 1,
            padding: 16,
        },
        addButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.cardHighlight,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
        },
        addButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.primary,
            marginLeft: 8,
        },
        expenseItem: {
            backgroundColor: colors.background,
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        expenseHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
        },
        expenseDescription: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            flex: 1,
        },
        expenseAmount: {
            backgroundColor: colors.cardHighlight,
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 4,
        },
        expenseAmountText: {
            fontFamily: "Inter-SemiBold",
            fontSize: 14,
            color: colors.primary,
        },
        expenseDetails: {
            marginBottom: 8,
        },
        expenseInfo: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
        },
        expenseDate: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        expenseDot: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
            marginHorizontal: 4,
        },
        expenseGroup: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        expenseParticipants: {
            flexDirection: "row",
            alignItems: "center",
        },
        expensePaidBy: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.text,
            marginRight: 8,
        },
        expenseParticipantsText: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        expenseAction: {
            alignItems: "flex-end",
        },
        emptyState: {
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
        },
        emptyStateText: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.secondaryText,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search
                        size={20}
                        color={colors.secondaryText}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search expenses..."
                        value={searchQuery}
                        placeholderTextColor={colors.secondaryText}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setFilterVisible(!filterVisible)}
                >
                    <Filter size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {filterVisible && (
                <View style={styles.filterContainer}>
                    <Text style={styles.filterTitle}>Filter by:</Text>
                    <View style={styles.filterOptions}>
                        <TouchableOpacity style={styles.filterOption}>
                            <Text style={styles.filterOptionText}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.filterOption,
                                styles.activeFilterOption,
                            ]}
                        >
                            <Text style={styles.activeFilterOptionText}>
                                Recent
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterOption}>
                            <Text style={styles.filterOptionText}>Group</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterOption}>
                            <Text style={styles.filterOptionText}>Amount</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <ScrollView style={styles.content}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push("/expenses/add")}
                >
                    <Plus size={20} color={colors.primary} />
                    <Text style={styles.addButtonText}>Add a new expense</Text>
                </TouchableOpacity>

                {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                        <TouchableOpacity
                            key={expense.id}
                            style={styles.expenseItem}
                            onPress={() =>
                                router.push({
                                    pathname:
                                        `/expenses/${expense.id}` as RelativePathString,
                                    params: {
                                        expense: JSON.stringify(expense),
                                    },
                                })
                            }
                        >
                            <View style={styles.expenseHeader}>
                                <Text style={styles.expenseDescription}>
                                    {expense.description}
                                </Text>
                                <View style={styles.expenseAmount}>
                                    <Text style={styles.expenseAmountText}>
                                        {formatCurrency(expense.amount)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.expenseDetails}>
                                <View style={styles.expenseInfo}>
                                    <Text style={styles.expenseDate}>
                                        {formatDate(expense.date)}
                                    </Text>
                                    <Text style={styles.expenseDot}>•</Text>
                                    <Text style={styles.expenseGroup}>
                                        {expense.groupName}
                                    </Text>
                                </View>

                                <View style={styles.expenseParticipants}>
                                    <Text style={styles.expensePaidBy}>
                                        {expense.paidBy.id === user?.id
                                            ? "You paid"
                                            : `${expense.paidBy.name} paid`}
                                    </Text>
                                    {/* <Text
                                        style={styles.expenseParticipantsText}
                                    >
                                        {`Split with ${expense.participants.length} people`}
                                    </Text> */}
                                </View>
                            </View>

                            <View style={styles.expenseAction}>
                                <ArrowRight
                                    size={16}
                                    color={colors.secondaryText}
                                />
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            No expenses found
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
