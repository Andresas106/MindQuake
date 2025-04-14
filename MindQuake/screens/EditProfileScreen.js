import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import { shuffleArray } from '../hooks/shuffleArray';
import { supabase } from '../db/supabase';
import User from '../model/User'; // IMPORTA TU CLASE USER

const QuizScreen = ({ route, navigation }) => {
  const { categories, questionCount, difficulty, user } = route.params;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState(0);

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

  const xpPerCorrect = {
    easy: 50,
    medium: 100,
    hard: 150,
  };

  const handleAnswer = async (selectedAnswer) => {
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const xpEarned = (isCorrect ? correctAnswers + 1 : correctAnswers) * xpPerCorrect[difficulty];
      const updatedUser = new User({ ...user, xp: user.xp + xpEarned });
      updatedUser.updateXp(updatedUser.xp); // Recalcula el nivel

      try {
        const { error } = await supabase
          .from('user')
          .update({
            xp: updatedUser.xp,
            level: updatedUser.level,
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating xp and level', error);
        } else {
          Alert.alert('Quiz finished', `You won ${xpEarned} XP and now you are level ${updatedUser.level}`);
        }
      } catch (err) {
        console.error('Error giving xp:', err);
      }

      navigation.navigate('Results', {
        user: updatedUser.toJSON(),
        totalQuestions: questions.length,
        correctAnswers,
      });
    }
  };

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
        <Text>No questions could be loaded</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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
            onPress={() => handleAnswer(answer)}
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
