import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Switch, Image } from 'react-native';
import SoundButton from '../SoundButton';
import { AntDesign } from '@expo/vector-icons';
import useUserId from '../hooks/useUserId';
import { supabase } from '../db/supabase';
import { useAudio } from '../AudioProvider';

const MainScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [level, setLevel] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const userID = useUserId();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('user')
        .select('level, profile_picture')
        .eq('id', userID)
        .maybeSingle();

      if (error) {
        console.error("Error al obtener los datos del usuario:", error);
      } else if (data) {
        setLevel(data.level);
        setProfilePic(data.profile_picture);
      }
    };

    if (userID) {
      fetchUserData();
    }
  }, [userID]);

  const {
    vibrationEnabled,
    toggleVibration,
    isSoundEnabled,
    toggleSoundEnabled,
  } = useAudio();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logoimage} />

      <View style={styles.imageContainer}>
        <SoundButton onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: profilePic }} style={styles.image} />
        </SoundButton>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      </View>

      <SoundButton
        style={[styles.button, styles.buttonYellow]}
        onPress={() => navigation.navigate('GameSettings')}>
        <Text style={styles.buttonText}>Play</Text>
      </SoundButton>

      <SoundButton
        style={[styles.button, styles.buttonBlue]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Settings</Text>
      </SoundButton>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.settingsTitle}>Settings</Text>

            <SoundButton style={styles.backButton} onPress={() => setModalVisible(false)}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </SoundButton>

            <View style={styles.sliderContainer}>
            <View style={styles.switchRow}>
              <Text style={styles.sliderText}>Sound Effects</Text>
              <Switch
                value={isSoundEnabled}
                onValueChange={toggleSoundEnabled}
                thumbColor={isSoundEnabled ? 'blue' : 'gray'}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.sliderText}>Vibration</Text>
              <Switch
                value={vibrationEnabled}
                onValueChange={toggleVibration}
                thumbColor={vibrationEnabled ? 'red' : 'gray'}
                trackColor={{ false: '#ccc', true: '#F44336' }}
              />
            </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F1EB',
  },
  logoimage: {
    width: 200,
    height: 100,
    marginBottom: 50,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#95E752',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 45,
  },
  button: {
    width: '50%',
    paddingVertical: 15,
    borderRadius: 60,
    marginBottom: 45,
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
  buttonYellow: {
    borderColor: '#95E752',
  },
  buttonBlue: {
    borderColor: '#fc8181',
  },
  buttonText: {
    fontFamily: 'Rubik_700Bold',
    color: 'black',
    fontSize: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    width: 326,
  },
  settingsTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 22,
    marginBottom: 15,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 20,
  },
  switchRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  sliderText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 18,
    marginRight: 15,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: '#e6677a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 2,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MainScreen;
