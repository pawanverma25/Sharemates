import { useActivity } from "@/context/ActivityContext";
import { ExpenseType } from "@/definitions/expense";
import { GroupType } from "@/definitions/group";
import { UserType } from "@/definitions/User";
import { groupService } from "@/services/groupsService";
import { formatCurrency, formatDate } from "@/util/commonFunctions";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import {
    ArrowLeft,
    ArrowRight,
    PencilLineIcon,
    CirclePlus as PlusCircle,
    TrendingDown,
    TrendingUp,
    User,
    UserPlus,
    X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { friendsService } from "@/services/friendsService";
import { useAuth } from "@/context/AuthContext";

export default function GroupDetailsScreen() {
    const { colors } = useTheme();
    const { id, groupString } = useLocalSearchParams();
    const { user } = useAuth();
    const { isRefreshing, setIsRefreshing, isLoading, setIsLoading } =
        useActivity();
    const [group, setGroup] = useState<GroupType | null>(
        JSON.parse(groupString as string)
    );
    const [loading, setLoading] = useState(true);
    const [showFriendSelector, setShowFriendSelector] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
    const [frindsToAdd, setFriendsToAdd] = useState<UserType[]>([]);

    const fetchGroupDetails = async () => {
        setLoading(true);
        setIsLoading(true);
        try {
            const [members, recentExpenses, friends] = await Promise.all([
                groupService.getMembers(Number(id)),
                groupService.getGroupExpenses(Number(id)),
                friendsService.getFriends(user?.id ?? 0),
            ]);
            const newGroup: GroupType = {
                ...group!,
                members: members.filter(
                    (member: UserType) => member.id !== user?.id
                ),
                recentExpenses,
            };
            setGroup(newGroup);
            setFriendsToAdd(
                friends.filter(
                    (friend: UserType) =>
                        !members.some(
                            (member: UserType) => member.id === friend.id
                        )
                )
            );
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

    useEffect(() => {
        if (group === null && !loading) {
            router.replace("/dashboard" as RelativePathString);
        }
    }, [group, loading]);

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

    const toggleFriendSelection = (friendId: number) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };

    if (!group || !id) {
        return null;
    }

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
        totalExpenses: {
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
        icon: {
            backgroundColor: colors.info,
            borderRadius: 8,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
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
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => router.push(`/groups/${id}/settings`)}>
                        <PencilLineIcon size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerContent}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.memberCount}>
                        {group.members?.length || 0} members
                    </Text>
                </View>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }>
                <View style={styles.balanceSummary}>
                    <View style={styles.totalExpenses}>
                        <Text style={styles.balanceAmount}>
                            {formatCurrency(
                                group.positiveBalance + group.negativeBalance
                            )}
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
                                    ]}>
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
                                    ]}>
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
                            onPress={handleAddMember}>
                            <UserPlus size={16} color={colors.primary} />
                            <Text style={styles.actionButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    {(group.members || []).map((member: UserType) => {
                        member.balance = member.balance || 0;
                        return (
                            <TouchableOpacity
                                key={member.id}
                                style={styles.memberItem}
                                onPress={() =>
                                    router.push(`/groups/friends/${member.id}`)
                                }>
                                <View style={styles.icon}>
                                    <User size={24} color={colors.text} />
                                </View>
                                <View style={styles.memberInfo}>
                                    <Text style={styles.memberName}>
                                        {member.name}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.memberBalance,
                                            member.balance >= 0
                                                ? styles.positiveAmount
                                                : styles.negativeAmount,
                                        ]}>
                                        {member.balance >= 0
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
                        );
                    })}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Expenses</Text>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleAddExpense}>
                            <PlusCircle size={16} color={colors.primary} />
                            <Text style={styles.actionButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    {(group.recentExpenses || []).map(
                        (expense: ExpenseType) => (
                            <TouchableOpacity
                                key={expense.id}
                                style={styles.expenseItem}
                                onPress={() =>
                                    router.push(`/expenses/${expense.id}`)
                                }>
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
                                                group?.members?.find(
                                                    (m) =>
                                                        m.id ===
                                                        expense.paidBy.id
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
                        )
                    )}
                </View>
            </ScrollView>
            {showFriendSelector && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Friend</Text>
                            <TouchableOpacity
                                onPress={() => setShowFriendSelector(false)}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalList}>
                            {frindsToAdd.map((friend) => (
                                <TouchableOpacity
                                    key={friend.id}
                                    style={styles.modalItem}
                                    onPress={() =>
                                        toggleFriendSelection(friend.id)
                                    }>
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
                            onPress={() => setShowFriendSelector(false)}>
                            <Text style={styles.modalButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}
