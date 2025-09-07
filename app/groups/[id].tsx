import React, { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/util/commonFunctions";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import {
    ArrowLeft,
    ArrowRight,
    PencilLineIcon,
    CirclePlus as PlusCircle,
    TrendingDown,
    TrendingUp,
    UserPlus,
} from "lucide-react-native";
import {
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { groupService } from "@/services/groupsService";
import { useTheme } from "../../context/ThemeContext";
import { useActivity } from "@/context/ActivityContext";
import { GroupType } from "@/definitions/group";
import { ExpenseType } from "@/definitions/expense";
import { UserType } from "@/definitions/User";

// EXTENDED TYPES FOR GROUP PAGE
export type GroupMemberType = UserType & {
    avatar: string;
    isOwed: boolean;
    balance: number;
};

export type GroupDetailsType = GroupType & {
    members: GroupMemberType[];
    totalBalance: number;
    recentExpenses: ExpenseType[];
};

export default function GroupDetailsScreen() {
    const { colors } = useTheme();
    const { id } = useLocalSearchParams();
    const { isRefreshing, setIsRefreshing, isLoading, setIsLoading } =
        useActivity();
    const [group, setGroup] = useState<GroupDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFriendSelector, setShowFriendSelector] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

    const fetchGroupDetails = async () => {
        setLoading(true);
        setIsLoading(true);
        try {
            const details = await groupService.getGroupDetails(Number(id));
            setGroup(details);
        } catch (error) {
            setGroup(null);
        } finally {
            setLoading(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupDetails();
    }, [id, isRefreshing]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchGroupDetails().finally(() => setIsRefreshing(false));
    };

    const handleAddMember = () => {
        setShowFriendSelector(true);
    };

    const handleAddExpense = () => {
        router.push("/expenses/add");
    };

    const handleSettleUp = () => {
        router.push("/expenses/settle");
    };

    const toggleFriendSelection = (friendId: number) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            backgroundColor: colors.card,
            paddingTop: 60,
            paddingBottom: 20,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
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
        settingsButton: {
            padding: 8,
            marginRight: -8,
        },
        headerContent: {
            alignItems: "center",
        },
        groupName: {
            fontFamily: "Inter-Bold",
            fontSize: 24,
            color: colors.text,
            marginBottom: 8,
        },
        memberCount: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        balanceSummary: {
            backgroundColor: colors.card,
            marginTop: 16,
            padding: 16,
        },
        totalBalance: {
            alignItems: "center",
            marginBottom: 16,
        },
        balanceAmount: {
            fontFamily: "Inter-Bold",
            fontSize: 32,
            color: colors.text,
            marginBottom: 4,
        },
        balanceLabel: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        balanceDetails: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        balanceItem: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.cardHighlight,
            borderRadius: 8,
            padding: 12,
            marginHorizontal: 4,
        },
        balanceIcon: {
            marginRight: 8,
        },
        balanceItemContent: {
            flex: 1,
        },
        balanceItemLabel: {
            fontFamily: "Inter-Regular",
            fontSize: 12,
            color: colors.secondaryText,
            marginBottom: 2,
        },
        balanceItemAmount: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
        },
        positiveAmount: {
            color: colors.success,
        },
        negativeAmount: {
            color: colors.error,
        },
        section: {
            backgroundColor: colors.card,
            marginTop: 16,
        },
        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        sectionTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 18,
            color: colors.text,
        },
        sectionAction: {
            flexDirection: "row",
            alignItems: "center",
        },
        actionButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.cardHighlight,
            borderRadius: 16,
            paddingVertical: 6,
            paddingHorizontal: 12,
        },
        actionButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.primary,
            marginLeft: 4,
        },
        memberItem: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        memberAvatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
        },
        memberInfo: {
            flex: 1,
        },
        memberName: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.text,
            marginBottom: 2,
        },
        memberBalance: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
        },
        expenseItem: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        expenseInfo: {
            flex: 1,
        },
        expenseDescription: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.text,
            marginBottom: 2,
        },
        expenseDetails: {
            flexDirection: "row",
            alignItems: "center",
        },
        expenseDate: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
            marginRight: 8,
        },
        expensePaidBy: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        expenseAmount: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            marginLeft: 8,
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
        dangerButton: {
            backgroundColor: colors.error,
            marginHorizontal: 16,
            marginTop: 8,
            marginBottom: 16,
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
        },
        dangerButtonText: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: "#fff",
        },
    });
    if (!group) {
        router.replace("/dashboard" as RelativePathString);
        return null;
    }

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
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => router.push(`/groups/${id}/settings`)}
                    >
                        <PencilLineIcon size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerContent}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.memberCount}>
                        {group.members.length} members
                    </Text>
                </View>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <View style={styles.balanceSummary}>
                    <View style={styles.totalBalance}>
                        <Text style={styles.balanceAmount}>
                            {formatCurrency(group.totalBalance)}
                        </Text>
                        <Text style={styles.balanceLabel}>
                            Total group balance
                        </Text>
                    </View>
                    <View style={styles.balanceDetails}>
                        <View style={styles.balanceItem}>
                            <TrendingUp
                                size={20}
                                color={colors.success}
                                style={styles.balanceIcon}
                            />
                            <View style={styles.balanceItemContent}>
                                <Text style={styles.balanceItemLabel}>
                                    You are owed
                                </Text>
                                <Text
                                    style={[
                                        styles.balanceItemAmount,
                                        styles.positiveAmount,
                                    ]}
                                >
                                    {formatCurrency(150.25)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.balanceItem}>
                            <TrendingDown
                                size={20}
                                color={colors.error}
                                style={styles.balanceIcon}
                            />
                            <View style={styles.balanceItemContent}>
                                <Text style={styles.balanceItemLabel}>
                                    You owe
                                </Text>
                                <Text
                                    style={[
                                        styles.balanceItemAmount,
                                        styles.negativeAmount,
                                    ]}
                                >
                                    {formatCurrency(75.5)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Members</Text>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleAddMember}
                        >
                            <UserPlus size={16} color={colors.primary} />
                            <Text style={styles.actionButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    {group.members.map((member: GroupMemberType) => (
                        <TouchableOpacity
                            key={member.id}
                            style={styles.memberItem}
                            onPress={() =>
                                router.push(`/groups/members/${member.id}`)
                            }
                        >
                            <Image
                                source={{ uri: member.avatar }}
                                style={styles.memberAvatar}
                            />
                            <View style={styles.memberInfo}>
                                <Text style={styles.memberName}>
                                    {member.name}
                                </Text>
                                <Text
                                    style={[
                                        styles.memberBalance,
                                        member.isOwed
                                            ? styles.positiveAmount
                                            : styles.negativeAmount,
                                    ]}
                                >
                                    {member.isOwed
                                        ? `owes ${formatCurrency(
                                              member.balance
                                          )}`
                                        : `you owe ${formatCurrency(
                                              member.balance
                                          )}`}
                                </Text>
                            </View>
                            <ArrowRight
                                size={20}
                                color={colors.secondaryText}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Expenses</Text>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleAddExpense}
                        >
                            <PlusCircle size={16} color={colors.primary} />
                            <Text style={styles.actionButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    {group.recentExpenses.map((expense: ExpenseType) => (
                        <TouchableOpacity
                            key={expense.id}
                            style={styles.expenseItem}
                            onPress={() =>
                                router.push(`/expenses/${expense.id}`)
                            }
                        >
                            <View style={styles.expenseInfo}>
                                <Text style={styles.expenseDescription}>
                                    {expense.description}
                                </Text>
                                <View style={styles.expenseDetails}>
                                    <Text style={styles.expenseDate}>
                                        {formatDate(expense.createdDate)}
                                    </Text>
                                    <Text style={styles.expensePaidBy}>
                                        {expense.paidBy &&
                                        expense.paidBy.id ===
                                            group?.members.find(
                                                (m) =>
                                                    m.id === expense.paidBy.id
                                            )?.id
                                            ? "You paid"
                                            : `${expense.paidBy?.name} paid`}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.expenseAmount}>
                                {formatCurrency(expense.amount)}
                            </Text>
                            <ArrowRight
                                size={20}
                                color={colors.secondaryText}
                                style={{ marginLeft: 8 }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            {showFriendSelector && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 16,
                            padding: 24,
                            width: "80%",
                            maxHeight: "70%",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Inter-SemiBold",
                                fontSize: 18,
                                marginBottom: 16,
                            }}
                        >
                            Select Friends to Add
                        </Text>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {/* Replace with your friends list */}
                            {[
                                { id: 1, name: "John Doe" },
                                { id: 2, name: "Jane Smith" },
                                { id: 3, name: "Mike Johnson" },
                            ].map((friend) => (
                                <TouchableOpacity
                                    key={friend.id}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 12,
                                    }}
                                    onPress={() =>
                                        toggleFriendSelection(friend.id)
                                    }
                                >
                                    <Text style={{ flex: 1, fontSize: 16 }}>
                                        {friend.name}
                                    </Text>
                                    {selectedFriends.includes(friend.id) && (
                                        <View
                                            style={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: 10,
                                                backgroundColor: colors.primary,
                                                marginLeft: 8,
                                            }}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={{
                                marginTop: 24,
                                backgroundColor: colors.primary,
                                borderRadius: 8,
                                padding: 12,
                                alignItems: "center",
                            }}
                            onPress={() => setShowFriendSelector(false)}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontFamily: "Inter-SemiBold",
                                    fontSize: 16,
                                }}
                            >
                                Done
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}
