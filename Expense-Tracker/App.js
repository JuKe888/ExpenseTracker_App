import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import AddExpenseScreen from './Screens/AddExpenseScreen';
import RecentExpensesScreen from './Screens/RecentExpensesScreen';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(true); // Set user to true for demonstration purposes

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate 1 second of loading

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
        <Stack.Screen name="RecentExpenses" component={RecentExpensesScreen} options={{ title: 'Recent Expenses' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
