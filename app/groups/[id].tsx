import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import {
    ArrowLeft,
    Users,
    Settings,
    UserPlus,
    CirclePlus as PlusCircle,
    ArrowRight,
    DollarSign,
    TrendingUp,
    TrendingDown,
} from "lucide-react-native";
import CustomAlert from "../../components/ui/Alert";

// Mock data for the group details
const mockGroupDetails = {
    id: "1",
    name: "Trip to Paris",
    totalBalance: 450.75,
    members: [
        {
            id: 1,
            name: "You",
            balance: 150.25,
            isOwed: true,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop",
        },
        {
            id: 2,
            name: "John Doe",
            balance: 75.5,
            isOwed: false,
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&fit=crop",
        },
        {
            id: 3,
            name: "Jane Smith",
            balance: 125.0,
            isOwed: true,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop",
        },
        {
            id: 4,
            name: "Mike Johnson",
            balance: 100.0,
            isOwed: false,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop",
        },
    ],
    recentExpenses: [
        {
            id: 1,
            description: "Hotel Booking",
            amount: 250.0,
            date: "2024-02-15",
            paidBy: "You",
        },
        {
            id: 2,
            description: "Dinner at Le Petit",
            amount: 120.75,
            date: "2024-02-14",
            paidBy: "John Doe",
        },
        {
            id: 3,
            description: "Metro Tickets",
            amount: 80.0,
            date: "2024-02-13",
            paidBy: "Jane Smith",
        },
    ],
};

export default function GroupDetailsScreen() {
    const { colors } = useTheme();
    const { id } = useLocalSearchParams();
    const [showLeaveAlert, setShowLeaveAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    // In a real app, fetch group details using the ID
    const group = mockGroupDetails;

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const handleAddMember = () => {
        router.push(`/groups/${id}/add-member`);
    };

    const handleAddExpense = () => {
        router.push("/expenses/add");
    };

    const handleSettleUp = () => {
        router.push("/expenses/settle");
    };

    const handleLeaveGroup = () => {
        setShowLeaveAlert(true);
    };

    const handleDeleteGroup = () => {
        setShowDeleteAlert(true);
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
                        <Settings size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerContent}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.memberCount}>
                        {group.members.length} members
                    </Text>
                </View>
            </View>

            <ScrollView>
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
                    {group.members.map((member) => (
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
                    {group.recentExpenses.map((expense) => (
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
                                        {formatDate(expense.date)}
                                    </Text>
                                    <Text style={styles.expensePaidBy}>
                                        {expense.paidBy === "You"
                                            ? "You paid"
                                            : `${expense.paidBy} paid`}
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

                <TouchableOpacity
                    style={styles.settleButton}
                    onPress={handleSettleUp}
                >
                    <Text style={styles.settleButtonText}>Settle Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dangerButton}
                    onPress={handleLeaveGroup}
                >
                    <Text style={styles.dangerButtonText}>Leave Group</Text>
                </TouchableOpacity>
            </ScrollView>

            <CustomAlert
                visible={showLeaveAlert}
                title="Leave Group"
                message="Are you sure you want to leave this group? You won't be able to see any expenses or activity after leaving."
                buttons={[
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => setShowLeaveAlert(false),
                    },
                    {
                        text: "Leave",
                        style: "destructive",
                        onPress: () => {
                            setShowLeaveAlert(false);
                            router.back();
                        },
                    },
                ]}
            />

            <CustomAlert
                visible={showDeleteAlert}
                title="Delete Group"
                message="Are you sure you want to delete this group? This action cannot be undone."
                buttons={[
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => setShowDeleteAlert(false),
                    },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => {
                            setShowDeleteAlert(false);
                            router.back();
                        },
                    },
                ]}
            />
        </View>
    );
}
