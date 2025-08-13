import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trackerapp2025.app',
  appName: 'Tracker App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
