import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const EditProfileScreen = ({navigation}) => {
    const [profilePicture, setProfilePicture] = useState(''); // Imagen actual del perfil
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity>
            <Image
                source={{ uri: profilePicture }}
                style={styles.profilePicture}
            />
        </TouchableOpacity>

        {/* Campo para editar el apodo */}
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Change Full Name</Text>
            <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Enter your new full name"
            />
        </View>

        {/* Campo para editar el correo electrónico */}
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Change Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your new email"
                keyboardType="email-address"
            />
        </View>

        {/* Campo para editar la contraseña */}
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Change Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your new password"
                secureTextEntry={true}
            />
        </View>

        {/* Botón para guardar los cambios */}
        <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 10,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#76c7c0',
    },
    inputContainer: {
        width: '90%',
        marginVertical: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        width: '90%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditProfileScreen;