import { useLocalSearchParams, router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { ArrowLeft, User, DollarSign, CreditCard } from "lucide-react-native";
import { friendsService } from "@/services/friendsService";
import { UserType } from "@/definitions/User";
import { formatCurrency } from "@/util/commonFunctions";

interface FriendDetailsType extends UserType {
    balance?: number;
    recentTransactions?: string;
}

export default function FriendDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { colors } = useTheme();
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const [friend, setFriend] = useState<FriendDetailsType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFriendDetails();
    }, [id]);

    const loadFriendDetails = async () => {
        try {
            setLoading(true);
            // Since getFriendDetails doesn't exist, we'll use getFriends and filter
            const response = await friendsService.getFriends(user?.id ?? -1);
            const friendDetails = response.find((f: FriendDetailsType) => f.id === Number(id));
            setFriend(friendDetails || null);
        } catch (error) {
            showAlert("Error", "Failed to load friend details");
        } finally {
            setLoading(false);
        }
    };

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
        content: {
            flex: 1,
            padding: 16,
        },
        profileSection: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            alignItems: "center",
        },
        profileIcon: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
        },
        name: {
            fontFamily: "Inter-SemiBold",
            fontSize: 24,
            color: colors.text,
            marginBottom: 4,
        },
        username: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.secondaryText,
            marginBottom: 8,
        },
        email: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        balanceSection: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
        },
        sectionTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            marginBottom: 16,
        },
        balanceItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        balanceIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.info,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        balanceDetails: {
            flex: 1,
        },
        balanceLabel: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.secondaryText,
            marginBottom: 4,
        },
        balanceAmount: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
        },
        positiveBalance: {
            color: colors.primary,
        },
        negativeBalance: {
            color: colors.error,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
    });

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!friend) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={[styles.sectionTitle, { color: colors.error }]}>
                    Friend not found
                </Text>
            </View>
        );
    }

    const balance = friend.balance ?? 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Friend Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.profileSection}>
                    <View style={styles.profileIcon}>
                        <User size={40} color={colors.background} />
                    </View>
                    <Text style={styles.name}>{friend.name}</Text>
                    <Text style={styles.username}>@{friend.username}</Text>
                    <Text style={styles.email}>{friend.email}</Text>
                </View>

                <View style={styles.balanceSection}>
                    <Text style={styles.sectionTitle}>Balance</Text>
                    
                    <View style={styles.balanceItem}>
                        <View style={styles.balanceIcon}>
                            <DollarSign size={24} color={colors.background} />
                        </View>
                        <View style={styles.balanceDetails}>
                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <Text
                                style={[
                                    styles.balanceAmount,
                                    balance > 0
                                        ? styles.positiveBalance
                                        : balance < 0
                                        ? styles.negativeBalance
                                        : null,
                                ]}
                            >
                                {balance > 0
                                    ? `owes you ${formatCurrency(balance)}`
                                    : balance < 0
                                    ? `you owe ${formatCurrency(Math.abs(balance))}`
                                    : "all settled up"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.balanceItem}>
                        <View style={styles.balanceIcon}>
                            <CreditCard size={24} color={colors.background} />
                        </View>
                        <View style={styles.balanceDetails}>
                            <Text style={styles.balanceLabel}>Recent Transactions</Text>
                            <Text style={styles.balanceAmount}>
                                {friend.recentTransactions || "No recent transactions"}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
} 