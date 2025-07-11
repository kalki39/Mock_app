import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../services/firebase';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('Home'); // redirect after signup
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Sign Up" onPress={handleSignup} />
      <Text onPress={() => navigation.navigate('Login')} style={styles.link}>Already have an account? Login</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  link: { marginTop: 10, color: 'blue' },
});

export default SignupScreen;
