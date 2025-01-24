import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NearbyStops } from '@/components/NearbyStops';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NearbyStopsModal() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: 'Nearby Stops',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#34A336'
          },
          headerTintColor: '#fff'
        }} 
      />
      <NearbyStops />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  }
});