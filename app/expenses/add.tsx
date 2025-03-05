import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Users, Calendar, Receipt, DollarSign, Percent, X } from 'lucide-react-native';

// Mock data for friends and groups
const mockFriends = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
  { id: 4, name: 'Sarah Williams' },
];

const mockGroups = [
  { id: 1, name: 'Roommates', members: mockFriends.slice(0, 3) },
  { id: 2, name: 'Trip to Paris', members: mockFriends.slice(1, 4) },
  { id: 3, name: 'Office Lunch', members: mockFriends.slice(0, 2) },
];

export default function AddExpenseScreen() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [splitType, setSplitType] = useState('equal'); // 'equal', 'percentage', 'amount'
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [showFriendSelector, setShowFriendSelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    // Basic validation
    if (!description || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (selectedGroup === null && selectedFriends.length === 0) {
      Alert.alert('Error', 'Please select a group or at least one friend');
      return;
    }
    
    // In a real app, you would call your API here
    Alert.alert(
      'Success',
      'Expense added successfully',
      [
        { 
          text: 'OK', 
          onPress: () => router.back()
        }
      ]
    );
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    return numericValue;
  };

  const toggleFriendSelection = (friendId: number) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const selectGroup = (groupId: number) => {
    setSelectedGroup(groupId);
    // When a group is selected, automatically select all its members
    const group = mockGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedFriends(group.members.map(member => member.id));
    }
    setShowGroupSelector(false);
  };

  const getSelectedGroupName = () => {
    const group = mockGroups.find(g => g.id === selectedGroup);
    return group ? group.name : 'Select a group';
  };

  const getSelectedFriendsText = () => {
    if (selectedFriends.length === 0) {
      return 'Select friends';
    } else if (selectedFriends.length === 1) {
      const friend = mockFriends.find(f => f.id === selectedFriends[0]);
      return friend ? friend.name : '';
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
        <Text style={styles.headerTitle}>Add Expense</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="What was this expense for?"
              value={description}
              onChangeText={setDescription}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={(value) => setAmount(formatCurrency(value))}
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity 
              style={styles.selectorButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#666" />
              <Text style={styles.selectorButtonText}>{date}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Split With</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Group</Text>
            <TouchableOpacity 
              style={styles.selectorButton}
              onPress={() => setShowGroupSelector(true)}
            >
              <Users size={20} color="#666" />
              <Text style={styles.selectorButtonText}>{getSelectedGroupName()}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Friends</Text>
            <TouchableOpacity 
              style={styles.selectorButton}
              onPress={() => setShowFriendSelector(true)}
            >
              <Users size={20} color="#666" />
              <Text style={styles.selectorButtonText}>{getSelectedFriendsText()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Split Options</Text>
          
          <View style={styles.splitTypeContainer}>
            <TouchableOpacity 
              style={[styles.splitTypeButton, splitType === 'equal' && styles.activeSplitTypeButton]}
              onPress={() => setSplitType('equal')}
            >
              <DollarSign size={20} color={splitType === 'equal' ? '#fff' : '#666'} />
              <Text style={[styles.splitTypeText, splitType === 'equal' && styles.activeSplitTypeText]}>Equal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.splitTypeButton, splitType === 'percentage' && styles.activeSplitTypeButton]}
              onPress={() => setSplitType('percentage')}
            >
              <Percent size={20} color={splitType === 'percentage' ? '#fff' : '#666'} />
              <Text style={[styles.splitTypeText, splitType === 'percentage' && styles.activeSplitTypeText]}>Percentage</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.splitTypeButton, splitType === 'amount' && styles.activeSplitTypeButton]}
              onPress={() => setSplitType('amount')}
            >
              <DollarSign size={20} color={splitType === 'amount' ? '#fff' : '#666'} />
              <Text style={[styles.splitTypeText, splitType === 'amount' && styles.activeSplitTypeText]}>Amount</Text>
            </TouchableOpacity>
          </View>
          
          {splitType === 'equal' && (
            <Text style={styles.splitDescription}>
              The total amount will be split equally among all selected people.
            </Text>
          )}
          
          {splitType === 'percentage' && (
            <Text style={styles.splitDescription}>
              You can specify what percentage of the total each person should pay.
            </Text>
          )}
          
          {splitType === 'amount' && (
            <Text style={styles.splitDescription}>
              You can specify the exact amount each person should pay.
            </Text>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Options</Text>
          
          <TouchableOpacity style={styles.additionalOption}>
            <Receipt size={20} color="#666" />
            <Text style={styles.additionalOptionText}>Add Receipt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showGroupSelector && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Group</Text>
              <TouchableOpacity 
                onPress={() => setShowGroupSelector(false)}
              >
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalList}>
              {mockGroups.map(group => (
                <TouchableOpacity 
                  key={group.id}
                  style={styles.modalItem}
                  onPress={() => selectGroup(group.id)}
                >
                  <Text style={styles.modalItemText}>{group.name}</Text>
                  {selectedGroup === group.id && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

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
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
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
  splitTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  splitTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    flex: 0.32,
  },
  activeSplitTypeButton: {
    backgroundColor: '#00A86B',
  },
  splitTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  activeSplitTypeText: {
    color: '#fff',
  },
  splitDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    backgroundColor: '#F0F9F6',
    padding: 12,
    borderRadius: 8,
  },
  additionalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  additionalOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
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