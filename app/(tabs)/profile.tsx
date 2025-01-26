// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Switch, 
  Image, 
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { WalletView } from '../../components/WalletView';

export default function ProfileScreen() {
  const [offlineMode, setOfflineMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'wallet'>('profile');
  const [slideAnim] = useState(new Animated.Value(0));

  const handleTabChange = (tab: 'profile' | 'wallet') => {
    if (tab !== activeTab) {
      Animated.timing(slideAnim, {
        toValue: tab === 'profile' ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setActiveTab(tab);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: handleLogout,
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/200' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user?.name || 'User Name'}</Text>
        <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
            onPress={() => handleTabChange('profile')}
          >
            <Ionicons 
              name="person" 
              size={20} 
              color={activeTab === 'profile' ? '#34A336' : '#666'} 
              style={styles.tabIcon}
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'profile' && styles.activeTabText
            ]}>
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'wallet' && styles.activeTab]}
            onPress={() => handleTabChange('wallet')}
          >
            <Ionicons 
              name="wallet" 
              size={20} 
              color={activeTab === 'wallet' ? '#34A336' : '#666'} 
              style={styles.tabIcon}
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'wallet' && styles.activeTabText
            ]}>
              Wallet
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'profile' ? (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity style={styles.option}>
              <View style={styles.optionLeft}>
                <Ionicons name="person-outline" size={24} color="#666" style={styles.optionIcon} />
                <Text style={styles.optionText}>Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <View style={styles.optionLeft}>
                <Ionicons name="key-outline" size={24} color="#666" style={styles.optionIcon} />
                <Text style={styles.optionText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            <View style={styles.option}>
              <View style={styles.optionLeft}>
                <Ionicons name="cloud-offline-outline" size={24} color="#666" style={styles.optionIcon} />
                <Text style={styles.optionText}>Offline Mode</Text>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: '#767577', true: '#34A336' }}
                thumbColor={offlineMode ? '#fff' : '#f4f3f4'}
              />
            </View>
            <View style={styles.option}>
              <View style={styles.optionLeft}>
                <Ionicons name="notifications-outline" size={24} color="#666" style={styles.optionIcon} />
                <Text style={styles.optionText}>Push Notifications</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#767577', true: '#34A336' }}
                thumbColor={pushNotifications ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel History</Text>
            <TouchableOpacity style={styles.option}>
              <View style={styles.optionLeft}>
                <Ionicons name="time-outline" size={24} color="#666" style={styles.optionIcon} />
                <Text style={styles.optionText}>View Travel History</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <WalletView />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#34A336',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    marginTop: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 120,
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#E8F5E9',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#34A336',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
    width: 24,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});