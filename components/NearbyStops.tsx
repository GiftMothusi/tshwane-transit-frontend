import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';
import config from '@/app/config';

interface Stop {
 id: string;
 name: string;
 coordinates: {
   latitude: number;
   longitude: number;
 };
 route_numbers: string[];
 distance: number;
}

export const NearbyStops: React.FC<{
 onStopSelect?: (stop: Stop) => void;
}> = ({ onStopSelect }) => {
 const [stops, setStops] = useState<Stop[]>([]);
 const [location, setLocation] = useState<Location.LocationObject | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
   requestLocationPermission();
 }, []);

 const mockLocation = {
   coords: {
     latitude: -25.7479,
     longitude: 28.2293,
     accuracy: 5,
     altitude: 0,
     altitudeAccuracy: -1,
     heading: -1,
     speed: -1
   },
   timestamp: Date.now()
 };

 const requestLocationPermission = async () => {
   try {
     setLocation(mockLocation);
     fetchNearbyStops(mockLocation.coords);
   } catch (err) {
     setError('Error getting location');
     setLoading(false);
   }
 };

 const fetchNearbyStops = async (coords: Location.LocationObjectCoords) => {
   try {
     console.log('Fetching stops with coords:', coords);
     const response = await axios.get(`${config.api.baseURL}/v1/bus-stops/nearby`, {
       params: {
         latitude: coords.latitude,
         longitude: coords.longitude,
         radius: 100
       }
     });
     console.log('API Response:', response.data);
     setStops(response.data.data);
   } catch (err) {
     console.error('Fetch error:', err);
     if (axios.isAxiosError(err)) {
       console.error('Response data:', err.response?.data);
     }
     setError('Error fetching nearby stops');
   } finally {
     setLoading(false);
   }
 };

 const renderStop = ({ item }: { item: Stop }) => (
   <TouchableOpacity 
     style={styles.stopItem}
     onPress={() => onStopSelect?.(item)}
   >
     <View style={styles.stopInfo}>
       <Text style={styles.stopName}>{item.name}</Text>
       <Text style={styles.routeList}>
         Routes: {item.route_numbers.join(', ')}
       </Text>
       <Text style={styles.distance}>
         {item.distance.toFixed(1)} km away
       </Text>
     </View>
     <Ionicons name="chevron-forward" size={20} color="#666" />
   </TouchableOpacity>
 );

 if (loading) {
   return (
     <View style={styles.centered}>
       <ActivityIndicator size="large" color="#34A336" />
       <Text style={styles.loadingText}>Finding nearby stops...</Text>
     </View>
   );
 }

 if (error) {
   return (
     <View style={styles.centered}>
       <Ionicons name="warning" size={24} color="#FF3B30" />
       <Text style={styles.error}>{error}</Text>
       <TouchableOpacity 
         style={styles.retryButton}
         onPress={() => {
           setLoading(true);
           setError(null);
           requestLocationPermission();
         }}
       >
         <Text style={styles.retryButtonText}>Retry</Text>
       </TouchableOpacity>
     </View>
   );
 }

 return (
   <FlatList
     data={stops}
     renderItem={renderStop}
     keyExtractor={item => `${item.name}-${item.distance}`}
     contentContainerStyle={styles.container}
     ListEmptyComponent={() => (
       <View style={styles.centered}>
         <Text style={styles.emptyText}>No stops found nearby</Text>
       </View>
     )}
   />
 );
};

const styles = StyleSheet.create({
 container: {
   padding: 16,
   flexGrow: 1,
 },
 centered: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 20,
 },
 stopItem: {
   flexDirection: 'row',
   padding: 16,
   backgroundColor: '#fff',
   borderRadius: 8,
   marginBottom: 8,
   alignItems: 'center',
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 2,
 },
 stopInfo: {
   flex: 1,
 },
 stopName: {
   fontSize: 16,
   fontWeight: '600',
   color: '#333',
 },
 routeList: {
   fontSize: 14,
   color: '#666',
   marginTop: 4,
 },
 distance: {
   fontSize: 14,
   color: '#34A336',
   marginTop: 4,
 },
 error: {
   color: '#FF3B30',
   textAlign: 'center',
   marginTop: 8,
 },
 loadingText: {
   color: '#666',
   marginTop: 8,
 },
 emptyText: {
   color: '#666',
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
   fontWeight: '500',
 },
});