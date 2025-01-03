import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventEmitter from '../utils/EventEmitter'; // EventEmitter'ı eklemeyi unutmayın

const STEP_COUNTER_TASK = 'STEP_COUNTER_TASK';
const NOTIFICATION_ID = 'step-counter-notification';

TaskManager.defineTask(STEP_COUNTER_TASK, async () => {
  try {
    console.log('StepCounterService çalıştı');
    const isAvailable = await Pedometer.isAvailableAsync();
    if (!isAvailable) {
      console.log('Pedometer kullanılamıyor');
      return BackgroundFetch.Result.Failed;
    }

    // Adım sayacını başlat
    const subscription = Pedometer.watchStepCount(async result => {
      const steps = result.steps;
      console.log('steps', steps);

      // AsyncStorage'a kaydet
      await AsyncStorage.setItem('dailySteps', steps.toString());

      // Event ile bildir (UI güncellemesi için)
      EventEmitter.emit('STEPS_UPDATED', steps);


      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Günlük Adım Sayınız',
          body: `Şu ana kadar ${steps} adım attınız`,
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

    await BackgroundFetch.registerTaskAsync(STEP_COUNTER_TASK, {
      minimumInterval: 1, // minimum süreyi 1 dakikaya ayarladık
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Görev başarıyla kaydedildi.');
  } catch (err) {
    console.error('Task registration failed:', err);
  }
};