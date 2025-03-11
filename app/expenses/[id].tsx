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
    Receipt,
    Users,
    Calendar,
    DollarSign,
    Pencil,
    Trash2,
    Share2,
    Download,
} from "lucide-react-native";
import CustomAlert from "../../components/ui/Alert";

// Mock data for the expense details
const mockExpenseDetails = {
    id: "1",
    description: "Dinner at Italian Restaurant",
    amount: 145.8,
    date: "2024-02-15",
    paidBy: "You",
    group: "Trip to Paris",
    category: "Food & Dining",
    splits: [
        { name: "You", amount: 36.45, paid: true },
        { name: "John Doe", amount: 36.45, paid: false },
        { name: "Jane Smith", amount: 36.45, paid: true },
        { name: "Mike Johnson", amount: 36.45, paid: false },
    ],
    notes: "Great dinner with friends at La Maison Italian Restaurant",
    receipt:
        "https://images.unsplash.com/photo-1572799454914-d3c2da8ba50d?w=400&fit=crop",
};

export default function ExpenseDetailsScreen() {
    const { colors } = useTheme();
    const { id } = useLocalSearchParams();
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showSettleAlert, setShowSettleAlert] = useState(false);

    // In a real app, fetch expense details using the ID
    const expense = mockExpenseDetails;

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleEdit = () => {
        router.push(`/expenses/edit/${id}`);
    };

    const handleDelete = () => {
        setShowDeleteAlert(true);
    };

    const handleShare = () => {
        // Implement share functionality
    };

    const handleExport = () => {
        // Implement export functionality
    };

    const handleSettleUp = () => {
        setShowSettleAlert(true);
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
        actionButtons: {
            flexDirection: "row",
            gap: 16,
        },
        headerContent: {
            alignItems: "center",
        },
        amount: {
            fontFamily: "Inter-Bold",
            fontSize: 36,
            color: colors.text,
            marginBottom: 8,
        },
        description: {
            fontFamily: "Inter-SemiBold",
            fontSize: 18,
            color: colors.text,
            marginBottom: 4,
        },
        date: {
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
                        <TouchableOpacity onPress={handleShare}>
                            <Share2 size={24} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleEdit}>
                            <Pencil size={24} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete}>
                            <Trash2 size={24} color={colors.error} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.headerContent}>
                    <Text style={styles.amount}>
                        {formatCurrency(expense.amount)}
                    </Text>
                    <Text style={styles.description}>
                        {expense.description}
                    </Text>
                    <Text style={styles.date}>{formatDate(expense.date)}</Text>
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
                                {expense.group}
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
                                {formatDate(expense.date)}
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
                                {expense.paidBy}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Split Details</Text>
                    {expense.splits.map((split, index) => (
                        <View key={index} style={styles.splitItem}>
                            <View>
                                <Text style={styles.splitName}>
                                    {split.name}
                                </Text>
                                <Text
                                    style={[
                                        styles.paidStatus,
                                        split.paid
                                            ? styles.paidStatusPaid
                                            : styles.paidStatusUnpaid,
                                    ]}
                                >
                                    {split.paid ? "Paid" : "Not paid"}
                                </Text>
                            </View>
                            <Text style={styles.splitAmount}>
                                {formatCurrency(split.amount)}
                            </Text>
                        </View>
                    ))}
                </View>

                {expense.receipt && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Receipt</Text>
                        <View style={styles.receiptContainer}>
                            <Image
                                source={{ uri: expense.receipt }}
                                style={styles.receiptImage}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={styles.settleButton}
                                onPress={handleExport}
                            >
                                <Text style={styles.settleButtonText}>
                                    Download Receipt{" "}
                                    <Download size={16} color="#fff" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {expense.notes && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <Text style={styles.notes}>{expense.notes}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.settleButton}
                    onPress={handleSettleUp}
                >
                    <Text style={styles.settleButtonText}>Settle Up</Text>
                </TouchableOpacity>
            </ScrollView>

            <CustomAlert
                visible={showDeleteAlert}
                title="Delete Expense"
                message="Are you sure you want to delete this expense? This action cannot be undone."
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

            <CustomAlert
                visible={showSettleAlert}
                title="Settle Up"
                message="Do you want to mark this expense as settled?"
                buttons={[
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => setShowSettleAlert(false),
                    },
                    {
                        text: "Settle",
                        style: "default",
                        onPress: () => {
                            setShowSettleAlert(false);
                            router.push("/expenses/settle");
                        },
                    },
                ]}
            />
        </View>
    );
}
