import type { ExpoConfig } from 'expo/config';
import os from 'os';

const config: ExpoConfig = {
  name: 'TellBoss',
  slug: 'tellboss',
  scheme: 'tellboss',
  extra: {
    // Android emülatörde host makine: 10.0.2.2
    apiUrlAndroidEmu: 'http://10.0.2.2:3000',
    // Web/iOS simülatör/Windows tarayıcı için:
    apiUrlDefault: 'http://localhost:3000',
    // Fiziksel cihazda test edeceksen buraya PC’nin LAN IP’sini koy:
    // apiUrlDefault: 'http://192.168.1.34:3000',
  },
};

export default config;
