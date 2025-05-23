import { View, Text, StyleSheet, Button, Image } from 'react-native';

const ResultsScreen = ({ route, navigation }) => {
  const { user, totalQuestions, newCorrectAnswers, unlockedAchievements = [] } = route.params;

  const xpGained = user.xp; // ya está actualizado
  const level = user.level;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>

      <Text style={styles.resultText}>
        Correct answers: {newCorrectAnswers} of {totalQuestions}
      </Text>

      <Text style={styles.resultText}>Actual Level: {level}</Text>
      <Text style={styles.resultText}>Total XP: {xpGained}</Text>

      {unlockedAchievements.length > 0 && (
        <>
          <Text style={styles.achievementTitle}>Unlocked Achievements</Text>
          <View style={styles.achievementsContainer}>
            {unlockedAchievements.map((achievement) => (
              <Image
                key={achievement.id}
                source={{ uri: achievement.icon }}
                style={styles.achievementIcon}
              />
            ))}
          </View>
        </>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Home"
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ee',
  },
  resultText: {
    fontSize: 18,
    marginVertical: 5,
  },
  achievementTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#444',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    margin: 5,
  },
  buttonContainer: {
    marginTop: 30,
    width: '80%',
  },
});

export default ResultsScreen;
