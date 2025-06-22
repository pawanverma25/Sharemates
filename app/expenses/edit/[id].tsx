import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";
import { useRefresh } from "@/context/RefreshContext";
import { useTheme } from "@/context/ThemeContext";
import {
    ExpenseRequestType,
    ExpenseSplitType,
    ExpenseType,
    participantType,
} from "@/definitions/expense";
import { GroupType } from "@/definitions/group";
import { UserType } from "@/definitions/User";
import { expensesService } from "@/services/expensesService";
import { friendsService } from "@/services/friendsService";
import { groupService } from "@/services/groupsService";
import { RouteProp, useRoute } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Percent,
    Users,
    X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditExpenseScreen() {
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
    const { colors } = useTheme();
    const { isRefreshing, setIsRefreshing } = useRefresh();
    const { user } = useAuth();
    const { showAlert } = useAlert();

    const expense: ExpenseType = JSON.parse(route.params?.expense);
    const { id } = useLocalSearchParams();

    const [group, setGroup] = useState<GroupType | null>(null);
    const [friendList, setFriendList] = useState<UserType[]>(
        user ? [user] : []
    );

    const [description, setDescription] = useState(expense.description);
    const [amount, setAmount] = useState<string>(expense.amount.toString());
    const [date, setDate] = useState<Date>(new Date(expense.createdDate));
    const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
    const [paidBy, setPaidBy] = useState<UserType | null>(
        expense.paidBy || null
    );
    const [splitType, setSplitType] = useState(expense.splitType);
    const [showFriendSelector, setShowFriendSelector] = useState(false);
    const [showPaidBySelector, setShowPaidBySelector] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [friendSplits, setFriendSplits] = useState<Record<number, number>>(
        {}
    );

    const handleSave = async () => {
        if (!description || !amount) {
            showAlert("Error", "Please fill in all required fields");
            return;
        }
        if (paidBy === null) {
            showAlert("Error", "Please select who paid for the expense");
            return;
        }
        if (splitType === "EXACT" || splitType === "PERCENTAGE") {
            const totalSplitAmount = Object.values(friendSplits).reduce(
                (sum, amt) => sum + amt,
                0
            );
            if (
                totalSplitAmount !== parseFloat(amount) &&
                splitType === "EXACT"
            ) {
                showAlert(
                    "Error",
                    "Total split amounts must equal the expense amount"
                );
                return;
            }
            if (
                Math.abs(totalSplitAmount - 100) > 0.01 &&
                splitType === "PERCENTAGE"
            ) {
                showAlert("Error", "Total percentage must equal 100%");
                return;
            }
        }
        const totalAmount = parseFloat(amount);
        let participants: participantType[] = [];

        if (splitType === "EQUAL") {
            participants = selectedFriends.map((friendId) => ({
                id: friendId,
                amount: totalAmount / selectedFriends.length,
            }));
        } else if (splitType === "PERCENTAGE") {
            const totalPercentage = Object.values(friendSplits).reduce(
                (sum, percent) => sum + percent,
                0
            );
            if (Math.abs(totalPercentage - 100) > 0.01) {
                showAlert("Error", "Total percentage must equal 100%");
                return;
            }
            participants = selectedFriends.map((friendId) => ({
                id: friendId,
                amount: (totalAmount * friendSplits[friendId]) / 100,
            }));
        } else if (splitType === "EXACT") {
            const totalSplitAmount = Object.values(friendSplits).reduce(
                (sum, amt) => sum + amt,
                0
            );
            if (Math.abs(totalSplitAmount - totalAmount) !== 0) {
                showAlert(
                    "Error",
                    "Total split amounts must equal the expense amount"
                );
                return;
            }
            participants = selectedFriends.map((friendId) => ({
                id: friendId,
                amount: friendSplits[friendId],
            }));
        }
        if (participants.filter((p) => p.id === paidBy?.id).length === 0)
            participants.push({ id: paidBy?.id ?? -1, amount: 0 });

        const expenseSaved = await expensesService.editExpenses({
            description: description,
            createdDate: date.toISOString().split("T")[0],
            paidBy: paidBy?.id,
            groupId: expense.groupId,
            createdBy: user?.id,
            amount: totalAmount,
            splitType: splitType,
            participants: participants,
        } as ExpenseRequestType);
        if (expenseSaved)
            showAlert("Success", "Expense edited successfully", () =>
                router.back()
            );
        else showAlert("Error", "Something went wrong", () => router.back());
    };

    const toggleFriendSelection = (friendId: number) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
            const newSplits = { ...friendSplits };
            delete newSplits[friendId];
            setFriendSplits(newSplits);
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
            if (splitType === "EQUAL") {
                setFriendSplits({
                    ...friendSplits,
                    [friendId]: 100 / (selectedFriends.length + 1),
                });
            } else {
                setFriendSplits({
                    ...friendSplits,
                    [friendId]: 0,
                });
            }
        }
    };

    const getSelectedFriendsText = () => {
        if (selectedFriends.length === 0) {
            return "Select friends";
        } else if (selectedFriends.length === 1) {
            const friend = friendList.find((f) => f.id === selectedFriends[0]);
            return friend ? friend.name : "";
        } else {
            return `${selectedFriends.length} friends selected`;
        }
    };

    const onLoadCallAPIs = async () => {
        setIsRefreshing(true);
        Promise.all([
            friendsService
                .getFriends(user?.id ?? -1)
                .then((res) => {
                    setFriendList(res);
                })
                .catch((error) => {
                    showAlert("Error", error);
                }),
            groupService
                .getGroupDetails(expense.groupId ?? -1)
                .then((res) => {
                    setGroup(res);
                })
                .catch((error) => {
                    showAlert("Error", error);
                }),
            expensesService
                .getExpenseSplits(Number(id))
                .then((res) => {
                    setFriendList(
                        res.map((split: ExpenseSplitType) => split.user)
                    );
                    setSelectedFriends(
                        res.map((split: ExpenseSplitType) => split.user.id)
                    );
                    setFriendSplits((split) => {
                        const newSplits: Record<number, number> = {};
                        res.forEach((s: ExpenseSplitType) => {
                            newSplits[s.user.id] = s.amountOwed;
                        });
                        return newSplits;
                    });
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

    const handleSplitChange = (friendId: number, value: string) => {
        const numValue = parseFloat(value);
        if (
            splitType == "PERCENTAGE" &&
            (isNaN(numValue) || numValue < 0 || numValue > 100)
        ) {
            showAlert("Error", "Percentage must be between 0 and 100");
            return;
        }
        setFriendSplits({
            ...friendSplits,
            [friendId]: numValue,
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
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.background,
            paddingTop: 50,
            paddingBottom: 16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        backButton: {
            padding: 4,
        },
        headerTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 18,
            color: colors.text,
        },
        saveButton: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 16,
            backgroundColor: colors.primary,
        },
        saveButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.background,
        },
        content: {
            flex: 1,
        },
        formSection: {
            backgroundColor: colors.background,
            marginBottom: 16,
            padding: 16,
        },
        sectionTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            marginBottom: 16,
        },
        inputContainer: {
            marginBottom: 16,
        },
        label: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.secondaryText,
            marginBottom: 8,
        },
        input: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            color: colors.text,
            padding: 12,
            fontFamily: "Inter-Regular",
            fontSize: 16,
        },
        amountInputContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 8,
            width: "100%",
        },
        currencySymbol: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.text,
            marginRight: 4,
        },
        amountInput: {
            flex: 1,
            padding: 8,
            fontFamily: "Inter-Regular",
            color: colors.text,
            fontSize: 14,
        },
        selectorButton: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
        },
        selectorButtonText: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.text,
            marginLeft: 8,
            flex: 1,
        },
        splitTypeContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
        },
        splitTypeButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            flex: 0.32,
        },
        activeSplitTypeButton: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            borderWidth: 1,
        },
        splitTypeText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.secondaryText,
            marginLeft: 4,
        },
        activeSplitTypeText: {
            color: colors.background,
        },
        splitDescription: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 12,
            borderRadius: 8,
        },
        additionalOption: {
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            backgroundColor: colors.background,
        },
        additionalOptionText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.secondaryText,
            marginLeft: 8,
        },
        modalOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        },
        modalContent: {
            backgroundColor: colors.background,
            borderRadius: 12,
            width: "80%",
            maxHeight: "70%",
            padding: 16,
        },
        modalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
        },
        modalTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 18,
            color: colors.text,
        },
        modalList: {
            maxHeight: 300,
        },
        modalItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.background,
        },
        modalItemText: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.text,
        },
        selectedIndicator: {
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: colors.primary,
        },
        modalButton: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 12,
            alignItems: "center",
            marginTop: 16,
        },
        modalButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.background,
        },
        splitInputsContainer: {
            marginTop: 16,
        },
        splitInputRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
        },
        splitInputLabel: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.text,
            flex: 1,
        },
        splitAmountInputContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            width: 100,
        },
        percentageSymbol: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.text,
            marginLeft: 4,
        },
    });

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Expense</Text>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={<RefreshControl refreshing={isRefreshing} />}
            >
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Basic Details</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={colors.secondaryText}
                            placeholder="What was this expense for?"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Amount</Text>
                        <View style={styles.amountInputContainer}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                placeholderTextColor={colors.secondaryText}
                                value={amount + ""}
                                onChangeText={(value) => setAmount(value)}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Calendar size={20} color={colors.secondaryText} />
                            <Text style={styles.selectorButtonText}>
                                {date.toISOString().split("T")[0]}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Split With</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Group</Text>
                        <View style={styles.selectorButton}>
                            <Users size={20} color={colors.secondaryText} />
                            <Text style={styles.selectorButtonText}>
                                {group?.name || "Non-group Expense"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Friends</Text>
                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setShowFriendSelector(true)}
                        >
                            <Users size={20} color={colors.secondaryText} />
                            <Text style={styles.selectorButtonText}>
                                {getSelectedFriendsText()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Paid By</Text>
                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setShowPaidBySelector(true)}
                        >
                            <Users size={20} color={colors.secondaryText} />
                            <Text style={styles.selectorButtonText}>
                                {paidBy ? paidBy.name : "Select payer"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Split Options</Text>

                    <View style={styles.splitTypeContainer}>
                        <TouchableOpacity
                            style={[
                                styles.splitTypeButton,
                                splitType === "EQUAL" &&
                                    styles.activeSplitTypeButton,
                            ]}
                            onPress={() => setSplitType("EQUAL")}
                        >
                            <DollarSign
                                size={20}
                                color={
                                    splitType === "EQUAL"
                                        ? colors.background
                                        : colors.secondaryText
                                }
                            />
                            <Text
                                style={[
                                    styles.splitTypeText,
                                    splitType === "EQUAL" &&
                                        styles.activeSplitTypeText,
                                ]}
                            >
                                Equal
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.splitTypeButton,
                                splitType === "PERCENTAGE" &&
                                    styles.activeSplitTypeButton,
                            ]}
                            onPress={() => setSplitType("PERCENTAGE")}
                        >
                            <Percent
                                size={20}
                                color={
                                    splitType === "PERCENTAGE"
                                        ? colors.background
                                        : colors.secondaryText
                                }
                            />
                            <Text
                                style={[
                                    styles.splitTypeText,
                                    splitType === "PERCENTAGE" &&
                                        styles.activeSplitTypeText,
                                ]}
                            >
                                Percentage
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.splitTypeButton,
                                splitType === "EXACT" &&
                                    styles.activeSplitTypeButton,
                            ]}
                            onPress={() => setSplitType("EXACT")}
                        >
                            <DollarSign
                                size={20}
                                color={
                                    splitType === "EXACT"
                                        ? colors.background
                                        : colors.secondaryText
                                }
                            />
                            <Text
                                style={[
                                    styles.splitTypeText,
                                    splitType === "EXACT" &&
                                        styles.activeSplitTypeText,
                                ]}
                            >
                                Amount
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {splitType === "EQUAL" && (
                        <Text style={styles.splitDescription}>
                            The total amount will be split equally among all
                            selected people.
                        </Text>
                    )}

                    {splitType === "PERCENTAGE" && (
                        <View>
                            <Text style={styles.splitDescription}>
                                Specify what percentage of the total each person
                                should pay.
                            </Text>
                            <View style={styles.splitInputsContainer}>
                                {selectedFriends.map((friendId) => {
                                    const friend = friendList.find(
                                        (f) => f.id === friendId
                                    );
                                    if (!friend) return null; // Handle case where friend is not found
                                    return (
                                        <View
                                            key={friendId}
                                            style={styles.splitInputRow}
                                        >
                                            <Text
                                                style={styles.splitInputLabel}
                                            >
                                                {friend?.name}
                                            </Text>
                                            <View
                                                style={
                                                    styles.splitAmountInputContainer
                                                }
                                            >
                                                <TextInput
                                                    style={styles.amountInput}
                                                    placeholder="0.00"
                                                    placeholderTextColor={
                                                        colors.text
                                                    }
                                                    keyboardType="decimal-pad"
                                                    value={
                                                        friendSplits[
                                                            friendId
                                                        ]?.toString() || ""
                                                    }
                                                    onChangeText={(value) =>
                                                        handleSplitChange(
                                                            friendId,
                                                            value
                                                        )
                                                    }
                                                />
                                                <Text
                                                    style={
                                                        styles.percentageSymbol
                                                    }
                                                >
                                                    %
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {splitType === "EXACT" && (
                        <View>
                            <Text style={styles.splitDescription}>
                                Specify the exact amount each person should pay.
                            </Text>
                            <View style={styles.splitInputsContainer}>
                                {selectedFriends.map((friendId) => {
                                    const friend = friendList.find(
                                        (f) => f.id === friendId
                                    );
                                    if (!friend) return null;
                                    return (
                                        <View
                                            key={friendId}
                                            style={styles.splitInputRow}
                                        >
                                            <Text
                                                style={styles.splitInputLabel}
                                            >
                                                {friend?.name}
                                            </Text>
                                            <View
                                                style={
                                                    styles.splitAmountInputContainer
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.currencySymbol
                                                    }
                                                >
                                                    ₹
                                                </Text>
                                                <TextInput
                                                    style={styles.amountInput}
                                                    placeholder="0.00"
                                                    keyboardType="decimal-pad"
                                                    value={
                                                        friendSplits[
                                                            friendId
                                                        ]?.toString() || ""
                                                    }
                                                    onChangeText={(value) =>
                                                        handleSplitChange(
                                                            friendId,
                                                            value
                                                        )
                                                    }
                                                />
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {showFriendSelector && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Select Friends
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowFriendSelector(false)}
                            >
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalList}>
                            {friendList.map((friend) => (
                                <TouchableOpacity
                                    key={friend.id}
                                    style={styles.modalItem}
                                    onPress={() =>
                                        toggleFriendSelection(friend.id)
                                    }
                                >
                                    <Text style={styles.modalItemText}>
                                        {friend.name}
                                    </Text>
                                    {selectedFriends.includes(friend.id) && (
                                        <View
                                            style={styles.selectedIndicator}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowFriendSelector(false)}
                        >
                            <Text style={styles.modalButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {showPaidBySelector && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Paid By</Text>
                            <TouchableOpacity
                                onPress={() => setShowPaidBySelector(false)}
                            >
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalList}>
                            {friendList.map((friend) => (
                                <TouchableOpacity
                                    key={friend.id}
                                    style={styles.modalItem}
                                    onPress={() => setPaidBy(friend)}
                                >
                                    <Text style={styles.modalItemText}>
                                        {friend.name}
                                    </Text>
                                    {paidBy?.id === friend.id && (
                                        <View
                                            style={styles.selectedIndicator}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowPaidBySelector(false)}
                        >
                            <Text style={styles.modalButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}
