// import { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from 'react-native';
// import { router } from 'expo-router';
// import { ArrowLeft, User, Calendar, DollarSign } from 'lucide-react-native';

// // Mock data for friends
// const mockFriends = [
//   { id: 1, name: 'John Doe', balance: 25.5, isOwed: true },
//   { id: 2, name: 'Jane Smith', balance: 12.75, isOwed: false },
//   { id: 3, name: 'Mike Johnson', balance: 8.3, isOwed: true },
//   { id: 4, name: 'Sarah Williams', balance: 15.4, isOwed: false },
// ];

// export default function SettleUpScreen() {
//   const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
//   const [amount, setAmount] = useState('');
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
//   const [note, setNote] = useState('');

//   const handleSave = () => {
//     // Basic validation
//     if (selectedFriend === null) {
//       Alert.alert('Error', 'Please select a friend');
//       return;
//     }

//     if (!amount) {
//       Alert.alert('Error', 'Please enter an amount');
//       return;
//     }

//     // In a real app, you would call your API here
//     Alert.alert('Success', 'Payment recorded successfully', [
//       {
//         text: 'OK',
//         onPress: () => router.back(),
//       },
//     ]);
//   };

//   const formatCurrency = (value: string) => {
//     // Remove non-numeric characters
//     const numericValue = value.replace(/[^0-9.]/g, '');

//     // Ensure only one decimal point
//     const parts = numericValue.split('.');
//     if (parts.length > 2) {
//       return parts[0] + '.' + parts.slice(1).join('');
//     }

//     return numericValue;
//   };

//   const getSelectedFriendName = () => {
//     const friend = mockFriends.find((f) => f.id === selectedFriend);
//     return friend ? friend.name : 'Select a friend';
//   };

//   const getSelectedFriendBalance = () => {
//     const friend = mockFriends.find((f) => f.id === selectedFriend);
//     if (!friend) return null;

//     return {
//       amount: friend.balance,
//       isOwed: friend.isOwed,
//     };
//   };

//   const friendBalance = getSelectedFriendBalance();

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <ArrowLeft size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Settle Up</Text>
//         <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//           <Text style={styles.saveButtonText}>Save</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content}>
//         <View style={styles.formSection}>
//           <Text style={styles.sectionTitle}>Payment Details</Text>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Friend</Text>
//             <TouchableOpacity style={styles.friendSelector} onPress={() => {}}>
//               <User size={20} color="#666" />
//               <Text style={styles.friendSelectorText}>
//                 {getSelectedFriendName()}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {selectedFriend !== null && friendBalance && (
//             <View style={styles.balanceContainer}>
//               <Text style={styles.balanceLabel}>
//                 {friendBalance.isOwed
//                   ? `${getSelectedFriendName()} owes you`
//                   : `You owe ${getSelectedFriendName()}`}
//               </Text>
//               <Text
//                 style={[
//                   styles.balanceAmount,
//                   friendBalance.isOwed
//                     ? styles.positiveBalance
//                     : styles.negativeBalance,
//                 ]}
//               >
//                 ${friendBalance.amount.toFixed(2)}
//               </Text>
//             </View>
//           )}

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Amount</Text>
//             <View style={styles.amountInputContainer}>
//               <Text style={styles.currencySymbol}>$</Text>
//               <TextInput
//                 style={styles.amountInput}
//                 placeholder="0.00"
//                 keyboardType="decimal-pad"
//                 value={amount}
//                 onChangeText={(value) => setAmount(formatCurrency(value))}
//               />
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Date</Text>
//             <TouchableOpacity style={styles.dateSelector}>
//               <Calendar size={20} color="#666" />
//               <Text style={styles.dateSelectorText}>{date}</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Note (optional)</Text>
//             <TextInput
//               style={styles.noteInput}
//               placeholder="Add a note about this payment"
//               value={note}
//               onChangeText={setNote}
//               multiline
//             />
//           </View>
//         </View>

//         <View style={styles.friendsSection}>
//           <Text style={styles.sectionTitle}>Select a Friend</Text>

//           {mockFriends.map((friend) => (
//             <TouchableOpacity
//               key={friend.id}
//               style={[
//                 styles.friendItem,
//                 selectedFriend === friend.id && styles.selectedFriendItem,
//               ]}
//               onPress={() => setSelectedFriend(friend.id)}
//             >
//               <View style={styles.friendIcon}>
//                 <User size={24} color="#fff" />
//               </View>
//               <View style={styles.friendDetails}>
//                 <Text style={styles.friendName}>{friend.name}</Text>
//                 <Text
//                   style={[
//                     styles.friendBalance,
//                     friend.isOwed
//                       ? styles.positiveBalance
//                       : styles.negativeBalance,
//                   ]}
//                 >
//                   {friend.isOwed
//                     ? `owes you $${friend.balance.toFixed(2)}`
//                     : `you owe $${friend.balance.toFixed(2)}`}
//                 </Text>
//               </View>
//               {selectedFriend === friend.id && (
//                 <View style={styles.selectedIndicator} />
//               )}
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7F7F7',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     paddingTop: 50,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E1E1E1',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 18,
//     color: '#333',
//   },
//   saveButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 16,
//     backgroundColor: '#00A86B',
//   },
//   saveButtonText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 14,
//     color: '#fff',
//   },
//   content: {
//     flex: 1,
//   },
//   formSection: {
//     backgroundColor: '#fff',
//     marginBottom: 16,
//     padding: 16,
//   },
//   sectionTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 16,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   friendSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E1E1E1',
//     borderRadius: 8,
//     padding: 12,
//   },
//   friendSelectorText: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 16,
//     color: '#333',
//     marginLeft: 8,
//   },
//   balanceContainer: {
//     backgroundColor: '#F0F9F6',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   balanceLabel: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   balanceAmount: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 18,
//   },
//   positiveBalance: {
//     color: '#00A86B',
//   },
//   negativeBalance: {
//     color: '#FF3B30',
//   },
//   amountInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E1E1E1',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//   },
//   currencySymbol: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 16,
//     color: '#333',
//     marginRight: 4,
//   },
//   amountInput: {
//     flex: 1,
//     padding: 12,
//     fontFamily: 'Inter-Regular',
//     fontSize: 16,
//   },
//   dateSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E1E1E1',
//     borderRadius: 8,
//     padding: 12,
//   },
//   dateSelectorText: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 16,
//     color: '#333',
//     marginLeft: 8,
//   },
//   noteInput: {
//     borderWidth: 1,
//     borderColor: '#E1E1E1',
//     borderRadius: 8,
//     padding: 12,
//     fontFamily: 'Inter-Regular',
//     fontSize: 16,
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },
//   friendsSection: {
//     backgroundColor: '#fff',
//     padding: 16,
//     marginBottom: 16,
//   },
//   friendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   selectedFriendItem: {
//     backgroundColor: '#F0F9F6',
//     borderRadius: 8,
//     paddingHorizontal: 8,
//   },
//   friendIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#5B7FFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   friendDetails: {
//     flex: 1,
//   },
//   friendName: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 4,
//   },
//   friendBalance: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//   },
//   selectedIndicator: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: '#00A86B',
//   },
// });
