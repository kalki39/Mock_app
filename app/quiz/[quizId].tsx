import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    collection, doc, getDoc, getDocs, setDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Button, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../../src/services/firebase';

export default function QuizPlayerScreen() {
  const { quizId } = useLocalSearchParams();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min default
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  const userDocId = `${userId}_${quizId}`;

  // ⏳ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔄 Load questions + user progress
  useEffect(() => {
    const loadData = async () => {
      const qSnap = await getDocs(collection(db, 'quizzes', quizId as string, 'questions'));
      const qList = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(qList);

      const saved = await getDoc(doc(db, 'userAnswers', userDocId));
      if (saved.exists()) {
        const data = saved.data();
        setAnswers(data.answers || {});
        setCurrentIndex(data.currentIndex || 0);
        setReviewed(data.reviewed || []);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading || questions.length === 0) return <Text>Loading...</Text>;

  const currentQuestion = questions[currentIndex];

  const handleAnswer = async (selectedIndex: number) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedIndex };
    setAnswers(updatedAnswers);
    await saveProgress({ answers: updatedAnswers });
  };

  const handleReviewToggle = async () => {
    const isReviewed = reviewed.includes(currentQuestion.id);
    const updatedReviewed = isReviewed
      ? reviewed.filter(q => q !== currentQuestion.id)
      : [...reviewed, currentQuestion.id];

    setReviewed(updatedReviewed);
    await saveProgress({ reviewed: updatedReviewed });
  };

  const saveProgress = async (updates: object) => {
    await setDoc(doc(db, 'userAnswers', userDocId), {
      quizId,
      userId,
      completed: false,
      currentIndex,
      answers,
      reviewed,
      ...updates
    });
  };

  const handleNext = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      await saveProgress({ currentIndex: nextIndex });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    let score = 0;
    questions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    await setDoc(doc(db, 'userAnswers', userDocId), {
      quizId,
      userId,
      completed: true,
      answers,
      reviewed,
      score,
      total: questions.length
    });

    router.push(`/quiz/result?score=${score}&total=${questions.length}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>

      {currentQuestion.options.map((option: string, i: number) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.option,
            answers[currentQuestion.id] === i && styles.selectedOption,
          ]}
          onPress={() => handleAnswer(i)}
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.navigation}>
        <Button title="Prev" onPress={handlePrev} disabled={currentIndex === 0} />
        <Button title="Next" onPress={handleNext} disabled={currentIndex === questions.length - 1} />
      </View>

      <Button
        title={reviewed.includes(currentQuestion.id) ? "Unmark Review" : "Mark for Review"}
        onPress={handleReviewToggle}
      />

      <Button title="Submit Quiz" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  timer: { fontSize: 18, marginBottom: 10 },
  question: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  option: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 6,
    borderColor: '#ccc'
  },
  selectedOption: {
    backgroundColor: '#c6f1d6',
    borderColor: 'green'
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  }
});
