import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { FriendType } from "@/definitions/friend";
import { UserType } from "@/definitions/User";
import { friendsService } from "@/services/friendsService";
import { router } from "expo-router";
import { ArrowLeft, Search, User, UserCheck, UserPlus, UserX } from "lucide-react-native";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddFriendScreen() {
    const {showAlert} = useAlert();
    const {colors} = useTheme();
    const {user} = useAuth();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserType[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [addingtoFriends, setAddingtoFriends] = useState<number | null>(null);

    const handleSearch = () => {
        if (!searchQuery) {
            showAlert("Error", "Please enter an searchQuery address");
            return;
        }
        setIsSearching(true);
        friendsService.searchFriends(searchQuery, user?.id as number)
            .then((response) => {
                setSearchResults(response);
                setIsSearching(false);
            })
            .catch((error) => {
                showAlert("Error", error);
                setSearchResults([]);
                setIsSearching(false);
            });
        setIsSearching(true);
    };

    const handleAddFriend = (friendId: number) => {
        const frendRequest : FriendType = {
            userId: user?.id as number,
            friendId: friendId,
        }
        setAddingtoFriends(friendId);
        friendsService.addFriends(frendRequest).then((response) => {    
            showAlert("Success", "Friend request has been sent");
            setSearchResults(searchResults.map((user) => {
                if (user.id === friendId) {
                    return { ...user, status: "PENDING" };
                }
                return user;
            }));
            setAddingtoFriends(null);
        }
        ).catch((error) => {
            showAlert("Error", error);
            setAddingtoFriends(null);
        }
        );
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
        searchSection: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
        },
        sectionTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            marginBottom: 8,
        },
        sectionDescription: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.text,
            marginBottom: 16,
        },
        searchContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        searchInput: {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            fontFamily: "Inter-Regular",
            fontSize: 16,
            marginRight: 8,
            color: colors.text,
        },
        searchButton: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 12,
        },
        loadingContainer: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 16,
            alignItems: "center",
        },
        loadingText: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.text,
        },
        resultsSection: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 16,
        },
        resultsTitle: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            marginBottom: 16,
        },
        userItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        userIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#5B7FFF",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        userDetails: {
            flex: 1,
        },
        name: {
            fontFamily: "Inter-Medium",
            fontSize: 16,
            color: colors.text,
            marginBottom: 4,
        },
        userName: {
            fontFamily: "Inter-Medium",
            fontSize: 12,
            color: colors.secondaryText,
            marginBottom: 4,
        },
        userEmail: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.text,
        },
        addButton: {
            padding: 8,
        },
        noResultsContainer: {
            backgroundColor: colors.card,
            borderRadius: 8,
            padding: 16,
            alignItems: "center",
        },
        noResultsText: {
            fontFamily: "Inter-Regular",
            fontSize: 16,
            color: colors.text,
            marginBottom: 16,
            textAlign: "center",
        },
        inviteButton: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 12,
        },
        inviteButtonText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.background,
        },
    });

    return (
        <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Friend</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.searchSection}>
                        <Text style={styles.sectionTitle}>Find a Friend</Text>
                        <Text style={styles.sectionDescription}>
                            Enter your friend's email address or username to
                            send them a friend request.
                        </Text>

                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholderTextColor={colors.secondaryText}
                                placeholder="Enter email address or username"
                                value={searchQuery}
                                onKeyPress={(e) => {
                                    if (e.nativeEvent.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                                onChangeText={setSearchQuery}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.searchButton}
                                onPress={handleSearch}
                                disabled={isSearching}
                            >
                                <Search size={20} color={colors.card} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {isSearching && (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Searching...</Text>
                        </View>
                    )}

                    {!isSearching && searchResults.length > 0 && (
                        <View style={styles.resultsSection}>
                            <Text style={styles.resultsTitle}>
                                Search Results
                            </Text>

                            {searchResults.map((user) => (
                                <View key={user.id} style={styles.userItem}>
                                    <View style={styles.userIcon}>
                                        <User size={24} color={colors.card} />
                                    </View>
                                    <View style={styles.userDetails}>
                                        <Text style={styles.name}>
                                            {user.name}
                                        </Text>
                                        <Text style={styles.userName}>
                                            {user.username}
                                        </Text>
                                        <Text style={styles.userEmail}>
                                            {user.email}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() => handleAddFriend(user.id)}
                                    >
                                        
                                        {user.id === addingtoFriends ? (
                                            <ActivityIndicator size={20} color={colors.primary} />
                                        ) : user.status === "PENDING" ? (
                                            <UserCheck
                                                size={20}
                                                color={colors.primary}
                                            />
                                        
                                        ) : user.status === "REJECTED" ? (
                                            <UserX
                                                size={20}
                                                color={colors.primary}
                                            />
                                        ) : user.status === null && (
                                            <UserPlus
                                                size={20}
                                                color={colors.primary}
                                            />
                                        ) }
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* {!isSearching && searchQuery && searchResults.length === 0 && (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>
                            No users found with that email address.
                        </Text>
                        <TouchableOpacity
                            style={styles.inviteButton}
                            onPress={() => {
                                Alert.alert(
                                    "Invite Sent",
                                    `An invitation has been sent to ${searchQuery}`,
                                    [{ text: "OK" }]
                                );
                            }}
                        >
                            <Text style={styles.inviteButtonText}>
                                Send Invitation
                            </Text>
                        </TouchableOpacity>
                    </View>
                )} */}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
