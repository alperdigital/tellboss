import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const extra = Constants.expoConfig?.extra as any;
const baseURL =
  Platform.OS === 'android' ? extra.apiUrlAndroidEmu : extra.apiUrlDefault;

export const api = axios.create({ baseURL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
