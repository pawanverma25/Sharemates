import {
    ChevronRight,
    CircleHelp as HelpCircle,
    Mail,
} from "lucide-react-native";
import React from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function HelpSupportScreen() {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        section: {
            backgroundColor: colors.card,
            marginBottom: 16,
            paddingVertical: 8,
        },
        sectionTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        item: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        itemContent: {
            flex: 1,
            marginLeft: 12,
        },
        itemTitle: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.text,
            marginBottom: 4,
        },
        itemDescription: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        faqSection: {
            backgroundColor: colors.card,
            marginBottom: 16,
        },
        faqItem: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            padding: 16,
        },
        faqQuestion: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            marginBottom: 8,
        },
        faqAnswer: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
            lineHeight: 20,
        },
    });

    const faqs = [
        {
            question: "How do I add a new expense?",
            answer: "Tap the '+' button in the Expenses tab, enter the expense details including amount and description, select who to split with, and choose how to split the expense (equally, percentage, or custom amounts).",
        },
        {
            question: "How do I settle up with a friend?",
            answer: "Go to the Groups tab, select the friend you want to settle with, and tap 'Settle Up'. You can then record the payment and mark the debt as settled.",
        },
        {
            question: "Can I split expenses unequally?",
            answer: "Yes! When adding an expense, you can choose between equal split, percentage split, or exact amounts for each person involved.",
        },
        {
            question: "How do I create a group?",
            answer: "In the Groups tab, tap 'Create Group', enter a group name, and select the friends you want to add to the group.",
        },
    ];

    const handleEmailSupport = () => {
        Linking.openURL("mailto:support@sharemates.app");
    };

    const handleLiveChat = () => {
        // In a real app, this would open your live chat system
        alert("Live chat feature coming soon!");
    };

    const handleDocumentation = () => {
        Linking.openURL("https://docs.sharemates.app");
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Support</Text>

                <TouchableOpacity
                    style={styles.item}
                    onPress={handleEmailSupport}
                >
                    <Mail size={24} color={colors.primary} />
                    <View style={styles.itemContent}>
                        <Text style={styles.itemTitle}>Email Support</Text>
                        <Text style={styles.itemDescription}>
                            Get help via email
                        </Text>
                    </View>
                    <ChevronRight size={20} color={colors.secondaryText} />
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.item} onPress={handleLiveChat}>
          <MessageCircle size={24} color={colors.primary} />
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Live Chat</Text>
            <Text style={styles.itemDescription}>
              Chat with our support team
            </Text>
          </View>
          <ChevronRight size={20} color={colors.secondaryText} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleDocumentation}>
          <FileText size={24} color={colors.primary} />
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Documentation</Text>
            <Text style={styles.itemDescription}>Browse our help articles</Text>
          </View>
          <ChevronRight size={20} color={colors.secondaryText} />
        </TouchableOpacity> */}
            </View>

            <View style={styles.faqSection}>
                <Text style={styles.sectionTitle}>
                    Frequently Asked Questions
                </Text>
                {faqs.map((faq, index) => (
                    <View key={index} style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>
                            <HelpCircle size={16} color={colors.primary} />{" "}
                            {faq.question}
                        </Text>
                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
