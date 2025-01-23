import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ScheduleView, Schedule } from '@/components/ScheduleView';
import axios from 'axios';
import { config } from '../config';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

interface Bus {
  id: string;
  bus_number: string;
  route_number: string;
  next_stop: {
    name: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
}

type MapRef = MapView;

export default function BusTrackingScreen() {
  const mapRef = useRef<MapRef>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [schedulesResponse, locationsResponse] = await Promise.all([
        axios.get(`${config.api.baseURL}/v1/bus-schedules`),
        axios.get(`${config.api.baseURL}/v1/bus-locations`)
      ]);

      setSchedules(schedulesResponse.data.data);
      setBuses(locationsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response);
      }
      setError('Failed to load bus information');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }, [])
  );

  const handleSchedulePress = (schedule: Schedule): void => {
    const bus = buses.find(b => b.bus_number === schedule.bus_number);
    if (bus && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: bus.location.latitude,
        longitude: bus.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  if (loading && !schedules.length) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#34A336" />
        <Text style={styles.loadingText}>Loading bus information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.mapContainer, !showSchedule && styles.mapFullscreen]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: -25.7479,
            longitude: 28.2293,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
          showsMyLocationButton
        >
          {buses.map((bus) => (
            <Marker
              key={bus.id}
              coordinate={{
                latitude: bus.location.latitude,
                longitude: bus.location.longitude,
              }}
              title={`Bus ${bus.bus_number}`}
              description={`Route ${bus.route_number} - Next Stop: ${bus.next_stop.name}`}
            >
              <View style={styles.busMarker}>
                <Ionicons name="bus" size={24} color="#34A336" />
              </View>
            </Marker>
          ))}
        </MapView>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowSchedule(!showSchedule)}
        >
          <Ionicons 
            name={showSchedule ? "chevron-down" : "chevron-up"} 
            size={24} 
            color="#333" 
          />
        </TouchableOpacity>
      </View>
      {showSchedule && (
        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>Bus Schedules</Text>
            <TouchableOpacity onPress={fetchData}>
              <Ionicons name="refresh" size={24} color="#34A336" />
            </TouchableOpacity>
          </View>
          <ScheduleView 
            schedules={schedules} 
            onSchedulePress={handleSchedulePress}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  mapFullscreen: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  scheduleContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#34A336',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  toggleButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  busMarker: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#34A336',
  },
});