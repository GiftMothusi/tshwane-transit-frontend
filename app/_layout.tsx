// app/_layout.tsx
import { useEffect } from 'react';
import { Slot, useSegments, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === '(auth)';
      
      if (!isAuthenticated && !inAuthGroup) {
        // Redirect to login if not authenticated
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect to home if authenticated
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
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

  // Return AuthProvider with properly typed children prop
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}