import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootNavigator } from './navigation/RootNavigator';
import { AppProvider } from './context/AppContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function App() {
  return (
    <AppProvider>
      <View style={styles.container}>
        <RootNavigator />
      </View>
    </AppProvider>
  );
}
