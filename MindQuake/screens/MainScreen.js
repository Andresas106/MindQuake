import React, {useState} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Switch } from 'react-native';
import { Image } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';


const MainScreen = ({ navigation }) => {
   const [modalVisible, setModalVisible] = useState(false);
   const [isEnabled1, setIsEnabled1] = useState(false);
   const [isEnabled2, setIsEnabled2] = useState(false);
   const [isEnabled3, setIsEnabled3] = useState(false);
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logoimage}/>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/user.png')} style={styles.image} />
      </View>
      <TouchableOpacity
        style={[styles.button, styles.buttonYellow]}
        onPress={() => {
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
        onRequestClose={() =>{
          setModalVisible(false);
        } }
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
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      borderColor: 'lightgreen', // Borde verde
      overflow: 'hidden', // Asegura que la imagen no sobresalga del borde
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 50,
    },
    image: {
      width: 80, // Reduce el tamaño de la imagen
      height: 80,
      resizeMode: 'cover',
    },
  
    button: {
      width: '50%',
      padding: 15,
      borderRadius: 50,
      marginBottom: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonYellow: {
      borderColor: 'gold',
      borderWidth: 8,                               
    },
    buttonBlue: {
      borderColor: 'dodgerblue',
      borderWidth: 8,
    },
    buttonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    },
    backButton: {
      position: 'absolute',
      top: 20,
      left: 10,
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
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    sliderContainer: {
      width: '100%',
      marginTop: 20,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingVertical: 10,
    },
    sliderText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 15,
    },
  });

export default MainScreen;