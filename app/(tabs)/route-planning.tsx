import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import RoutePlanningService, { RouteOption, RouteCoordinates } from '../services/routePlanningService';

const INITIAL_REGION = {
  latitude: -25.7479,
  longitude: 28.2293,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const TSHWANE_LOCATIONS = [
  {
    name: 'Pretoria Station',
    coordinates: { latitude: -25.7544, longitude: 28.1917 }
  },
  {
    name: 'Church Square',
    coordinates: { latitude: -25.7459, longitude: 28.1879 }
  },
  {
    name: 'Hatfield',
    coordinates: { latitude: -25.7487, longitude: 28.2396 }
  },
  {
    name: 'Menlyn Mall',
    coordinates: { latitude: -25.7827, longitude: 28.2767 }
  }
];

export default function RoutePlanningScreen() {
  const [origin, setOrigin] = useState<RouteCoordinates | null>(null);
  const [destination, setDestination] = useState<RouteCoordinates | null>(null);
  const [selectedOriginName, setSelectedOriginName] = useState('');
  const [selectedDestinationName, setSelectedDestinationName] = useState('');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<MapView | null>(null);

  const handleLocationSelect = (locationType: 'origin' | 'destination', location: any) => {
    if (locationType === 'origin') {
      setOrigin(location.coordinates);
      setSelectedOriginName(location.name);
    } else {
      setDestination(location.coordinates);
      setSelectedDestinationName(location.name);
    }
    setError(null);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  };

  const handlePlanRoute = async () => {
    if (!origin || !destination) {
      Alert.alert('Error', 'Please select both origin and destination');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const plannedRoutes = await RoutePlanningService.planRoute(origin, destination);

      if (!plannedRoutes || plannedRoutes.length === 0) {
        setError('No routes found for the selected locations');
        return;
      }

      setRoutes(plannedRoutes);
      setSelectedRoute(plannedRoutes[0]);

      if (mapRef.current && plannedRoutes[0].stops.length > 0) {
        const coordinates = plannedRoutes[0].stops.map(stop => ({
          latitude: stop.coordinates.latitude,
          longitude: stop.coordinates.longitude,
        }));

        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (err) {
      setError('Failed to plan route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderLocationOption = (location: any, type: 'origin' | 'destination') => (
    <TouchableOpacity
      key={location.name}
      style={[
        styles.locationOption,
        ((type === 'origin' && selectedOriginName === location.name) ||
         (type === 'destination' && selectedDestinationName === location.name)) &&
        styles.selectedLocation
      ]}
      onPress={() => handleLocationSelect(type, location)}
    >
      <Text style={styles.locationText}>{location.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
      >
        {origin && (
          <Marker
            coordinate={origin}
            pinColor="green"
            title="Origin"
            description={selectedOriginName}
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            pinColor="red"
            title="Destination"
            description={selectedDestinationName}
          />
        )}
        {selectedRoute?.stops.map((stop, index) => (
          <Marker
            key={`stop-${index}`}
            coordinate={stop.coordinates}
            pinColor="blue"
            title={stop.name}
          >
            <View style={styles.stopMarker}>
              <Text style={styles.stopMarkerText}>{index + 1}</Text>
            </View>
          </Marker>
        ))}
        {selectedRoute?.stops && (
          <Polyline
            coordinates={selectedRoute.stops.map(stop => stop.coordinates)}
            strokeColor="#34A336"
            strokeWidth={3}
          />
        )}
      </MapView>

      <ScrollView style={styles.controlsContainer}>
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Origin</Text>
          <View style={styles.locationContainer}>
            {TSHWANE_LOCATIONS.map(loc => renderLocationOption(loc, 'origin'))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Destination</Text>
          <View style={styles.locationContainer}>
            {TSHWANE_LOCATIONS.map(loc => renderLocationOption(loc, 'destination'))}
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.planButton, loading && styles.buttonDisabled]}
          onPress={handlePlanRoute}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="map" size={24} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Plan Route</Text>
            </>
          )}
        </TouchableOpacity>

        {routes.length > 0 && (
        <View style={styles.routesContainer}>
            <Text style={styles.routesTitle}>Available Routes</Text>
            {routes.map((route, index) => (
            <TouchableOpacity
                key={route.route_id || `route-${index}`}
                style={[
                styles.routeCard,
                selectedRoute?.route_id === route.route_id && styles.selectedRouteCard
                ]}
                onPress={() => setSelectedRoute(route)}
            >
                <View style={styles.routeHeader}>
                <Text style={styles.routeNumber}>Route {route.route_number}</Text>
                {route.is_express && (
                    <View style={styles.expressTag}>
                    <Text style={styles.expressText}>Express</Text>
                    </View>
                )}
                </View>
                <Text style={styles.routeDetail}>Distance: {route.total_distance?.toFixed(2) ?? 'N/A'} km</Text>
                <Text style={styles.routeDetail}>Duration: {route.estimated_duration ?? 'N/A'} min</Text>
                <Text style={styles.fareText}>R {route.fare?.toFixed(2) ?? 'N/A'}</Text>
            </TouchableOpacity>
            ))}
        </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  map: {
    height: Dimensions.get('window').height * 0.5
  },
  controlsContainer: {
    maxHeight: Dimensions.get('window').height * 0.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  inputSection: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333'
  },
  locationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  locationOption: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    minWidth: '45%'
  },
  selectedLocation: {
    backgroundColor: '#E8F5E9',
    borderColor: '#34A336',
    borderWidth: 1
  },
  locationText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333'
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  errorText: {
    marginLeft: 8,
    color: '#FF3B30',
    fontSize: 14
  },
  planButton: {
    backgroundColor: '#34A336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonIcon: {
    marginRight: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  stopMarker: {
    backgroundColor: '#34A336',
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff'
  },
  stopMarkerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  routesContainer: {
    marginTop: 20
  },
  routesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333'
  },
  routeCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  selectedRouteCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#34A336',
    borderWidth: 1
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  routeNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34A336'
  },
  expressTag: {
    backgroundColor: '#34A336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8
  },
  expressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  routeDetail: {
    color: '#666',
    marginBottom: 4
  },
  fareText: {
    color: '#34A336',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4
  }
});