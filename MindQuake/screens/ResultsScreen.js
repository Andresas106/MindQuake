import { View, Text, StyleSheet, Image} from 'react-native';
import SoundButton from '../SoundButton';

const ResultsScreen = ({ route, navigation }) => {
  const { user, totalQuestions, newCorrectAnswers, unlockedAchievements = [] } = route.params;

  const xpGained = user.xp;
  const level = user.level;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>

      <Text style={styles.resultText}>
        Correct answers: <Text style={styles.highlight}>{newCorrectAnswers}</Text> of <Text style={styles.highlight}>{totalQuestions}</Text>
      </Text>

      <Text style={styles.resultText}>
        Actual Level: <Text style={styles.highlight}>{level}</Text>
      </Text>
      <Text style={styles.resultText}>
        Total XP: <Text style={styles.highlight}>{xpGained}</Text>
      </Text>

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
        <SoundButton
          style={[styles.button, styles.buttonPurple]}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Home</Text>
        </SoundButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#F2F1EB',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 28,
    marginBottom: 25,
    color: '#2d3748',
    fontFamily: 'Rubik_700Bold',
  },
  resultText: {
    fontSize: 20,
    marginVertical: 8,
    color: '#2d3748',
    fontFamily: 'Rubik_400Regular',
  },
  highlight: {
    fontFamily: 'Rubik_700Bold',
    color: '#fc8181',
  },
  achievementTitle: {
    fontSize: 22,
    marginTop: 30,
    marginBottom: 15,
    color: '#444',
    fontFamily: 'Rubik_700Bold',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  
  button: {
    width: '70%',
    paddingVertical: 15,
    borderRadius: 60,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F1EB',
    borderWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPurple: {
    borderColor: '#fc8181',
  },
  buttonText: {
    color: '#2d3748',
    fontSize: 18,
    fontFamily: 'Rubik_700Bold',
  },
});

export default ResultsScreen;
