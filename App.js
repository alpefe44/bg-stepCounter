import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import CalorieCalculatorScreen from './screens/CalorieCalculatorScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Fitness" 
          component={HomeScreen}
          options={{
            headerStyle: { backgroundColor: '#6c63ff' },
            headerTintColor: '#fff'
          }}
        />
        <Tab.Screen 
          name="Kalori Hesapla" 
          component={CalorieCalculatorScreen}
          options={{
            headerStyle: { backgroundColor: '#6c63ff' },
            headerTintColor: '#fff'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}