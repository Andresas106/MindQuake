import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import useUserId from '../hooks/useUserId';
import User from '../model/User';
import { supabase } from '../db/supabase';

const EditProfileScreen = ({navigation}) => {
    const [profilePicture, setProfilePicture] = useState(''); // Imagen actual del perfil
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const userID = useUserId();

    const setAuthChanges = async () => {
        const updates = {};
        if (email) updates.email = email;
        if (password) updates.password = password;
    
        if (Object.keys(updates).length === 0) return;
    
        const { data, error } = await supabase.auth.updateUser(updates);
    
        if (error) {
            console.error('Error updating auth:', error);
            throw error;
        }
    
        return data;
    }

    const setBDChanges = async () => {
        const updates = {
            full_name: fullName,
            profile_picture: profilePicture,
            email: email // <- también actualizamos el email aquí
        };
    
        const { error } = await supabase
            .from('user')
            .update(updates)
            .eq('id', userID);
    
        if (error) {
            console.error('Error al actualizar base de datos:', error);
            throw error;
        }
    }

    const handleSave = async () =>{
        try {
            await setAuthChanges();
            await setBDChanges();
            alert('User Profile updated correctly');
            navigation.goBack();
        }catch(error) {
            alert('Error updating the user data');
        }
    }

        useEffect(() => {
            const fetchUserDataBD = async () => {
                const { data, error } = await supabase
                    .from('user')  // Asegúrate de que el nombre de la tabla es correcto
                    .select()
                    .eq('id', userID)
                    .single(); // Evita errores si no hay datos
    
                if (error) {
                    console.error("Error al obtener los datos del usuario:", error);
                } else if (data) {
                    const userInstance = new User({
                        id: data.id,
                        full_name: data.full_name,
                        email: data.email,
                        profile_picture: data.profile_picture,
                        xp: data.xp,
                        level: data.level,
                        created_at: data.created_at
                    });
                    setProfilePicture(userInstance.profile_picture);
                    setFullName(userInstance.full_name);
                    setEmail(userInstance.email);
                }
            };
    
            if (userID) {
                fetchUserDataBD();
            }
        }, [userID]);

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
                value={fullName}
                onChangeText={setFullName}
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
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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