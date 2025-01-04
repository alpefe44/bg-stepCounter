import React, { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as BackgroundFetch from 'expo-background-fetch';
import { Alert, AppState, Platform, Dimensions } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerBackgroundTask, updateSteps } from '../services/StepCounterService';
import EventEmitter from '../utils/EventEmitter';
import WeightLossTip from '../components/WeightLossTip';


export default function HomeScreen({ navigation }) {

  const appState = useRef(AppState.currentState);

  // Adım ve kalori state'leri
  const [calories, setCalories] = useState(0);
  const [calorieResult, setCalorieResult] = useState(null);
  const [steps, setSteps] = useState(0);

  // Kronometre state'leri
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Ağırlık takibi state'leri
  const [weight, setWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);

  useEffect(() => {
    loadWeightHistory();
    loadCalorieResult()
    getStepsForToday();
  }, []);

  // Adımları kontrol et ve gerekirse sıfırla
  const getStepsForToday = async () => {

    try {
      const currentDate = new Date();
      const currentDay = currentDate.toISOString().split('T')[0];

      const storedData = await AsyncStorage.getItem('stepData');
      console.log('storedData', storedData);
      if (!storedData) return 0;

      const parsedData = JSON.parse(storedData);
      const storedDay = parsedData.date ? parsedData.date.split('T')[0] : null;

      // Eğer kayıtlı gün bugüne eşitse, adımları döndür
      if (storedDay === currentDay) {
        setSteps(parsedData.steps);
        return parsedData.steps || 0;
      }

      // Gün farklıysa 0 döndür
      return 0;
    } catch (error) {
      console.error('Adım sayısını alırken hata:', error);
      return 0;
    }
  };


  // useEffect(() => {
  //   let subscription;

  //   const fetchSteps = async () => {
  //     const isAvailable = await Pedometer.isAvailableAsync();
  //     console.log('isAvailable', isAvailable);
  //     if (!isAvailable) {
  //       console.log('Pedometer kullanılamıyor.');
  //       return;
  //     }

  //     subscription = Pedometer.watchStepCount(async result => {
  //       console.log(result.steps)
  //       await updateSteps(result.steps);
  //     });
  //   };
  //   fetchSteps();
  //   return () => subscription.remove();
  // }, []);


  // AppState değişikliklerini dinle
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        await checkAndUpdateSteps();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Tab focus değişikliklerini dinle
  useFocusEffect(
    React.useCallback(() => {
      getStepsForToday();

      const subscription = EventEmitter.addListener('STEPS_UPDATED', async (newSteps) => {
        console.log('STEPS_UPDATED eventi alındı', newSteps);
        // Yeni adımları tarihle birlikte kaydet
        const currentDate = new Date();
        await AsyncStorage.setItem('stepData', JSON.stringify({
          steps: newSteps,
          date: currentDate.toISOString()
        }));
        setSteps(newSteps);
        setCalories(Math.floor(newSteps * 0.04));
      });

      return () => subscription.remove();
    }, [])
  );

  // Kalori sonuçlarını yükleme fonksiyonu tab navigator sayfa değiştiğinde unmount olmadığı için  bu şekilde yapıyoruz ya da useEffect ile yapabiliriz navigation.addListener ile yapabiliriz.
  useFocusEffect(
    React.useCallback(() => {
      loadWeightHistory();
      loadCalorieResult();
    }, []) // dependency array
  );


  const loadCalorieResult = async () => {
    try {
      const result = await AsyncStorage.getItem('calorieResult');
      if (result) {
        setCalorieResult(JSON.parse(result));
      }
    } catch (error) {
      console.error('Kalori sonuçları yüklenemedi:', error);
    }
  };

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  // useEffect(() => {
  //   let subscription;

  //   const requestPermissions = async () => {

  //     if (Platform.OS === 'android') {

  //       const { status } = await Pedometer.requestPermissionsAsync();

  //       if (status !== 'granted') {

  //         Alert.alert(

  //           'İzin Gerekli',

  //           'Adım sayacının çalışması için fiziksel aktivite izni gereklidir.',

  //           [{ text: 'Tamam' }]

  //         );

  //         setIsPedometerAvailable('false');

  //         return false;

  //       }

  //     }

  //     return true;

  //   };

  //   const subscribe = async () => {
  //     try {
  //       const hasPermission = await requestPermissions();

  //       if (!hasPermission) return;

  //       const isAvailable = await Pedometer.isAvailableAsync();
  //       console.log('isAvailable', isAvailable);
  //       setIsPedometerAvailable(String(isAvailable));

  //       if (isAvailable) {
  //         subscription = Pedometer.watchStepCount(result => {
  //           console.log('result', result);
  //           setSteps(result.steps);
  //           AsyncStorage.setItem('dailySteps', result.steps.toString());
  //           setCalories(Math.floor(result.steps * 0.04));
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Pedometer error:', error);
  //       setIsPedometerAvailable('false');
  //     }
  //   };

  //   subscribe();

  //   return () => {
  //     if (subscription) {
  //       subscription.remove();
  //     }
  //   };
  // }, []);

  // Kronometre fonksiyonları
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Ağırlık takibi fonksiyonları
  const loadWeightHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('weightHistory');
      if (history) {
        setWeightHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Ağırlık geçmişi yüklenemedi:', error);
    }
  };

  const saveWeight = async () => {
    if (weight) {
      const newEntry = {
        weight: parseFloat(weight),
        date: new Date().toLocaleDateString('tr-TR'),
      };

      const updatedHistory = [newEntry, ...weightHistory];
      try {
        await AsyncStorage.setItem('weightHistory', JSON.stringify(updatedHistory));
        setWeightHistory(updatedHistory);
        setWeight('');
      } catch (error) {
        console.error('Ağırlık kaydedilemedi:', error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      {/* Adım ve Kalori Kartları */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Günlük Adımlar</Text>
          {isPedometerAvailable === 'false' ? (
            <Text style={styles.errorText}>Adım sayar kullanılamıyor</Text>
          ) : (
            <CircularProgress
              value={steps}
              maxValue={10000}
              radius={60}
              progressValueColor={'#6c63ff'}
              activeStrokeColor={'#6c63ff'}
              inActiveStrokeColor={'#ddd'}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kalori</Text>
          <CircularProgress
            value={calories}
            maxValue={500}
            radius={60}
            progressValueColor={'#ff6b6b'}
            activeStrokeColor={'#ff6b6b'}
            inActiveStrokeColor={'#ddd'}
          />
        </View>
      </View>

      {/* Kronometre Kartı */}
      <View style={[styles.card, styles.fullCard]}>
        <Text style={styles.cardTitle}>Kronometre</Text>
        <Text style={styles.timerText}>{formatTime(time)}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isRunning ? '#ff6b6b' : '#6c63ff' }]}
            onPress={isRunning ? stopTimer : startTimer}
          >
            <Text style={styles.buttonText}>
              {isRunning ? 'Durdur' : 'Başlat'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#4a4a4a' }]}
            onPress={resetTimer}
          >
            <Text style={styles.buttonText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ağırlık Takibi Kartı */}
      <View style={[styles.card, styles.fullCard]}>
        <Text style={styles.cardTitle}>Ağırlık Takibi</Text>
        <View style={styles.weightInputContainer}>
          <TextInput
            style={styles.weightInput}
            value={weight}
            onChangeText={setWeight}
            placeholder="Kilonuzu girin (kg)"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.weightButton} onPress={saveWeight}>
            <Text style={styles.buttonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weightHistory}>
          {weightHistory.slice(0, 3).map((entry, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.weightText}>{entry.weight} kg</Text>
              <Text style={styles.dateText}>{entry.date}</Text>
            </View>
          ))}
        </View>
      </View>

      {calorieResult && (
        <View style={[styles.card, styles.fullCard]}>
          <Text style={styles.cardTitle}>Günlük Kalori İhtiyacı</Text>
          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Kilo Koruma:</Text>
            <Text style={styles.calorieValue}>{calorieResult.maintenance} kcal</Text>
          </View>
          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Kilo Verme:</Text>
            <Text style={styles.calorieValue}>{calorieResult.weightLoss} kcal</Text>
          </View>
          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Kilo Alma:</Text>
            <Text style={styles.calorieValue}>{calorieResult.weightGain} kcal</Text>
          </View>
        </View>
      )}
        <WeightLossTip />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullCard: {
    width: '100%',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weightInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    width: '100%',
  },
  weightInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  weightButton: {
    backgroundColor: '#6c63ff',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  weightHistory: {
    width: '100%',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weightText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  calorieItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#333',
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c63ff',
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});