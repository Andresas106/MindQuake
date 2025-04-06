import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import useUserId from '../hooks/useUserId';
import { AntDesign } from '@expo/vector-icons';


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
            <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image source={{ uri: profilePic }} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{level}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 10,
      },
});

export default ProfileScreen;