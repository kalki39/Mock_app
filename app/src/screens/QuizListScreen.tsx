import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../services/firebase';

export default function QuizListScreen() {
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const snapshot = await getDocs(collection(db, 'quizzes'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(data);
    };
    fetchQuizzes();
  }, []);

  const handleQuizSelect = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Quizzes</Text>
      <FlatList
        data={quizzes}
        keyExtractor={(item : any) => item.id}
        renderItem={({ item }) => (
        <TouchableOpacity
            style={styles.quizItem}
            onPress={() => handleQuizSelect(item.id)}
        >
            <Text style={styles.quizTitle}>{item.tittle}</Text>
        </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  quizItem: { padding: 16, backgroundColor: '#eee', borderRadius: 8, marginBottom: 12 },
  quizTitle: { fontSize: 18 },
});
