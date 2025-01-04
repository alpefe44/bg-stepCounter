import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventEmitter from '../utils/EventEmitter'; // EventEmitter'ı eklemeyi unutmayın
import { Platform } from 'react-native';

const STEP_COUNTER_TASK = 'STEP_COUNTER_TASK';
const NOTIFICATION_ID = 'step-counter-notification';

let lastStepCount = 0; // Son adım sayısını tutacak değişken
console.log('lastStepCount', lastStepCount);

TaskManager.defineTask(STEP_COUNTER_TASK, async () => {
  try {
    console.log('StepCounterService çalıştı');
    const isAvailable = await Pedometer.isAvailableAsync();
    if (!isAvailable) {
      console.log('Pedometer kullanılamıyor');
      return BackgroundFetch.Result.Failed;
    }

    // Kayıtlı adım verilerini al
    const storedData = await AsyncStorage.getItem('stepData');
    if (storedData) {
      const { steps } = JSON.parse(storedData);
      lastStepCount = steps;
    }

    // Adım sayacını başlat
    const subscription = Pedometer.watchStepCount(async result => {
      const currentSteps = result.steps;
      const totalSteps = lastStepCount + currentSteps;

      // Yeni toplam adımları kaydet
      await AsyncStorage.setItem('stepData', JSON.stringify({
        steps: totalSteps,
        date: new Date().toISOString(),
      }));

      EventEmitter.emit('STEPS_UPDATED', totalSteps);

      // Bildirimi güncelle
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Günlük Adım Sayınız',
          body: `Şu ana kadar ${totalSteps} adım attınız`,
        },
        identifier: NOTIFICATION_ID,
        trigger: null,
      });
    });

    // Cleanup function
    return () => {
      subscription && subscription.remove();
    };
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetch.Result.Failed;
  }
});

export const registerBackgroundTask = async () => {
  try {
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(STEP_COUNTER_TASK);
    console.log('Task registered:', isTaskRegistered);

    if (isTaskRegistered) {
      console.log('Görev zaten kayıtlı, tekrar kaydedilmiyor.');
      return;
    }

    // Pedometer izinlerini al
    const { status: pedometerStatus } = await Pedometer.requestPermissionsAsync();
    if (pedometerStatus !== 'granted') {
      throw new Error('Pedometer izni alınamadı');
    }

    // Bildirim izinlerini al
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Bildirim izni alınamadı');
    }

    // BackgroundFetch ayarlarını güncelle
    await BackgroundFetch.registerTaskAsync(STEP_COUNTER_TASK, {
      minimumInterval: 60, // 1 dakika (saniye cinsinden)
      stopOnTerminate: false, // Uygulama kapatıldığında devam et
      startOnBoot: true, // Cihaz yeniden başlatıldığında başlat
      foregroundService: { // Android için foreground service ekle
        notificationTitle: "Adım Sayacı",
        notificationBody: "Adımlarınız sayılıyor",
        notificationColor: "#4630EB"
      }
    });

    // Android için foreground service'i başlat
    if (Platform.OS === 'android') {
      await BackgroundFetch.setMinimumIntervalAsync(60); // 1 dakika
    }

    console.log('Görev başarıyla kaydedildi.');

  } catch (err) {
    console.error('Task registration failed:', err);
  }
};

// Uygulama başlatıldığında bu fonksiyonu çağırın
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
