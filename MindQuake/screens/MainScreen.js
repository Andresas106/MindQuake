import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Image } from '@rneui/themed';


const MainScreen = ({ navigation }) => {

  

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.image}
      />
      <TouchableOpacity
        style={[styles.button, styles.buttonYellow]}
        onPress={() => {
        }}>
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonBlue]}
        onPress={() => {
        }}>
        <Text style={styles.buttonText}>Settings</Text>
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
  });

export default MainScreen;