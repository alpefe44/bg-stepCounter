import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import CalorieCalculatorScreen from './screens/CalorieCalculatorScreen';
import { AntDesign , FontAwesome5} from '@expo/vector-icons';
import { startStepTracking } from './services/StepCounterService';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();



export default function App() {

  useEffect(() => {
    startStepTracking();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#6c63ff" style="auto" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              height: 60,
              paddingBottom: 5,
              paddingTop: 5,
            },
            tabBarItemStyle: {
              justifyContent: 'center',
              alignItems: 'center',
            },
            tabBarActiveTintColor: '#6c63ff',
            tabBarInactiveTintColor: '#999',
          }}
        >
          <Tab.Screen
            name="Fitness"
            component={HomeScreen}
            options={{
              headerShown: false,
              tabBarLabel: () => null,
              tabBarIcon: ({ color, size }) => (
                <View style={styles.tabIconContainer}>
                  <FontAwesome5 name="walking" size={28} color={color} />
                </View>
              )
            }}
          />
          <Tab.Screen
            name="Kalori Hesapla"
            component={CalorieCalculatorScreen}
            options={{
              headerShown: false,
              tabBarLabel: () => null,
              tabBarIcon: ({ color, size }) => (
                <View style={styles.tabIconContainer}>
                  <AntDesign name="calculator" size={28} color={color} />
                </View>
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});