import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/context/AuthContext";
import { useActivity } from "@/context/ActivityContext";
import { useTheme } from "@/context/ThemeContext";
import { FriendType } from "@/definitions/friend";
import { GroupType } from "@/definitions/group";
import { UserType } from "@/definitions/User";
import { friendsService } from "@/services/friendsService";
import { groupService } from "@/services/groupsService";
import { formatCurrency } from "@/util/commonFunctions";
import { RouteProp, useRoute } from "@react-navigation/native";
import { router, useRouter } from "expo-router";
import { Plus, Search, User, UserPlus, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function GroupsScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const { isRefreshing, setIsRefreshing } = useActivity();
    const route = useRoute<
        RouteProp<
            Record<
                string,
                {
                    activeTab: string;
                    userId: number;
                }
            >
        >
    >();

    const [searchQuery, setSearchQuery] = useState("");
    const [groupList, setGroupList] = useState<GroupType[]>([]);
    const [friendList, setFriendList] = useState<UserType[]>([]);
    const [friendRequestList, setFriendRequestList] = useState<UserType[]>([]);
    const [activeTab, setActiveTab] = useState(
        route.params?.activeTab || "groups"
    ); // 'groups' or 'friends' or 'requests'
    const [addingtoFriends, setAddingtoFriends] = useState<number | null>(null);

    const filteredGroups = groupList.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredFriends = friendList.filter((friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredFriendRequest = friendRequestList.filter((friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUpdateFriendRequest = (friendId: number) => {
        const frendRequest: FriendType = {
            userId: user?.id as number,
            friendId: friendId,
            status: "ACCEPTED",
        };
        setAddingtoFriends(friendId);
        friendsService
            .updateFriendRequest(frendRequest)
            .then((response) => {
                const index = friendRequestList.findIndex(
                    (friend) => friend.id === friendId
                );
                showAlert(
                    "Success",
                    "You are now frieds with " + friendRequestList[index].name
                );

                if (index !== -1) {
                    setFriendList([...friendList, friendRequestList[index]]);
                    setFriendRequestList(
                        friendRequestList.filter(
                            (friend) => friend.id !== friendId
                        )
                    );
                }
                setAddingtoFriends(null);
            })
            .catch((error) => {
                showAlert("Error", error);
                setAddingtoFriends(null);
            });
    };

    const onLoadCallAPIs = () => {
        setIsRefreshing(true);
        Promise.all([
            groupService
                .getGroups(user?.id ?? -1)
                .then((res) => {
                    setGroupList(res);
                })
                .catch((error) => {
                    showAlert("Error", error);
                }),
            friendsService
                .getFriends(user?.id ?? -1)
                .then((res) => {
                    setFriendList(res);
                })
                .catch((error) => {
                    showAlert("Error", error);
                }),
            friendsService
                .getFriendRequestList(user?.id ?? -1)
                .then((res) => {
                    setFriendRequestList(res);
                })
                .catch((error) => {
                    showAlert("Error", error);
                }),
        ]).then(() => {
            setIsRefreshing(false);
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
            padding: 16,
            backgroundColor: colors.background,
        },
        searchBar: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 12,
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
        tabContainer: {
            flexDirection: "row",
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        tab: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 12,
        },
        activeTab: {
            borderBottomWidth: 2,
            borderBottomColor: colors.primary,
        },
        tabText: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.secondaryText,
            marginLeft: 6,
        },
        activeTabText: {
            color: colors.primary,
        },
        content: {
            flex: 1,
            padding: 16,
        },
        addButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
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
        groupItem: {
            flexDirection: "row",
            alignItems: "center",
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
        groupIcon: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        groupDetails: {
            flex: 1,
        },
        groupName: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            marginBottom: 4,
        },
        groupMembers: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.secondaryText,
        },
        groupBalance: {
            alignItems: "flex-end",
        },
        groupBalanceAmount: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
        },
        groupBalanceLabel: {
            fontFamily: "Inter-Regular",
            fontSize: 12,
            color: colors.secondaryText,
        },
        friendItem: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.background,
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },
        friendIcon: {
            backgroundColor: colors.info,
            borderRadius: 8,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        friendDetails: {
            flex: 1,
        },
        friendName: {
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
            color: colors.text,
            marginBottom: 4,
        },
        friendUserName: {
            fontFamily: "Inter-Medium",
            fontSize: 12,
            color: colors.secondaryText,
            marginBottom: 4,
        },
        friendEmail: {
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colors.text,
        },
        friendBalance: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
        },
        positiveBalance: {
            color: colors.primary,
        },
        negativeBalance: {
            color: colors.error,
        },
        settledBalance: {
            fontFamily: "Inter-Medium",
            fontSize: 14,
            color: colors.secondaryText,
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
                        placeholderTextColor={colors.secondaryText}
                        placeholder={`Search ${
                            activeTab === "groups" ? "groups" : "friends"
                        }...`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "groups" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("groups")}
                >
                    <Users
                        size={18}
                        color={
                            activeTab === "groups"
                                ? colors.primary
                                : colors.secondaryText
                        }
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "groups" && styles.activeTabText,
                        ]}
                    >
                        Groups
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "friends" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("friends")}
                >
                    <User
                        size={18}
                        color={
                            activeTab === "friends"
                                ? colors.primary
                                : colors.secondaryText
                        }
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "friends" && styles.activeTabText,
                        ]}
                    >
                        Friends
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "requests" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("requests")}
                >
                    <UserPlus
                        size={18}
                        color={
                            activeTab === "requests"
                                ? colors.primary
                                : colors.secondaryText
                        }
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "requests" && styles.activeTabText,
                        ]}
                    >
                        Requests
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onLoadCallAPIs}
                    />
                }
            >
                {activeTab === "groups" ? (
                    <>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push("/groups/create")}
                        >
                            <Plus size={20} color={colors.primary} />
                            <Text style={styles.addButtonText}>
                                Create a new group
                            </Text>
                        </TouchableOpacity>

                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <TouchableOpacity
                                    key={group.id}
                                    style={styles.groupItem}
                                    onPress={() =>
                                        router.push(`/groups/${group.id}`)
                                    }
                                >
                                    <View style={styles.groupIcon}>
                                        <Users size={24} color={colors.text} />
                                    </View>
                                    <View style={styles.groupDetails}>
                                        <Text style={styles.groupName}>
                                            {group.name}
                                        </Text>
                                        {/* <Text style={styles.groupMembers}>
                                            {group.members} members
                                        </Text> */}
                                    </View>
                                    <View style={styles.groupBalance}>
                                        <Text style={styles.groupBalanceAmount}>
                                            {formatCurrency(group.amountOwed)}
                                        </Text>
                                        <Text style={styles.groupBalanceLabel}>
                                            total
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>
                                    No groups found
                                </Text>
                            </View>
                        )}
                    </>
                ) : activeTab === "friends" ? (
                    <>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push("/groups/add-friend")}
                        >
                            <Plus size={20} color={colors.primary} />
                            <Text style={styles.addButtonText}>
                                Add a new friend
                            </Text>
                        </TouchableOpacity>

                        {filteredFriends.length > 0 ? (
                            filteredFriends.map((friend) => (
                                <TouchableOpacity
                                    key={friend.id}
                                    style={styles.friendItem}
                                    onPress={() =>
                                        router.push(
                                            `/groups/friends/${friend.id}`
                                        )
                                    }
                                >
                                    <View style={styles.friendIcon}>
                                        <User size={24} color={colors.text} />
                                    </View>
                                    <View style={styles.friendDetails}>
                                        <Text style={styles.friendName}>
                                            {friend.name}
                                        </Text>
                                        {friend.balance ? (
                                            <Text
                                                style={[
                                                    styles.friendBalance,
                                                    friend.balance
                                                        ? styles.positiveBalance
                                                        : styles.negativeBalance,
                                                ]}
                                            >
                                                {friend.balance > 0
                                                    ? `owes you ${formatCurrency(
                                                          friend.balance
                                                      )}`
                                                    : `you owe ${formatCurrency(
                                                          friend.balance
                                                      )}`}
                                            </Text>
                                        ) : (
                                            <Text style={styles.settledBalance}>
                                                all settled up
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>
                                    No friends found
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        {filteredFriendRequest.length > 0 ? (
                            filteredFriendRequest.map((friend) => (
                                <View key={friend.id} style={styles.friendItem}>
                                    <View style={styles.friendIcon}>
                                        <User size={24} color={colors.card} />
                                    </View>
                                    <View style={styles.friendDetails}>
                                        <Text style={styles.friendName}>
                                            {friend.name}
                                        </Text>
                                        <Text style={styles.friendUserName}>
                                            {friend.username}
                                        </Text>
                                        {/* <Text style={styles.friendEmail}>
                                            {friend.email}
                                        </Text> */}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() =>
                                            handleUpdateFriendRequest(friend.id)
                                        }
                                    >
                                        {friend.id === addingtoFriends ? (
                                            <ActivityIndicator
                                                size={20}
                                                color={colors.primary}
                                            />
                                        ) : (
                                            <UserPlus
                                                size={20}
                                                color={colors.primary}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>
                                    No friend requests
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}
