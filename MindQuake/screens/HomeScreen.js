import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Image } from '@rneui/themed';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.image}
      />
      <TouchableOpacity
        style={[styles.button, styles.buttonYellow]}
        onPress={() => navigation.navigate('Details')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

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
  }
});

export default HomeScreen;
