import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../services/firebase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (err: any) {
      alert(err.message);
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => router.push('/signup')}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  link: { marginTop: 10, color: 'blue' },
});
