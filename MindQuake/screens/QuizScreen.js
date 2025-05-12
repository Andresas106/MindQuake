import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import { shuffleArray } from '../hooks/shuffleArray';
import { supabase } from '../db/supabase';
import User from '../model/User';
import checkAndUnlockAchievements from '../utils/checkAndUnlockAchievements'; // 👈 Import añadido

const QuizScreen = ({ route, navigation }) => {
  const { categories, questionCount, difficulty, user } = route.params;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [correctByCategory, setCorrectByCategory] = useState({});

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

    let newCorrectAnswers = correctAnswers;
    const updatedCorrectByCategory = { ...correctByCategory };

    if (isCorrect) {
      newCorrectAnswers = newCorrectAnswers + 1;
      const category = questions[currentQuestionIndex].category;
      updatedCorrectByCategory[category] = (updatedCorrectByCategory[category] || 0) + 1;
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCorrectAnswers(newCorrectAnswers);
      setCorrectByCategory(updatedCorrectByCategory);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Fin del quiz → otorgar XP y redirigir
      const xpEarned = newCorrectAnswers * xpPerCorrect[difficulty];
      const updatedUser = new User({ ...user, xp: user.xp + xpEarned });
      updatedUser.updateXp(updatedUser.xp); // Recalcula el nivel

      let newlyUnlocked = [];
      try {
        const { error } = await supabase
          .from('user')
          .update({
            xp: updatedUser.xp,
            level: updatedUser.level,
          })
          .eq('id', user.id);


        // Actualizar estadísticas por categoría
        for (const [category, count] of Object.entries(updatedCorrectByCategory)) {
          const { data: existingStat, error: fetchError } = await supabase
            .from('user_category_stats')
            .select('id, correct_answers')
            .eq('user_id', user.id)
            .eq('category', category)
            .maybeSingle();

          if (fetchError) {
            console.error(`Error fetching stats for ${category}:`, fetchError);
            continue;
          }

          if (existingStat) {
            // Si ya existe, sumamos
            const { error: updateError } = await supabase
              .from('user_category_stats')
              .update({
                correct_answers: existingStat.correct_answers + count,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingStat.id);


            if (updateError) console.error(`Error updating ${category}:`, updateError);
          } else {
            // Si no existe, creamos
            const { error: insertError } = await supabase
              .from('user_category_stats')
              .insert({
                user_id: user.id,
                category,
                correct_answers: count,
              });


            if (insertError) console.error(`Error inserting ${category}:`, insertError);
          }
        }

        // Obtener estadísticas
        const { data: existingStats, error: statsError } = await supabase
          .from('user_category_stats')
          .select('category, correct_answers')
          .eq('user_id', user.id);

        if (statsError) {
          console.error('Error fetching existing stats:', statsError);
        } else {
          const totalCorrectByCategory = { ...updatedCorrectByCategory };

          // Sumar cada estadística anterior
          for (const stat of existingStats) {
            totalCorrectByCategory[stat.category] = stat.correct_answers;
          }
          

          newlyUnlocked = await checkAndUnlockAchievements(user.id, totalCorrectByCategory) || [];
        }


        if (error) {
          console.error('Error updating XP:', error);
        } else {
          Alert.alert('Quiz finished', `You won ${xpEarned} XP`);
        }
      } catch (err) {
        console.error('Error giving xp:', err);
      }


      navigation.navigate('Results', {
        user: { ...user, xp: updatedUser.xp, level: updatedUser.level },
        totalQuestions: questions.length,
        newCorrectAnswers: newCorrectAnswers,
        unlockedAchievements: newlyUnlocked.map(a => ({
          id: a.id,
          icon: a.icon,
        })),
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
        <Text>Couldn't load trivia questions</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.questionCounter}>
        Question {currentQuestionIndex + 1} of {questions.length}
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