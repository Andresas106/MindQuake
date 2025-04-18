import React, { useState, useEffect } from 'react';
import {View, StyleSheet, Text, Button, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import useUserId from '../hooks/useUserId';
import User from '../model/User';
import { supabase } from '../db/supabase';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {MaterialIcons} from '@expo/vector-icons'

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
      alert('Por favor, selecciona al menos una categoría.');
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
    const allCategoryValues = categoriesList.map(category => category.value);
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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Categories</Text>
        <View style={styles.actionRow}>
        <Button title="Select All" onPress={selectAllCategories} color="#03dac5" />
        <Button title="Deselect All" onPress={deselectAllCategories} color="#cf6679" />
      </View>
        <SectionedMultiSelect
          items={categoriesList}
          uniqueKey='value'
          displayKey='label'
          selectedItems={selectedCategories}
          onSelectedItemsChange={setSelectedCategories}
          IconRenderer={MaterialIcons}
          single={false}
          showDropDowns={false}
          styles={{
            selectToggle: { padding: 10, borderRadius: 8, backgroundColor: '#f0f0f0' },
            chipsWrapper: { marginTop: 10 },
            itemText: { fontSize: 14 },
          }}
        />
      </View>
  
      <View style={styles.card}>
        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.row}>
          {['easy', 'medium', 'hard'].map((level) => (
            <Button
              key={level}
              title={level.toUpperCase()}
              color={difficulty === level ? '#6200ee' : '#bbb'}
              onPress={() => setDifficulty(level)}
            />
          ))}
        </View>
      </View>
  
      <View style={styles.card}>
        <Text style={styles.label}>Number of Questions: <Text style={styles.bold}>{questionCount}</Text></Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={5}
          maximumValue={20}
          step={5}
          value={questionCount}
          onSlidingComplete={setQuestionCount}
          minimumTrackTintColor="#6200ee"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#6200ee"
        />
      </View>
  
      <View style={styles.startButtonWrapper}>
        <Button title="Start Game" onPress={startGame} color="#6200ee" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  card: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    marginTop: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#444',
  },
  bold: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  startButtonWrapper: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameSettingsScreen;
