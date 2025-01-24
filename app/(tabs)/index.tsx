import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { useRouter } from 'expo-router';

interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const QuickActionButton = ({ icon, label, onPress }: QuickActionButtonProps) => (
  <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#34A336" />
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

interface RecentTripProps {
  from: string;
  to: string;
  onPress: () => void;
}

const RecentTrip = ({ from, to, onPress }: RecentTripProps) => (
  <TouchableOpacity style={styles.recentTrip} onPress={onPress}>
    <Ionicons name="time-outline" size={24} color="#34A336" />
    <View style={styles.recentTripText}>
      <Text style={styles.recentTripLabel}>From: {from}</Text>
      <Text style={styles.recentTripLabel}>To: {to}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#34A336" />
  </TouchableOpacity>
);
export default function HomeScreen({ navigation }: { navigation: NavigationProp<any> }) {
    const router = useRouter();
    
    const handlePlanRoute = () => {
        router.push('/(tabs)/route-planning');
      };
     
      const handleNearbyStops = () => {
        router.push('/modals/nearby-stops');
      };
     
      const handleLiveTracking = () => {
        router.push('/(tabs)/bus-tracking');
      };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tshwane Bus Service</Text>
        <Text style={styles.subtitle}>Your journey starts here</Text>
      </View>

      <View style={styles.quickActions}>
        <QuickActionButton 
          icon="map" 
          label="Plan Route" 
          onPress={handlePlanRoute} 
        />
        <QuickActionButton 
          icon="location" 
          label="Nearby Stops" 
          onPress={handleNearbyStops} 
        />
        <QuickActionButton 
          icon="bus" 
          label="Live Tracking" 
          onPress={handleLiveTracking} 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Trips</Text>
        <RecentTrip 
          from="Pretoria Station" 
          to="Menlyn Mall" 
          onPress={() => console.log('Navigate to trip details')} 
        />
        <RecentTrip 
          from="Hatfield" 
          to="Church Square" 
          onPress={() => console.log('Navigate to trip details')} 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Updates</Text>
        <View style={styles.newsItem}>
          <Text style={styles.newsTitle}>Route A1 Detour</Text>
          <Text style={styles.newsContent}>Due to road maintenance, Route A1 will be detoured via Church Street until further notice.</Text>
        </View>
        <View style={styles.newsItem}>
          <Text style={styles.newsTitle}>New Express Service</Text>
          <Text style={styles.newsContent}>Starting next week, we're introducing a new express service from Centurion to Pretoria CBD.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#34A336',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 10,
    elevation: 2,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 10,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  recentTrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  recentTripText: {
    flex: 1,
    marginLeft: 10,
  },
  recentTripLabel: {
    fontSize: 14,
    color: '#333',
  },
  newsItem: {
    marginBottom: 15,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  newsContent: {
    fontSize: 14,
    color: '#666',
  },
});

