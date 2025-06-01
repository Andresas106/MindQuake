import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import SoundButton from '../SoundButton';
import Slider from '@react-native-community/slider';
import useUserId from '../hooks/useUserId';
import User from '../model/User';
import { supabase } from '../db/supabase';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const categoriesList = [
  { label: 'Arts & Literature', value: 'arts_and_literature' },
  { label: 'Film & TV', value: 'film_and_tv' },
  { label: 'History', value: 'history' },
  { label: 'Science', value: 'science' },
  { label: 'Geography', value: 'geography' },
  { label: 'Sport & Leisure', value: 'sport_and_leisure' },
];

const GameSettingsScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('easy');
  const userID = useUserId();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('user')
        .select()
        .eq('id', userID)
        .maybeSingle();

      if (error) {
        console.error('Error al obtener los datos del usuario:', error);
      } else if (data) {
        const userInstance = new User({
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          profile_picture: data.profile_picture,
          xp: data.xp,
          level: data.level,
          created_at: data.created_at,
        });
        setUser(userInstance);
      }
    };

    if (userID) {
      fetchUserData();
    }
  }, [userID]);

  const startGame = () => {
    if (selectedCategories.length === 0) {
      alert('Please, select al least one category.');
      return;
    }

    navigation.navigate('Quiz', {
      categories: selectedCategories,
      questionCount,
      difficulty,
      user,
    });
  };

  const selectAllCategories = () => {
    const allCategoryValues = categoriesList.map((category) => category.value);
    setSelectedCategories(allCategoryValues);
  };

  const deselectAllCategories = () => {
    setSelectedCategories([]);
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.container}>
      <SoundButton style={styles.backButton} onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={35} color="black" />
      </SoundButton>

      <View style={styles.card}>
  <Text style={styles.label}>Categories</Text>

  <View style={styles.actionRow}>
    <SoundButton style={[styles.button, styles.buttonBlue]} onPress={selectAllCategories}>
      <Text style={styles.buttonText}>Select All</Text>
    </SoundButton>
    <SoundButton style={[styles.button, styles.buttonRed]} onPress={deselectAllCategories}>
      <Text style={styles.buttonText}>Deselect All</Text>
    </SoundButton>
  </View>

  <SectionedMultiSelect
    items={categoriesList}
    uniqueKey="value"
    displayKey="label"
    selectedItems={selectedCategories}
    onSelectedItemsChange={setSelectedCategories}
    IconRenderer={MaterialIcons}
    single={false}
    showDropDowns={false}
    styles={{
      selectToggle: {
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#e0f7fa',
        borderColor: '#00bcd4',
        borderWidth: 1,
        marginTop: 10,
      },
      selectToggleText: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 16,
        color: '#00796b',
      },
      chipsWrapper: {
        marginTop: 10,
        flexWrap: 'wrap',
      },
      chipContainer: {
        backgroundColor: '#ffecb3',
        borderColor: '#ffa000',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 4,
      },
      chipText: {
        fontFamily: 'Rubik_400Regular',
        color: '#e65100',
        fontWeight: '600',
      },
      itemText: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 15,
        color: '#37474f',
      },
      subItemText: {
        fontFamily: 'Rubik_400Regular',
        fontSize: 14,
        color: '#607d8b',
      },
      selectedItemText: {
        fontFamily: 'Rubik_400Regular',
        color: '#4caf50',
      },
      selectedSubItemText: {
        fontFamily: 'Rubik_400Regular',
        color: '#4caf50',
      },
    }}
  />
</View>


      <View style={styles.card}>
      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.row}>
          {['easy', 'medium', 'hard'].map((level) => {
            const getSelectedStyle = () => {
              switch (level) {
                case 'easy':
                  return { backgroundColor: '#4CAF50' };
                case 'medium':
                  return { backgroundColor: '#7E57C2' }; 
                case 'hard':
                  return { backgroundColor: '#E53935' }; 
                default:
                  return {};
              }
            };

            const isSelected = difficulty === level;

            return (
              <SoundButton
                key={level}
                style={[
                  styles.button,
                  isSelected ? getSelectedStyle() : styles.buttonGray,
                  { marginHorizontal: 5, flex: 1 },
                ]}
                onPress={() => setDifficulty(level)}
              >
                <Text style={styles.buttonText}>{level.toUpperCase()}</Text>
              </SoundButton>
            );
          })}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>
          Number of Questions: <Text style={styles.highlight}>{questionCount}</Text>
        </Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={5}
          maximumValue={20}
          step={5}
          value={questionCount}
          onSlidingComplete={setQuestionCount}
          minimumTrackTintColor="#03A9F4"  
          maximumTrackTintColor="#03A9F4"  
          thumbTintColor="#03A9F4"          
        />
      </View>


      <View style={styles.startButtonWrapper}>
        <SoundButton style={[styles.button, styles.buttonPurple, { paddingVertical: 12 }]} onPress={startGame}>
          <Text style={[styles.buttonText, { fontSize: 18 }]}>Start Game</Text>
        </SoundButton>
      </View>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F1EB',
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: 'center',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  card: {
    padding: 15,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },

  label: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 26,
    marginBottom: 10,
    color: '#444',
    textAlign: 'center',
  },

  bold: {
    fontWeight: 'bold',
    color: '#6200ee',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    width: '100%',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '110%',
    marginTop: 10,
  },

  startButtonWrapper: {
    marginTop: 30,
    width: '70%',
  },

  button: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },

  buttonBlue: {
    backgroundColor: '#4D96FF',
  },

  buttonRed: {
    backgroundColor: '#FF5C5C',
  },

  buttonPurple: {
    backgroundColor: '#D81B60',
  },

  buttonGray: {
    backgroundColor: '#bbb',
  },

  buttonText: {
    fontFamily: 'Rubik_700Bold',
    color: 'white',
  },
});

export default GameSettingsScreen;
