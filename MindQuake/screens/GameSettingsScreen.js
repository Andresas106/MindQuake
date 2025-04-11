import React, { useState, useEffect } from 'react';
import {View, StyleSheet, Text, Button, ActivityIndicator, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import useUserId from '../hooks/useUserId';
import User from '../model/User';
import { supabase } from '../db/supabase';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {MaterialIcons} from '@expo/vector-icons'

const categoriesList = [
  { label: 'General', value: 'general' },
  { label: 'Ciencia', value: 'science' },
  { label: 'Historia', value: 'history' },
  { label: 'Deportes', value: 'sports' },
  { label: 'Entretenimiento', value: 'entertainment' },
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

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Hola, {user.full_name} 👋</Text>

      <Text style={styles.label}>Categorías</Text>
      <SectionedMultiSelect
        items={categoriesList}
        uniqueKey='value'
        displayKey='label'
        selectedItems={selectedCategories}
        onSelectedItemsChange={setSelectedCategories}
        IconRenderer={MaterialIcons}
        single={false}>

      </SectionedMultiSelect>

      <Text style={styles.label}>Dificultad</Text>
      <View style={styles.row}>
        {['easy', 'medium', 'hard'].map((level) => (
          <Button
            key={level}
            title={level.toUpperCase()}
            color={difficulty === level ? '#6200ee' : '#aaa'}
            onPress={() => setDifficulty(level)}
          />
        ))}
      </View>

      <Text style={styles.label}>Número de preguntas: {questionCount}</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={5}
        maximumValue={20}
        step={5}
        value={questionCount}
        onValueChange={setQuestionCount}
        minimumTrackTintColor="#6200ee"
        maximumTrackTintColor="#000000"
      />

      <View style={styles.buttonContainer}>
        <Button title="Comenzar Trivia" onPress={startGame} color="#6200ee" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiSelect: {
    marginBottom: 20,
  },
});

export default GameSettingsScreen;
