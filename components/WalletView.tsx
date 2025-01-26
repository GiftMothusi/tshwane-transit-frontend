import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { config } from '../app/config';
import { useAuth } from '../app/contexts/AuthContext';

interface Transaction {
  id: string;
  type: 'topup' | 'ticket_purchase' | 'refund';
  amount: number;
  status: string;
  date: string;
  reference: string;
  payment_method?: string;
}

interface WalletData {
  balance: number;
  currency: string;
  transactions: Transaction[];
}

export const WalletView = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchWalletData = async () => {
    try {
      const response = await axios.get(`${config.api.baseURL}/v1/wallet`);
      setWalletData(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleTopUp = async (amount: number) => {
    try {
      const response = await axios.post(`${config.api.baseURL}/v1/wallet/topup`, {
        amount,
        payment_method: 'credit_card' // This can be made dynamic
      });
      
      if (response.data.status === 'success') {
        Alert.alert('Success', 'Wallet topped up successfully');
        fetchWalletData(); // Refresh wallet data
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to top up wallet');
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#34A336" />
      </View>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return 'add-circle';
      case 'ticket_purchase':
        return 'ticket';
      case 'refund':
        return 'return-up-back';
      default:
        return 'cash';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Wallet Balance</Text>
        <Text style={styles.balanceAmount}>
          R {walletData?.balance.toFixed(2)}
        </Text>
        <TouchableOpacity 
          style={styles.topUpButton}
          onPress={() => handleTopUp(50)} // Example amount
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.topUpButtonText}>Top Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {walletData?.transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Ionicons 
                name={getTransactionIcon(transaction.type)} 
                size={24} 
                color="#34A336" 
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              { color: transaction.type === 'topup' ? '#34A336' : '#FF3B30' }
            ]}>
              {transaction.type === 'topup' ? '+' : '-'} R{transaction.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: '#34A336',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balanceTitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  topUpButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  transactionsContainer: {
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});