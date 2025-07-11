import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { auth } from '../services/firebase';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Welcome, {auth.currentUser?.email}!</Text>
      <Button title="Logout" onPress={() => navigation.replace('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
});

export default HomeScreen;
