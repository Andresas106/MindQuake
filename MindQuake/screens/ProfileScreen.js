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
    const [achievements, setAchievements] = useState([]);

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

        const fetchAchievementsUserData = async () => {
            const { data, error } = await supabase
                .from('user_achievements')
                .select(`achievement_id, unlocked_at, achievements (icon)`)
                .eq('user_id', userID);
            if (error) {
                console.error("Error al obtener los datos del usuario:", error);
            } else if (data) {
                const formattedAchievements = data.map(item => new Achievement({
                    id: item.achievement_id,
                    icon: item.achievements.icon,
                    unlockedAt: item.unlocked_at,
                }));
                setAchievements(formattedAchievements);
            }
        }

        if (userID) {
            fetchUserData();
            fetchAchievementsUserData();
        }
    }, [userID]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Main')}>
                <AntDesign name="arrowleft" size={35} color="black" />
            </TouchableOpacity>

            {user && (
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
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
                    <TouchableOpacity
                        style={styles.achievementsContainer}
                        onPress={() => /*navigation.navigate('AchievementsOverview', { achievements })*/ console.log('fuck this')}
                    >
                        {achievements.length > 0 ? (
                            <View style={styles.achievementsGrid}>
                                {achievements.slice(0, 3).map((achievement, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: achievement.icon }}
                                        style={styles.achievementImage}
                                    />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.noAchievementsContainer}>
                                <Image
                                    source={{ uri: 'URL_ILUSTRACION_SIN_LOGROS' }}
                                    style={styles.noAchievementsImage}
                                />
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                            style={[styles.button, styles.buttonYellow]}
                            onPress={() => {
                            }}>
                            <Text style={styles.buttonText}>Leaderboard</Text>
                          </TouchableOpacity>
                    
                          <TouchableOpacity
                            style={[styles.button, styles.buttonRed]}
                            onPress={async () => {
                                const {error} = await supabase.auth.signOut();
                                if(!error) navigation.navigate('Home');
                            }}>
                            <Text style={styles.buttonText}>Sign Out</Text>
                          </TouchableOpacity>

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
    },
    achievementsContainer: {
        alignItems: 'center',
        width: '100%',
    },
    achievementsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 10,
    },
    achievementImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#76c7c0',
    },
    noAchievementsContainer: {
        alignItems: 'center',
        marginTop: 20,
        width: 200,
        height: 100,
        backgroundColor: '#d3dbe8'
    },
    noAchievementsImage: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    noAchievementsText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
    },
    buttonYellow: {
        borderColor: 'gold',
        borderWidth: 8,
      },
      buttonRed: {
        borderColor: 'red',
        borderWidth: 8,
      },
      buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
      },
      button: {
        width: '50%',
        padding: 15,
        borderRadius: 50,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
      },
});

export default ProfileScreen;