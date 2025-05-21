import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Users, X } from 'lucide-react-native';
import { useTheme } from "@/context/ThemeContext";

// Mock data for friends
const mockFriends = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
  { id: 4, name: 'Sarah Williams' },
  { id: 5, name: 'David Brown' },
];

export default function CreateGroupScreen() {
  const { colors } = useTheme();
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [showFriendSelector, setShowFriendSelector] = useState(false);

  const handleSave = () => {
    if (!groupName) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    
    if (selectedFriends.length === 0) {
      Alert.alert('Error', 'Please select at least one friend');
      return;
    }
    
    Alert.alert(
      'Success',
      'Group created successfully',
      [
        { 
          text: 'OK', 
          onPress: () => router.back()
        }
      ]
    );
  };

  const toggleFriendSelection = (friendId: number) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const getSelectedFriendsText = () => {
    if (selectedFriends.length === 0) {
      return 'Select friends';
    } else {
      return `${selectedFriends.length} friends selected`;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
      fontFamily: 'Inter-SemiBold',
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
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    formSection: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.secondaryText,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.text,
    },
    selectorButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
    },
    selectorButtonText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
      flex: 1,
    },
    selectedFriendsSection: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    selectedFriendItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectedFriendName: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.text,
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 12,
      width: '80%',
      maxHeight: '70%',
      padding: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      color: colors.text,
    },
    modalList: {
      maxHeight: 300,
    },
    modalItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalItemText: {
      fontFamily: 'Inter-Regular',
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
      alignItems: 'center',
      marginTop: 16,
    },
    modalButtonText: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.background,
    },
  });

  return (
    <KeyboardAvoidingView 
      behavior='padding'
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Group</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Group Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a name for your group"
              placeholderTextColor={colors.secondaryText}
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Members</Text>
            <TouchableOpacity 
              style={styles.selectorButton}
              onPress={() => setShowFriendSelector(true)}
            >
              <Users size={20} color={colors.secondaryText} />
              <Text style={styles.selectorButtonText}>{getSelectedFriendsText()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedFriends.length > 0 && (
          <View style={styles.selectedFriendsSection}>
            <Text style={styles.sectionTitle}>Selected Friends</Text>
            
            {selectedFriends.map(friendId => {
              const friend = mockFriends.find(f => f.id === friendId);
              if (!friend) return null;
              
              return (
                <View key={friend.id} style={styles.selectedFriendItem}>
                  <Text style={styles.selectedFriendName}>{friend.name}</Text>
                  <TouchableOpacity
                    onPress={() => toggleFriendSelection(friend.id)}
                  >
                    <X size={20} color={colors.secondaryText} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {showFriendSelector && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Friends</Text>
              <TouchableOpacity 
                onPress={() => setShowFriendSelector(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalList}>
              {mockFriends.map(friend => (
                <TouchableOpacity 
                  key={friend.id}
                  style={styles.modalItem}
                  onPress={() => toggleFriendSelection(friend.id)}
                >
                  <Text style={styles.modalItemText}>{friend.name}</Text>
                  {selectedFriends.includes(friend.id) && (
                    <View style={styles.selectedIndicator} />
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
    </KeyboardAvoidingView>
  );
}