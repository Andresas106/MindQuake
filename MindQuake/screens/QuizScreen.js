import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { shuffleArray } from '../hooks/shuffleArray';

const QuizScreen = ({ route, navigation }) => {
  const { categories, questionCount, difficulty, user } = route.params;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const categoryParam = categories.join(',');
        const response = await fetch(
          `https://the-trivia-api.com/api/questions?categories=${categoryParam}&limit=${questionCount}&difficulty=${difficulty}`
        );
        const data = await response.json();

        const formatted = data.map(q => ({
          ...q,
          answers: shuffleArray([...q.incorrectAnswers, q.correctAnswer]),
        }));

        setQuestions(formatted);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No se pudieron cargar preguntas. Intenta con otras categorías o dificultad.</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Termina el quiz
      navigation.navigate('Results', {
        user,
        totalQuestions: questions.length,
        // Puedes pasar resultados o puntaje
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionCounter}>
        Pregunta {currentQuestionIndex + 1} de {questions.length}
      </Text>
      <Text style={styles.questionText}>
        {decodeURIComponent(currentQuestion.question)}
      </Text>

      <View style={styles.answersContainer}>
        {currentQuestion.answers.map((answer, index) => (
          <Button
            key={index}
            title={decodeURIComponent(answer)}
            onPress={handleNext}
            color="#6200ee"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  questionCounter: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  answersContainer: {
    marginTop: 10,
    gap: 10,
  },
});

export default QuizScreen;
