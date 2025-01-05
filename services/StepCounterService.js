import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventEmitter from '../utils/EventEmitter'; // EventEmitter'ı eklemeyi unutmayın


const STEP_COUNTER_TASK = 'STEP_COUNTER_TASK';

let lastStepCount = 0; // Son adım sayısını tutacak değişken
console.log('lastStepCount', lastStepCount);

// Adım sayacını başlatan fonksiyon
const startPedometerTracking = async () => {
  try {
    const isAvailable = await Pedometer.isAvailableAsync();
    if (!isAvailable) {
      console.log('Pedometer kullanılamıyor');
      return;
    }

    // Önce mevcut adım verilerini al
    const storedData = await AsyncStorage.getItem('stepData');
    if (storedData) {
      const { steps, lastPedometerSteps } = JSON.parse(storedData);
      lastStepCount = lastPedometerSteps || 0;
      console.log('Son kaydedilen adım sayısı:', lastStepCount);
    }

    const subscription = Pedometer.watchStepCount(async result => {
      const currentSteps = result.steps;

      // İlk okuma ise fark hesaplama
      if (lastStepCount === 0) {
        lastStepCount = currentSteps;
        return;
      }

      // Adım farkını hesapla
      const stepDifference = currentSteps - lastStepCount;
      console.log('Mevcut adımlar:', currentSteps, 'Son adımlar:', lastStepCount, 'Fark:', stepDifference);

      // Mevcut toplam adımları al
      const storedData = await AsyncStorage.getItem('stepData');
      let totalSteps = 0;

      if (storedData) {
        const { steps } = JSON.parse(storedData);
        totalSteps = steps;
      }

      // Yeni toplam adımları hesapla (sadece pozitif fark varsa)
      if (stepDifference > 0) {
        let newTotalSteps = totalSteps + stepDifference;

        // 10000 adımı geçerse sıfırla
        if (newTotalSteps >= 10000) {
          newTotalSteps = 0;
          // Başarı bildirimi gönder
          EventEmitter.emit('STEPS_GOAL_REACHED', newTotalSteps);
        }

        console.log('Yeni adımlar:', stepDifference, 'Toplam:', newTotalSteps);

        // Adımları güncelle
        await AsyncStorage.setItem('stepData', JSON.stringify({
          steps: newTotalSteps,
          lastPedometerSteps: currentSteps,
          date: new Date().toISOString(),
        }));

        EventEmitter.emit('STEPS_UPDATED', newTotalSteps);
      }

      lastStepCount = currentSteps;
    });

    return subscription;
  } catch (error) {
    console.error('Pedometer başlatma hatası:', error);
  }
};

TaskManager.defineTask(STEP_COUNTER_TASK, async () => {
  try {
    console.log('Background task çalıştı');
    await startPedometerTracking();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundTask = async () => {
  try {
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(STEP_COUNTER_TASK);
    console.log('Task registered:', isTaskRegistered);

    if (!isTaskRegistered) {
      // Pedometer izinlerini al
      const { status: pedometerStatus } = await Pedometer.requestPermissionsAsync();
      if (pedometerStatus !== 'granted') {
        throw new Error('Pedometer izni alınamadı');
      }

      // BackgroundFetch ayarlarını güncelle
      await BackgroundFetch.registerTaskAsync(STEP_COUNTER_TASK, {
        minimumInterval: 60, // 1 dakika
        stopOnTerminate: false,
        startOnBoot: true,
      });

      console.log('Görev başarıyla kaydedildi.');
    }

    // Hemen adım sayacını başlat
    await startPedometerTracking();

  } catch (err) {
    console.error('Task registration failed:', err);
  }
};

export const startStepTracking = async () => {
  try {
    await registerBackgroundTask();

    // Mevcut adım verilerini al
    const storedData = await AsyncStorage.getItem('stepData');
    if (storedData) {
      const { steps } = JSON.parse(storedData);
      lastStepCount = steps;
    }

    console.log('Adım takibi başlatıldı');
  } catch (error) {
    console.error('Adım takibi başlatılırken hata:', error);
  }
};
