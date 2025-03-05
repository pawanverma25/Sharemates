import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search, User, UserPlus } from 'lucide-react-native';

export default function AddFriendScreen() {
  const [email, setEmail] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: number; name: string; email: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    
    setIsSearching(true);
    
    // In a real app, you would call your API here
    // For now, we'll simulate a search result
    setTimeout(() => {
      if (email.includes('@')) {
        setSearchResults([
          { id: 99, name: 'Alex Johnson', email: email }
        ]);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleAddFriend = (userId: number) => {
    // In a real app, you would call your API here
    Alert.alert(
      'Success',
      'Friend request sent successfully',
      [
        { 
          text: 'OK', 
          onPress: () => router.back()
        }
      ]
    );
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
        <Text style={styles.headerTitle}>Add Friend</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Find a Friend</Text>
          <Text style={styles.sectionDescription}>
            Enter your friend's email address to send them a friend request.
          </Text>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={isSearching}
            >
              <Search size={20} color="#fff" />
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
            <Text style={styles.resultsTitle}>Search Results</Text>
            
            {searchResults.map(user => (
              <View key={user.id} style={styles.userItem}>
                <View style={styles.userIcon}>
                  <User size={24} color="#fff" />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => handleAddFriend(user.id)}
                >
                  <UserPlus size={20} color="#00A86B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {!isSearching && email && searchResults.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No users found with that email address.</Text>
            <TouchableOpacity 
              style={styles.inviteButton}
              onPress={() => {
                Alert.alert(
                  'Invite Sent',
                  `An invitation has been sent to ${email}`,
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={styles.inviteButtonText}>Send Invitation</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  searchSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#00A86B',
    borderRadius: 8,
    padding: 12,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  resultsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  resultsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5B7FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    padding: 8,
  },
  noResultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  inviteButton: {
    backgroundColor: '#F0F9F6',
    borderRadius: 8,
    padding: 12,
  },
  inviteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#00A86B',
  },
});