import React, { useState, useEffect } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions,
  Platform 
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type * as Location from "expo-location"
import MapView, { Marker } from "react-native-maps"
import axios from "axios"
import config from "@/app/config"
import { useRouter } from "expo-router"

interface Stop {
  id: string
  name: string
  coordinates: {
    latitude: number
    longitude: number
  }
  route_numbers: string[]
  distance: number
}

export const NearbyStops: React.FC<{
  onStopSelect?: (stop: Stop) => void
}> = ({ onStopSelect }) => {
  const [stops, setStops] = useState<Stop[]>([])
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null)
  const router = useRouter()

  useEffect(() => {
    requestLocationPermission()
  }, [])

  const mockLocation = {
    coords: {
      latitude: -25.7479,
      longitude: 28.2293,
      accuracy: 5,
      altitude: 0,
      altitudeAccuracy: -1,
      heading: -1,
      speed: -1,
    },
    timestamp: Date.now(),
  }

  const requestLocationPermission = async () => {
    try {
      setLocation(mockLocation)
      fetchNearbyStops(mockLocation.coords)
    } catch (err) {
      setError("Error getting location")
      setLoading(false)
    }
  }

  const fetchNearbyStops = async (coords: Location.LocationObjectCoords) => {
    try {
      const response = await axios.get(`${config.api.baseURL}/v1/bus-stops/nearby`, {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          radius: 100,
        },
      })
      setStops(response.data.data)
    } catch (err) {
      setError("Error fetching nearby stops")
    } finally {
      setLoading(false)
    }
  }

  const renderRouteChip = (route: string) => (
    <View key={route} style={[styles.routeChip, { backgroundColor: getRouteColor(route) }]}>
      <Text style={styles.routeChipText}>{route}</Text>
    </View>
  )

  const getRouteColor = (route: string) => {
    const colors: { [key: string]: string } = {
      A1: "#FF6B6B",
      A2: "#4ECDC4",
      B1: "#45B7D1",
      B2: "#96CEB4",
      C3: "#D4A5A5",
      D4: "#9B89B3",
      E5: "#E9B44C",
    }
    return colors[route] || "#34A336"
  }

  const renderStop = ({ item }: { item: Stop }) => (
    <TouchableOpacity
      style={[styles.stopItem, selectedStop?.id === item.id && styles.selectedStop]}
      onPress={() => {
        setSelectedStop(item)
        onStopSelect?.(item)
      }}
    >
      <View style={styles.stopHeader}>
        <View style={styles.stopIcon}>
          <Ionicons name="bus" size={24} color="#34A336" />
        </View>
        <View style={styles.stopInfo}>
          <Text style={styles.stopName}>{item.name}</Text>
          <Text style={styles.distance}>
            <Ionicons name="location" size={14} color="#34A336" /> {item.distance.toFixed(1)} km away
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>

      <View style={styles.routesContainer}>
        <Text style={styles.routesLabel}>Routes:</Text>
        <View style={styles.routeChips}>{item.route_numbers.map((route) => renderRouteChip(route))}</View>
      </View>

      <View style={styles.nextBusInfo}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.nextBusText}>Next bus in: 5 min</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.headerTitle}>Nearby Stops</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#34A336" />
          <Text style={styles.loadingText}>Finding nearby stops...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="warning" size={24} color="#FF3B30" />
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true)
              setError(null)
              requestLocationPermission()
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: mockLocation.coords.latitude,
              longitude: mockLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {stops.map((stop) => (
              <Marker
                key={stop.id}
                coordinate={stop.coordinates}
                title={stop.name}
                description={`Routes: ${stop.route_numbers.join(", ")}`}
              >
                <View style={styles.markerContainer}>
                  <Ionicons name="bus" size={24} color="#34A336" />
                </View>
              </Marker>
            ))}
          </MapView>

          <FlatList
            data={stops}
            renderItem={renderStop}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={() => (
              <View style={styles.centered}>
                <Text style={styles.emptyText}>No stops found nearby</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  map: {
    height: Dimensions.get("window").height * 0.3,
  },
  markerContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#34A336",
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  stopItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedStop: {
    borderColor: "#34A336",
    borderWidth: 2,
  },
  stopHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stopIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: "#34A336",
    flexDirection: "row",
    alignItems: "center",
  },
  routesContainer: {
    marginBottom: 12,
  },
  routesLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  routeChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  routeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#34A336",
  },
  routeChipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  nextBusInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 8,
  },
  nextBusText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  error: {
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 8,
  },
  loadingText: {
    color: "#666",
    marginTop: 8,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#34A336",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
})