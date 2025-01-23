// app/config.ts
import { Platform } from 'react-native';

export const config = {
    api: {
      baseURL: __DEV__ 
        ? Platform.OS === 'android'
          ? 'http://10.0.2.2:8000/api'    // Android emulator
          : 'http://localhost:8000/api'    // iOS simulator
        : 'https://your-production-url.com/api',  // Production URL
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
    },
    app: {
      name: 'Tshwane Transit',
      version: '1.0.0',
      supportedLanguages: ['en', 'zu', 'af', 'st', 'tn'],
    },
    auth: {
      storage: {
        prefix: 'tshwane_transit_',
        keys: {
          user: 'tshwane_transit_user',
          token: 'tshwane_transit_token',
        },
      },
      tokenExpiration: 43200, // 30 days (matches SANCTUM_TOKEN_EXPIRATION)
    },
    theme: {
      colors: {
        primary: '#34A336',
        secondary: '#4B5563',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        error: '#DC2626',
        text: '#1F2937',
        border: '#E5E7EB',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
      },
      typography: {
        fontSizes: {
          xs: 12,
          sm: 14,
          md: 16,
          lg: 18,
          xl: 20,
          xxl: 24,
        },
        fontWeights: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
      },
      borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
      },
    },
    debug: {
      api: true,  // Enable API call logging
      auth: true, // Enable authentication debugging
      network: true, // Enable network request logging
    },
    api_endpoints: {
      auth: {
        register: '/auth/register',
        login: '/auth/login',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        user: '/auth/user',
      },
      routes: {
        list: '/routes',
        search: '/routes/search',
        nearby: '/routes/nearby',
      },
      buses: {
        list: '/buses',
        track: '/buses/track',
        schedule: '/buses/schedule',
      },
      notifications: {
        settings: '/notifications/settings',
        subscribe: '/notifications/subscribe',
        unsubscribe: '/notifications/unsubscribe',
      },
      profile: {
        update: '/profile/update',
        preferences: '/profile/preferences',
        photo: '/profile/photo',
      },
    },
    timeouts: {
      api_request: 15000, // 15 seconds
      location_update: 10000, // 10 seconds
      route_refresh: 60000, // 1 minute
      token_refresh: 3600000, // 1 hour
    },
    limits: {
      max_recent_trips: 5,
      max_saved_routes: 10,
      max_notifications: 50,
      photo_upload_size: 5 * 1024 * 1024, // 5MB
    },
    mapDefaults: {
      initialRegion: {
        latitude: -25.7479,
        longitude: 28.2293,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      zoomLevel: {
        min: 10,
        max: 20,
        default: 15,
      },
    },
    cache: {
      version: '1.0.0',
      ttl: {
        routes: 3600, // 1 hour
        schedule: 1800, // 30 minutes
        user_data: 86400, // 24 hours
      },
    },
    maps: {
        ios: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY,
        android: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY
      },
  };
  
  // Type definitions
  export type Config = typeof config;
  
  // Export default configuration
  export default config;
  
  // Export individual sections for convenience
  export const { 
    api, 
    app, 
    auth, 
    theme, 
    debug, 
    api_endpoints, 
    timeouts, 
    limits, 
    mapDefaults, 
    cache 
  } = config;