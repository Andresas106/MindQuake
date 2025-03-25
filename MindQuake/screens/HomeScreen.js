import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal } from 'react-native';
import { Image } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.image}
      />
      <TouchableOpacity
        style={[styles.button, styles.buttonYellow]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Create Account</Text>
            <Text style={styles.modalSubText}>Sign up to get started</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={[styles.button, styles.buttonBlue]}
        onPress={() => navigation.navigate('AnotherScreen')}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 50,
  },

  button: {
    width: '50%',
    padding: 15,
    borderRadius: 50,  // Border radius para los botones
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonYellow: {
    borderColor: 'gold',        // Borde dorado
    borderWidth: 8,                               
  },
  buttonBlue: {
    borderColor: 'dodgerblue', // Borde azul
    borderWidth: 8,            // Ancho del borde
  },
  buttonText: {
    color: 'black',             // Color del texto
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 30,
    marginBottom: 10,
    marginLeft: 15,
    fontWeight: "bold"
  },

  modalSubText: {
    fontSize: 18,
    marginTop: 10,
    color: "gray",
  },

  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
  },
});

export default HomeScreen;
