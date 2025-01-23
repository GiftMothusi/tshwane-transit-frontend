// app/components/ScheduleView.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface Stop {
 name: string;
 coordinates: {
   latitude: number;
   longitude: number;
 };
}

interface Route {
 route_number: string;
 name: string;
 fare: string;
 stops: Stop[];
 estimated_duration: number;
 is_express: boolean;
}

export interface Schedule {
 id: number;
 route: Route;
 departure_time: string;
 bus_number: string;
 capacity: number;
 is_express: boolean;
}

interface ScheduleViewProps {
 schedules: Schedule[];
 onSchedulePress?: (schedule: Schedule) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ 
 schedules, 
 onSchedulePress 
}) => {
 const renderItem = ({ item }: { item: Schedule }) => (
   <TouchableOpacity 
     style={styles.scheduleItem}
     onPress={() => onSchedulePress?.(item)}
   >
     <View style={styles.routeInfo}>
       <View style={styles.routeHeader}>
         <Text style={styles.routeNumber}>{item.route.route_number}</Text>
         {item.route.is_express && (
           <View style={styles.expressBadge}>
             <Text style={styles.expressText}>Express</Text>
           </View>
         )}
       </View>
       <Text style={styles.routeName}>{item.route.name}</Text>
       <View style={styles.busInfo}>
         <Ionicons name="bus-outline" size={14} color="#666" />
         <Text style={styles.busNumber}>Bus {item.bus_number}</Text>
       </View>
     </View>
     <View style={styles.timeInfo}>
       <Text style={styles.departureTime}>
         {format(new Date(item.departure_time), 'h:mm a')}
       </Text>
       <Text style={styles.duration}>
         {item.route.estimated_duration} min
       </Text>
       <Text style={styles.fare}>R{Number(item.route.fare).toFixed(2)}</Text>
     </View>
     <Ionicons name="chevron-forward" size={20} color="#666" />
   </TouchableOpacity>
 );

 return (
   <FlatList
     data={schedules}
     renderItem={renderItem}
     keyExtractor={item => item.id.toString()}
     style={styles.container}
     contentContainerStyle={styles.listContent}
   />
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#fff',
 },
 listContent: {
   paddingVertical: 8,
 },
 scheduleItem: {
   flexDirection: 'row',
   padding: 15,
   borderBottomWidth: 1,
   borderBottomColor: '#eee',
   alignItems: 'center',
 },
 routeInfo: {
   flex: 1,
 },
 routeHeader: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 routeNumber: {
   fontSize: 16,
   fontWeight: 'bold',
   color: '#34A336',
 },
 expressBadge: {
   backgroundColor: '#34A336',
   paddingHorizontal: 8,
   paddingVertical: 2,
   borderRadius: 12,
   marginLeft: 8,
 },
 expressText: {
   color: '#fff',
   fontSize: 12,
   fontWeight: '500',
 },
 routeName: {
   fontSize: 14,
   color: '#666',
   marginTop: 4,
 },
 busInfo: {
   flexDirection: 'row',
   alignItems: 'center',
   marginTop: 4,
 },
 busNumber: {
   fontSize: 12,
   color: '#666',
   marginLeft: 4,
 },
 timeInfo: {
   alignItems: 'flex-end',
   marginRight: 12,
 },
 departureTime: {
   fontSize: 16,
   fontWeight: '500',
   color: '#333',
 },
 duration: {
   fontSize: 12,
   color: '#666',
   marginTop: 2,
 },
 fare: {
   fontSize: 14,
   color: '#34A336',
   fontWeight: '500',
   marginTop: 2,
 },
});