import React, {useState, useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import useUserId from '../hooks/useUserId';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../db/supabase'


const ProfileScreen = ({ navigation }) => {
    const [level, setLevel] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [xp, setXp] = useState(null);
    const [full_name, setFullName] = useState(null);

    const userID = useUserId();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data, error } = await supabase
                .from('user')  // Asegúrate de que el nombre de la tabla es correcto
                .select('level, profile_picture, xp, full_name') // Seleccionamos ambas columnas
                .eq('id', userID)
                .maybeSingle(); // Evita errores si no hay datos

            if (error) {
                console.error("Error al obtener los datos del usuario:", error);
            } else if (data) {
                setLevel(data.level);   // Guarda el nivel en el estado
                setProfilePic(data.profile_picture);
                setXp(data.xp);
                setFullName(data.full_name);
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
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image source={{ uri: profilePic }} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{level}</Text>
                </View>
                <View style={styles.editBadge}>
                <AntDesign name="edit" size={15} color="white" />
                </View>
            </View>
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
});

export default ProfileScreen;