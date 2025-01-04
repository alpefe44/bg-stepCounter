import React, { use, useEffect, useState } from 'react';
import mobileAds, { AdEventType, BannerAd, BannerAdSize, InterstitialAd, TestIds } from 'react-native-google-mobile-ads'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import CalorieCalculatorScreen from './screens/CalorieCalculatorScreen';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { startStepTracking } from './services/StepCounterService';
import { Platform, SafeAreaView } from 'react-native';
import { View, StyleSheet, StatusBar } from 'react-native';

// const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
//   keywords: ['fashion', 'clothing'],
// });

const Tab = createBottomTabNavigator();

export default function App() {
  // const [loaded, setLoaded] = useState(false);

  // console.log(loaded);

  // useEffect(() => {

  //   if (Platform.OS === 'ios') {
  //     StatusBar.setHidden(true);
  //   } else {
  //     StatusBar.setHidden(false);
  //   }
  //   const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
  //     setLoaded(true);
  //     console.log(loaded);
  //   });

  //   const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
  //     console.log(loaded);
  //   });

  //   const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  //     console.log(loaded);
  //   });

  //   // Start loading the interstitial straight away
  //   interstitial.load();

  //   // Unsubscribe from events on unmount
  //   return () => {
  //     unsubscribeLoaded();
  //     unsubscribeOpened();
  //     unsubscribeClosed();
  //   };
  // }, []);

  useEffect(() => {
    startStepTracking();
  }, []);

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log(adapterStatuses);
      });
  }, []);

  // if (loaded) {
  //   interstitial.show();
  // }

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
        <BannerAd
          unitId="ca-app-pub-3940256099942544/6300978111"
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }} />
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