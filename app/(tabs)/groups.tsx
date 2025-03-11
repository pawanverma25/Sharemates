import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Plus, Users, User } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
// Mock data for groups and friends
const mockGroups = [
  { id: 1, name: 'Roommates', members: 4, totalBalance: 125.5 },
  { id: 2, name: 'Trip to Paris', members: 6, totalBalance: 230.75 },
  { id: 3, name: 'Office Lunch', members: 8, totalBalance: 45.2 },
];

const mockFriends = [
  { id: 1, name: 'John Doe', balance: 25.5, isOwed: true },
  { id: 2, name: 'Jane Smith', balance: 12.75, isOwed: false },
  { id: 3, name: 'Mike Johnson', balance: 8.3, isOwed: true },
  { id: 4, name: 'Sarah Williams', balance: 15.4, isOwed: false },
  { id: 5, name: 'David Brown', balance: 0, isOwed: true },
];

export default function GroupsScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' or 'friends'

  const filteredGroups = mockGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFriends = mockFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

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
      flexDirection: 'row',
      alignItems: 'center',
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
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontFamily: 'Inter-Medium',
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
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    addButtonText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.primary,
      marginLeft: 8,
    },
    groupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
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
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    groupDetails: {
      flex: 1,
    },
    groupName: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,
    },
    groupMembers: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.secondaryText,
    },
    groupBalance: {
      alignItems: 'flex-end',
    },
    groupBalanceAmount: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.text,
    },
    groupBalanceLabel: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.secondaryText,
    },
    friendItem: {
      flexDirection: 'row',
      alignItems: 'center',
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
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    friendDetails: {
      flex: 1,
    },
    friendName: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,
    },
    friendBalance: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
    },
    positiveBalance: {
      color: colors.primary,
    },
    negativeBalance: {
      color: colors.error,
    },
    settledBalance: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.secondaryText,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    emptyStateText: {
      fontFamily: 'Inter-Regular',
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
              activeTab === 'groups' ? 'groups' : 'friends'
            }...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Users
            size={18}
            color={
              activeTab === 'groups' ? colors.primary : colors.secondaryText
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'groups' && styles.activeTabText,
            ]}
          >
            Groups
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <User
            size={18}
            color={
              activeTab === 'friends' ? colors.primary : colors.secondaryText
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'friends' && styles.activeTabText,
            ]}
          >
            Friends
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'groups' ? (
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/groups/create')}
            >
              <Plus size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Create a new group</Text>
            </TouchableOpacity>

            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={styles.groupItem}
                  onPress={() => router.push(`/groups/${group.id}`)}
                >
                  <View style={styles.groupIcon}>
                    <Users size={24} color={colors.text} />
                  </View>
                  <View style={styles.groupDetails}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupMembers}>
                      {group.members} members
                    </Text>
                  </View>
                  <View style={styles.groupBalance}>
                    <Text style={styles.groupBalanceAmount}>
                      {formatCurrency(group.totalBalance)}
                    </Text>
                    <Text style={styles.groupBalanceLabel}>total</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No groups found</Text>
              </View>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/groups/add-friend')}
            >
              <Plus size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add a new friend</Text>
            </TouchableOpacity>

            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={styles.friendItem}
                  onPress={() => router.push(`/groups/friends/${friend.id}`)}
                >
                  <View style={styles.friendIcon}>
                    <User size={24} color={colors.text} />
                  </View>
                  <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    {friend.balance > 0 ? (
                      <Text
                        style={[
                          styles.friendBalance,
                          friend.isOwed
                            ? styles.positiveBalance
                            : styles.negativeBalance,
                        ]}
                      >
                        {friend.isOwed
                          ? `owes you ${formatCurrency(friend.balance)}`
                          : `you owe ${formatCurrency(friend.balance)}`}
                      </Text>
                    ) : (
                      <Text style={styles.settledBalance}>all settled up</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No friends found</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
