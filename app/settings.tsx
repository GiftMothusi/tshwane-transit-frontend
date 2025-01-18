import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SettingsScreen() {
  const [language, setLanguage] = useState('english');
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.setting}>
        <Text>Language</Text>
        <Picker
          selectedValue={language}
          style={styles.picker}
          onValueChange={(itemValue) => setLanguage(itemValue)}
        >
          <Picker.Item label="English" value="english" />
          <Picker.Item label="Afrikaans" value="afrikaans" />
          <Picker.Item label="Zulu" value="zulu" />
          <Picker.Item label="Xhosa" value="xhosa" />
        </Picker>
      </View>

      <View style={styles.setting}>
        <Text>Offline Mode</Text>
        <Switch
          value={offlineMode}
          onValueChange={setOfflineMode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    width: 150,
  },
});