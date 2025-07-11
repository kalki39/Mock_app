import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { auth } from '../services/firebase';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {auth.currentUser?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
