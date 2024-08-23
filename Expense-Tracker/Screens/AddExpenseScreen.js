import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ImageBackground, Platform, Keyboard, KeyboardAvoidingView, TextInput } from 'react-native';

const AddExpenseScreen = ({ route, navigation }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // Manage dark mode state

  // Get existing expense if passed through navigation parameters
  const { expense } = route.params || {};

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setDate(expense.date);
      setDescription(expense.description);
    }
  }, [expense]);

  const handleAmountChange = (text) => {
    setAmount(text.replace(/[^0-9.]/g, ''));
  };

  const handleDateChange = (text) => {
    const formattedDate = text.replace(/[^0-9-]/g, '').slice(0, 10);
    setDate(formattedDate);
  };

  const handleCancel = () => {
    setAmount('');
    setDate('');
    setDescription('');
    Keyboard.dismiss(); // Dismiss the keyboard when canceling
  };

  const handleAddExpense = () => {
    if (amount && date && description) {
      const expenseData = {
        amount: parseFloat(amount),
        date,
        description
      };
      // Pass expense data and edit flag back to HomeScreen
      navigation.navigate('Home', { expense: expenseData, isEdit: !!expense });
    } else {
      alert('Please fill in all fields');
    }
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ImageBackground source={require('../assets/backgroundImage.jpg')} style={styles.backgroundImage}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.avoidingView}
        >
          <View style={styles.content}>
            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>
              {expense ? 'Edit Expense' : 'Add Expense'}
            </Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#E0E0E0', color: isDarkMode ? '#fff' : '#000' }]}
                placeholder="Amount"
                placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
              />
              <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#E0E0E0', color: isDarkMode ? '#fff' : '#000' }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
                value={date}
                onChangeText={handleDateChange}
                maxLength={10}
              />
            </View>
            <TextInput
              style={[styles.textArea, { backgroundColor: isDarkMode ? '#333' : '#E0E0E0', color: isDarkMode ? '#fff' : '#000' }]}
              placeholder="Description"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              multiline={true}
              value={description}
              onChangeText={setDescription}
            />
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={[styles.cancelButton, { backgroundColor: isDarkMode ? '#c00' : 'red' }]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.addButton, { backgroundColor: isDarkMode ? '#00f' : '#1447d2' }]} onPress={handleAddExpense}>
                <Text style={styles.buttonText}>{expense ? 'Save Changes' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  avoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
    fontSize: 16,
  },
  textArea: {
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 100,
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  addButton: {
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AddExpenseScreen;
