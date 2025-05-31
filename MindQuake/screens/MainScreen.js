import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Switch, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import useUserId from '../hooks/useUserId';
import { supabase } from '../db/supabase';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const MainScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [isEnabled3, setIsEnabled3] = useState(false);
  const [level, setLevel] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const userID = useUserId();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('user')  // Asegúrate de que el nombre de la tabla es correcto
        .select('level, profile_picture') // Seleccionamos ambas columnas
        .eq('id', userID)
        .maybeSingle(); // Evita errores si no hay datos

      if (error) {
        console.error("Error al obtener los datos del usuario:", error);
      } else if (data) {
        setLevel(data.level);   // Guarda el nivel en el estado
        setProfilePic(data.profile_picture);
      }
    };

    if(userID) {
      fetchUserData();
    }
    
  }, [userID]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logoimage} />
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: profilePic }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.buttonYellow]}
        onPress={() => {
          navigation.navigate('GameSettings');
        }}>
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonBlue]}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.sliderContainer}>
              <View style={styles.switchRow}>
                <Text style={styles.sliderText}>General Volume</Text>
                <Switch
                  value={isEnabled1}
                  onValueChange={setIsEnabled1}
                  thumbColor={isEnabled1 ? 'blue' : 'gray'}
                  trackColor={{ false: '#ccc', true: '#2196F3' }}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.sliderText}>Music Volume</Text>
                <Switch
                  value={isEnabled2}
                  onValueChange={setIsEnabled2}
                  thumbColor={isEnabled2 ? 'green' : 'gray'}
                  trackColor={{ false: '#ccc', true: '#4CAF50' }}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.sliderText}>Vibration</Text>
                <Switch
                  value={isEnabled3}
                  onValueChange={setIsEnabled3}
                  thumbColor={isEnabled3 ? 'red' : 'gray'}
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
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
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
    width: 100, // Tamaño del círculo
    height: 100,
    borderRadius: 60, // Hace que sea un círculo
    borderWidth: 8,
    borderColor: '#95E752', // Borde verde
    //overflow: 'hidden', // Asegura que la imagen no sobresalga del borde
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  image: {
    width: 90, // Reduce el tamaño de la imagen
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
    bottom: 0, // Lo empuja fuera del círculo
    right: -10,  // Lo empuja fuera del círculo
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