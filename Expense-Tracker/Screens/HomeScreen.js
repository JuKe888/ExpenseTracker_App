import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Alert, TextInput, Modal, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Ionicons set

const HomeScreen = ({ navigation, route }) => {
  const [total, setTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const filtered = expenses.filter(expense =>
      expense.description.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem('expenses');
        const parsedExpenses = storedExpenses ? JSON.parse(storedExpenses) : [];
        setExpenses(parsedExpenses);
        setFilteredExpenses(parsedExpenses);
        const totalAmount = parsedExpenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
        setTotal(totalAmount);
      } catch (e) {
        console.error(e);
      }
    };
    loadExpenses();
  }, []);

  useEffect(() => {
    if (route.params?.expense) {
      const newExpense = route.params.expense;
      const isEdit = route.params.isEdit;
      
      let updatedExpenses;
  
      if (isEdit) {
        // Update existing expense
        updatedExpenses = expenses.map(exp => 
          exp.date + exp.amount === newExpense.date + newExpense.amount
            ? newExpense
            : exp
        );
      } else {
        // Add new expense
        updatedExpenses = [...expenses, newExpense];
      }
  
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
  
      const totalAmount = updatedExpenses.reduce((acc, exp) => acc + parseFloat(exp.amount), 0);
      setTotal(totalAmount);
  
      AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      navigation.setParams({ expense: undefined, isEdit: undefined });
    }
  }, [route.params?.expense]);
  
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const handleDeleteExpense = (expense) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const updatedExpenses = expenses.filter(e => e.date + e.amount !== expense.date + expense.amount);
            setExpenses(updatedExpenses);
            setFilteredExpenses(updatedExpenses);
            const totalAmount = updatedExpenses.reduce((acc, exp) => acc + parseFloat(exp.amount), 0);
            setTotal(totalAmount);
            AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
          }
        },
      ],
      { cancelable: false }
    );
  };

  const handleModifyExpense = (expense) => {
    navigation.navigate('AddExpense', { expense });
  };

  const renderExpenseItem = ({ item }) => (
    <View style={[styles.expenseCard, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <View style={styles.expenseInfo}>
        <View>
          <Text style={[styles.expenseDescription, { color: isDarkMode ? '#ccc' : '#000' }]}>
            {item.description}
          </Text>
          <Text style={[styles.expenseDate, { color: isDarkMode ? '#aaa' : '#666' }]}>
            {moment(item.date).format('YYYY-MM-DD')}
          </Text>
        </View>
        <Text style={[styles.expenseAmount, { color: isDarkMode ? '#fff' : '#000' }]}>
          {formatAmount(item.amount)}
        </Text>
      </View>
      <View style={styles.expenseActions}>
        <TouchableOpacity onPress={() => handleModifyExpense(item)}>
          <Icon name="pencil-outline" size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteExpense(item)}>
          <Icon name="trash-outline" size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={[styles.profileIcon, { backgroundColor: isDarkMode ? '#444' : '#ddd' }]}>
            <Text style={[styles.profileInitials, { color: isDarkMode ? '#fff' : '#000' }]}>AS</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={[styles.greetingText, { color: isDarkMode ? '#fff' : '#000' }]}>Hello,</Text>
            <Text style={[styles.profileName, { color: isDarkMode ? '#fff' : '#000' }]}>Asmah Moses Junior</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={() => Alert.alert('Notifications')}>
          <Icon name="notifications-outline" size={35} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
      <View style={styles.totalContainer}>
        <Text style={[styles.totalText, { color: isDarkMode ? '#fff' : '#000' }]}>Total Balance</Text>
        <Text style={[styles.totalAmount, { color: isDarkMode ? '#fff' : '#000' }]}>
          {formatAmount(total)}
        </Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchBar, { backgroundColor: isDarkMode ? '#555' : '#eee', color: isDarkMode ? '#fff' : '#000' }]}
          placeholder="Search by description..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <TouchableOpacity
        style={styles.addExpenseButton}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Text style={styles.addExpenseButtonText}>Add Expense</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        {filteredExpenses.length === 0 ? (
          <Text style={[styles.noExpensesText, { color: isDarkMode ? '#bbb' : '#000' }]}>No registered expenses found!</Text>
        ) : (
          <FlatList
            data={filteredExpenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.date + item.amount}
            contentContainerStyle={styles.expensesContainer}
          />
        )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="home-outline" size={24} color={isDarkMode ? '#FFC107' : '#FFC107'} />
          <Text style={[styles.footerText, { color: isDarkMode ? '#FFC107' : '#FFC107' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('RecentExpenses')}>
          <Icon name="time-outline" size={24} color={isDarkMode ? '#FFC107' : '#FFC107'} />
          <Text style={[styles.footerText, { color: isDarkMode ? '#FFC107' : '#FFC107' }]}>Recent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => setIsSettingsModalVisible(true)}>
          <Icon name="settings-outline" size={24} color={isDarkMode ? '#FFC107' : '#FFC107'} />
          <Text style={[styles.footerText, { color: isDarkMode ? '#FFC107' : '#FFC107' }]}>Settings</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isSettingsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSettingsModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)' }]}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Settings</Text>
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: isDarkMode ? '#fff' : '#000' }]}>Dark Mode</Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
              />
            </View>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsSettingsModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8A2BE2',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileInitials: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileDetails: {
    marginRight: 20,
  },
  greetingText: {
    fontSize: 19,
    fontFamily: 'times new roman' 
  },
  profileName: {
    fontSize: 23,
    color: '#888',
    fontWeight: 'bold',
    fontFamily: 'times new roman'
  },
  notificationButton: {
    padding: 10,
  },
  totalContainer: {
    padding: 15,
  },
  totalText: {
    fontSize: 18,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  searchContainer: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchBar: {
    padding: 10,
    borderRadius: 5,
  },
  addExpenseButton: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    margin: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addExpenseButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  noExpensesText: {
    textAlign: 'center',
    marginTop: 20,
  },
  expensesContainer: {
    paddingHorizontal: 15,
  },
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  expenseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseDate: {
    fontSize: 14,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#8A2BE2',
    height: 100,
    top: 50
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#7B1FA2',
    padding: 10,
    borderRadius: 5,
  },
  modalCloseText: {
    color: '#fff',
  },
});

export default HomeScreen;
