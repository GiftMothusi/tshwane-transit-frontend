// app/(auth)/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    preferred_language: 'en'
  });
  
  const { signUp } = useAuth();

  const handleRegister = async () => {
    try {
        if (formData.password !== formData.password_confirmation) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        
        await signUp(formData);
    } catch (error: any) {
        const message = error.response?.data?.message 
            || error.response?.data?.errors?.[Object.keys(error.response?.data?.errors)[0]][0]
            || 'Registration failed';
        Alert.alert('Error', message);
    }
};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tshwane Bus Service</Text>
        <Text style={styles.subtitle}>Create Account</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phone_number}
          onChangeText={(text) => setFormData({...formData, phone_number: text})}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.password_confirmation}
          onChangeText={(text) => setFormData({...formData, password_confirmation: text})}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#34A336',
    padding: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#34A336',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#34A336',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});