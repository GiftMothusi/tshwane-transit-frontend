import { useCallback, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function TabLayout() {
  const [loaded, error] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {
        /* reloading the app might trigger some race conditions, ignore them */
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Tabs
    screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#34A336', 
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#F2F2F7', 
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'route-planning') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'bus-tracking') {
            iconName = focused ? 'bus' : 'bus-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="route-planning"
        options={{
          title: 'Route Planning',
        }}
      />
      <Tabs.Screen
        name="bus-tracking"
        options={{
          title: 'Bus Tracking',
        }}
      />
      <Tabs.Screen name="profile" 
        options={{
            title: 'Profile',
        }}
      />
    </Tabs>
  );
}