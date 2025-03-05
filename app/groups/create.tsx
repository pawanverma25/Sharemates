import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Users, X } from 'lucide-react-native';

// Mock data for friends
const mockFriends = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
  { id: 4, name: 'Sarah Williams' },
  { id: 5, name: 'David Brown' },
];

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [showFriendSelector, setShowFriendSelector] = useState(false);

  const handleSave = () => {
    // Basic validation
    if (!groupName) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    
    if (selectedFriends.length === 0) {
      Alert.alert('Error', 'Please select at least one friend');
      return;
    }
    
    // In a real app, you would call your API here
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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
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
              <Users size={20} color="#666" />
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
                    <X size={20} color="#666" />
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
                <X size={24} color="#333" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#00A86B',
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  formSection: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    padding: 12,
  },
  selectorButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  selectedFriendsSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  selectedFriendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedFriendName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#fff',
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
    color: '#333',
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
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  selectedIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00A86B',
  },
  modalButton: {
    backgroundColor: '#00A86B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
  },
});