import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import useUserId from '../hooks/useUserId';
import User from '../model/User';
import { supabase } from '../db/supabase';

const EditProfileScreen = ({ navigation }) => {
    const [profilePicture, setProfilePicture] = useState(''); // Imagen actual del perfil
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const userID = useUserId();
    const [avatarList, setAvatarList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

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

    useEffect(() => {
        const fetchAvatars = async () => {
            const { data, error } = await supabase.storage.from('avatars').list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });
        
            if (error) {
                console.error('Error al listar archivos en avatars:', error.message);
                return;
            }
        
            if (!data || data.length === 0) {
                console.warn('No se encontraron archivos en el bucket avatars.');
                return;
            }
        
            const avatarURLs = data.map(file => {
                const publicUrl = supabase.storage.from('avatars').getPublicUrl(file.name).data.publicUrl;
                return publicUrl;
            });
            setAvatarList(avatarURLs);
        };

        fetchAvatars();
    }, []);
    
    

    const handleSave = async () => {
        try {
            await setAuthChanges();
            await setBDChanges();
            alert('User Profile updated correctly');
            navigation.navigate('Profile');
        } catch (error) {
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


    if (profilePicture == '' && fullName == '' && email == '') {
            return (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
              </View>
            );
          }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={30} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                    source={{ uri: profilePicture }}
                    style={styles.profilePicture}
                />
            </TouchableOpacity>

            {/*MODAL*/}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#fff', margin: 20, borderRadius: 10, padding: 20 }}>
                        <Text style={{ fontSize: 18, marginBottom: 10 }}>Choose an Avatar</Text>
                        <FlatList
                            data={avatarList}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={3}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => {
                                    setProfilePicture(item);
                                    setModalVisible(false);
                                }}>
                                    <Image source={{ uri: item }} style={styles.avatarImage} />
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            </Modal>
            {/** */}

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
    // ====================
    // Main Container
    // ====================
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F2F1EB',
      padding: 25,
      paddingTop: 60,
    },
  
    // ====================
    // Loading Indicator
    // ====================
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
    },
  
    // ====================
    // Navigation Elements
    // ====================
    backButton: {
      position: 'absolute',
      top: 40,
      left: 20,
      backgroundColor: '#e9ecef',
      borderRadius: 20,
      padding: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  
    // ====================
    // Profile Picture
    // ====================
    profilePicture: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 30,
      borderWidth: 3,
      borderColor: '#76c7c0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
  
    // ====================
    // Form Elements
    // ====================
    inputContainer: {
      width: '100%',
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: '#495057',
      marginLeft: 5,
    },
    input: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#dee2e6',
      fontSize: 16,
      color: '#212529',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
  
    // ====================
    // Save Button
    // ====================
    saveButton: {
      backgroundColor: '#EFBC5E',
      padding: 16,
      borderRadius: 12,
      marginTop: 25,
      width: '100%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 4,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
  
    // ====================
    // Avatar Modal
    // ====================
    modalContainer: {
      flex: 1, 
      backgroundColor: 'rgba(0,0,0,0.7)', 
      justifyContent: 'center'
    },
    modalContent: {
      backgroundColor: '#fff',
      margin: 25,
      borderRadius: 15,
      padding: 20,
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#212529',
      textAlign: 'center',
    },
    avatarImage: {
      width: 90,
      height: 90,
      margin: 8,
      borderRadius: 45,
      borderWidth: 2,
      borderColor: '#76c7c0',
    },
  });

export default EditProfileScreen;