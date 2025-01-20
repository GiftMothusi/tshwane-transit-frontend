import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function BusTrackingScreen() {
  const [buses, setBuses] = useState<{ id: number; latitude: number; longitude: number; }[]>([]);

  useEffect(() => {
    // Simulated bus data - in a real app, this would come from an API
    const simulatedBuses = [
      { id: 1, latitude: -25.7479, longitude: 28.2293 },
      { id: 2, latitude: -25.7569, longitude: 28.2393 },
      { id: 3, latitude: -25.7389, longitude: 28.2193 },
    ];
    setBuses(simulatedBuses);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -25.7479,
          longitude: 28.2293,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
            title={`Bus ${bus.id}`}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});