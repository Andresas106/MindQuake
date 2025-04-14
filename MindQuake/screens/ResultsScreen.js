import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ResultsScreen = ({ route, navigation }) => {
  const { user, totalQuestions, correctAnswers } = route.params;

  const xpGained = user.xp; // ya está actualizado
  const level = user.level;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>

      <Text style={styles.resultText}>
        Correct answers: {correctAnswers} of {totalQuestions}
      </Text>

      <Text style={styles.resultText}>Actual Level: {level}</Text>
      <Text style={styles.resultText}>Total XP: {xpGained}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Volver al inicio"
          onPress={() => navigation.navigate('Main')}
          color="#6200ee"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ee',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 30,
    width: '80%',
  },
});

export default ResultsScreen;
