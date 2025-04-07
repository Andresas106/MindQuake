import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Animated } from 'react-native';
import useUserId from '../hooks/useUserId';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../db/supabase'
import User from '../model/User';


const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null); // Usamos un solo estado para el objeto User
    const [progress] = useState(new Animated.Value(0));
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

    // Calcular el progreso de la XP para la animación
    useEffect(() => {
        if (user) {
            const currentXp = user.xp;
            const xpForNextLevel = user.calculateXpRequiredForNextLevel();

            // Normalizamos la XP y la pasamos a un valor entre 0 y 1 para la animación
            const progressPercentage = currentXp / xpForNextLevel;
            Animated.timing(progress, {
                toValue: progressPercentage, // Progreso final
                duration: 1000, // Duración de la animación
                useNativeDriver: false // Usamos false ya que estamos manipulando el ancho de la vista
            }).start();
        }
    }, [user]); // Se ejecuta cuando el objeto user cambia

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
            {/* Barra de progreso de la XP */}
            {user && (
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>
                                {user.xp} / {user.calculateXpRequiredForNextLevel()} XP
                            </Text>
                            <View style={styles.progressBarBackground}>
                                <Animated.View
                                    style={[styles.progressBar, {
                                        width: progress.interpolate({
                                            inputRange: [0, 250],
                                            outputRange: ['0%', '100%'],
                                        })
                                    }]}
                                />
                            </View>
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
        marginTop: 20,
    },
    progressText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    progressBarBackground: {
        width: '80%',
        height: 10,
        backgroundColor: 'gray',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#76c7c0',
    },
});

export default ProfileScreen;