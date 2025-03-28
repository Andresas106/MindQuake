import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, TextInput } from 'react-native';
import { Image } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../db/supabase'

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      alert('All fields are required');
      return;
    }
  
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  
    if (error) {
      alert(error.message);
    } else {
      alert('Registration successful. Verify the registration by checking your email.');
      setIsSignUp(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      alert('Email and password are required');
      return;
    }
  
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      alert(error.message);
    } else {
      navigation.navigate('MainScreen');
    }
  };
  

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.image}
      />
      <TouchableOpacity
        style={[styles.button, styles.buttonYellow]}
        onPress={() => {
          setModalVisible(true);
          setIsSignUp(true);
        }}>
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
            <Text style={styles.modalText}>{isSignUp ? "Create Account" : "Sign In"}</Text>
            <Text style={styles.modalSubText}>{isSignUp ? 'Sign up to get started' : 'Welcome back'}</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>


          {isSignUp && <Text style={styles.label}>Full Name</Text>}
          {isSignUp && <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="#A9A9A9" value={fullName} onChangeText={setFullName} />}
          
          <Text style={styles.label}>Email Address</Text>
          <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#A9A9A9"
              value={email}
              onChangeText={setEmail}
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput
              style={styles.input}
              placeholder={!isSignUp ? "Enter your password" : "Create a password"}
              placeholderTextColor="#A9A9A9"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
          />
      
          <TouchableOpacity style={styles.submitButton} onPress={isSignUp ? handleSignUp : handleSignIn}>
              <Text style={styles.submitButtonText}>{isSignUp ? 'Submit' : 'Log In'}</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          <TouchableOpacity style={styles.googleButton}>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={styles.signInText} onPress={() => {
                setIsSignUp(!isSignUp);
                setFullName('');
                setEmail('');
                setPassword('');
              } }>
                {isSignUp ? 'Sign in' : 'Register'}
              </Text>
            </Text>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={[styles.button, styles.buttonBlue]}
        onPress={() => {
          setModalVisible(true);
          setIsSignUp(false);
        }}>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  input: {
      width: "100%",
      alignSelf: 'flex-start',
      height: 50,
      borderColor: '#B0C4DE',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 15,
      backgroundColor: '#FFFFFF',
  },
  submitButton: {
      backgroundColor: '#FBC02D',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      width: '100%',
  },
  submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
  },
  orText: {
      textAlign: 'center',
      marginVertical: 10,
      fontSize: 14,
      color: '#A9A9A9',
  },
  googleButton: {
      alignItems: 'center',
      padding: 15,
      borderWidth: 1,
      borderColor: '#B0C4DE',
      borderRadius: 5,
      marginBottom: 20,
      width: '100%',
  },
  googleButtonText: {
      fontSize: 16,
      color: '#000000',
  },
  footerText: {
      textAlign: 'center',
      marginTop: 20,
  },
  signInText: {
      fontWeight: 'bold',
      color: '#007BFF',
  },
});

export default HomeScreen;