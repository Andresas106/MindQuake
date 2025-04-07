import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import useUserId from '../hooks/useUserId';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../db/supabase'
import User from '../model/User';
import * as Progress from 'react-native-progress';


const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null); // Usamos un solo estado para el objeto User
    const userID = useUserId();

    useEffect(() => {
        const fetchUserData = async () => {
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
                setUser(userInstance);
            }
        };

        if (userID) {
            fetchUserData();
        }
    }, [userID]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => console.log("buenos dias")}>
                <AntDesign name="arrowleft" size={35} color="black" />
            </TouchableOpacity>

            {user && (
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        {/* Si profile_picture es null o undefined, usamos una imagen por defecto */}
                        <Image
                            source={{ uri: user.profile_picture }} // URL de una imagen por defecto
                            style={styles.image}
                        />
                    </TouchableOpacity>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{user.level}</Text>
                    </View>
                    <View style={styles.editBadge}>
                        <AntDesign name="edit" size={15} color="white" />
                    </View>
                </View>

            )}
            {/* Barra de progreso de XP */}
            {user && (
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {user.getCurrentXpInLevel()} / {user.calculateXpRequiredForNextLevel()} XP
                    </Text>
                    <View style={styles.progressWrapper}>
                        <Text style={styles.text}>{user.level}</Text>
                        <Progress.Bar
                            progress={user.getCurrentXpInLevel() / user.calculateXpRequiredForNextLevel()}
                            width={200}
                            height={5}
                            borderRadius={5}
                            color={'#76c7c0'}
                        />
                        <Text style={styles.text}>{user.level + 1}</Text>
                    </View>
                </View>
            )}
            {/* Nombre usuario */}
            {user && (
                <View style={styles.textContainer}>
                    <Text style={styles.nameText}>{user.full_name}</Text>
                    <Text style={styles.achievementsText}>Achievements</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //     justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 30,
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
    imageContainer: {
        width: 100, // Tamaño del círculo
        height: 100,
        borderRadius: 60, // Hace que sea un círculo
        borderWidth: 8,
        borderColor: 'lightgreen', // Borde verde
        //overflow: 'hidden', // Asegura que la imagen no sobresalga del borde
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 75,
    },
    image: {
        width: 90, // Reduce el tamaño de la imagen
        height: 90,
        resizeMode: 'cover',
        borderRadius: 45,
    },
    editBadge: {
        position: 'absolute',
        top: 0, // Lo empuja fuera del círculo
        right: -10,  // Lo empuja fuera del círculo
        backgroundColor: '#e6677a',
        paddingHorizontal: 3,
        paddingVertical: 3,
        borderRadius: 50,
        elevation: 2,
    },
    progressContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    progressWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Asegura que los textos se separen sin hacer que se estire demasiado
        width: 250, // Ancho fijo para la barra y los textos
        marginVertical: 10, // Espacio vertical entre la barra y los textos
      },
    progressText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    nameText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'black'
    },
    achievementsText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 20
    }
});

export default ProfileScreen;