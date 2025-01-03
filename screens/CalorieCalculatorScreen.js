import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventEmitter from '../utils/EventEmitter';

export default function CalorieCalculatorScreen({ navigation }) {
  const [gender, setGender] = useState('erkek');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('1.2');

  const calculateCalories = async () => {
    if (!age || !weight || !height) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    let bmr = 0;
    if (gender === 'erkek') {
      bmr = 88.362 + (13.397 * parseFloat(weight)) +
        (4.799 * parseFloat(height)) -
        (5.677 * parseFloat(age));
    } else {
      bmr = 447.593 + (9.247 * parseFloat(weight)) +
        (3.098 * parseFloat(height)) -
        (4.330 * parseFloat(age));
    }

    const dailyCalories = Math.round(bmr * parseFloat(activityLevel));

    const result = {
      maintenance: dailyCalories,
      weightLoss: dailyCalories - 500,
      weightGain: dailyCalories + 500,
      timestamp: new Date().toISOString()
    };

    try {
      await AsyncStorage.setItem('calorieResult', JSON.stringify(result));
      Alert.alert(
        'Başarılı',
        'Kalori hesaplaması kaydedildi. Ana ekranda görüntüleyebilirsiniz.',
        [
          { text: 'Tamam', onPress: () => navigation.navigate('Fitness') }
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Sonuçlar kaydedilemedi');
    }
  };


  function deneme() {
    console.log('deneme');
    EventEmitter.emit('deneme', 100);
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Cinsiyet</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[styles.radioButton, gender === 'erkek' && styles.radioSelected]}
            onPress={() => setGender('erkek')}
          >
            <Text style={[styles.radioText, gender === 'erkek' && styles.radioTextSelected]}>
              Erkek
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, gender === 'kadın' && styles.radioSelected]}
            onPress={() => setGender('kadın')}
          >
            <Text style={[styles.radioText, gender === 'kadın' && styles.radioTextSelected]}>
              Kadın
            </Text>
          </TouchableOpacity>
        </View>

        <Button title="deneme" onPress={deneme} />

        <Text style={styles.label}>Yaş</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="Yaşınızı girin"
        />

        <Text style={styles.label}>Kilo (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="Kilonuzu girin"
        />

        <Text style={styles.label}>Boy (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          placeholder="Boyunuzu girin"
        />

        <Text style={styles.label}>Aktivite Seviyesi</Text>
        <View style={styles.activityContainer}>
          {[
            { label: 'Hareketsiz', value: '1.2' },
            { label: 'Az Hareketli', value: '1.375' },
            { label: 'Orta Hareketli', value: '1.55' },
            { label: 'Çok Hareketli', value: '1.725' },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.activityButton,
                activityLevel === item.value && styles.activitySelected
              ]}
              onPress={() => setActivityLevel(item.value)}
            >
              <Text style={[
                styles.activityText,
                activityLevel === item.value && styles.activityTextSelected
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={calculateCalories}>
          <Text style={styles.calculateButtonText}>Hesapla</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#6c63ff',
  },
  radioText: {
    color: '#333',
    fontSize: 16,
  },
  radioTextSelected: {
    color: 'white',
  },
  activityContainer: {
    marginBottom: 20,
  },
  activityButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  activitySelected: {
    backgroundColor: '#6c63ff',
  },
  activityText: {
    color: '#333',
    fontSize: 16,
  },
  activityTextSelected: {
    color: 'white',
  },
  calculateButton: {
    backgroundColor: '#6c63ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});