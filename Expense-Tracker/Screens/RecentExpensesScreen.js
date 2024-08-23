import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const RecentExpensesScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem('expenses');
        if (storedExpenses !== null) {
          setExpenses(JSON.parse(storedExpenses));
        }
      } catch (error) {
        console.error('Failed to load expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  const handleClearExpense = async (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
    await AsyncStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
       
        <View style={styles.content}>
          {expenses.length === 0 ? (
            <Text style={styles.noExpensesText}>No recent expenses found!</Text>
          ) : (
            expenses.map((expense, index) => (
              <View key={index} style={styles.expenseContainer}>
                <View style={styles.expenseDetails}>
                  <Text style={styles.expenseText}>{expense.description}</Text>
                  <Text style={styles.expenseText}>${expense.amount.toFixed(2)}</Text>
                  <Text style={styles.expenseText}>{expense.date}</Text>
                </View>
                <TouchableOpacity style={styles.clearButton} onPress={() => handleClearExpense(index)}>
                  <Icon name="trash-outline" size={24} color="#FF0000" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#6A0DAD',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  noExpensesText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  expenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseText: {
    fontSize: 16,
    color: '#000000',
  },
  clearButton: {
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#6A0DAD',
    paddingVertical: 20,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    color: '#FFC107',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default RecentExpensesScreen;
