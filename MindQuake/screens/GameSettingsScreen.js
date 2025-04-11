import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import useUserId from '../hooks/useUserId';
import User from '../model/User';
import { supabase } from '../db/supabase';


const GameSettingsScreen = ({ navigation }) => {
    const [setUser, user] = useState(null);
    const userID = useUserId();

    useEffect(() => {
        const fetchUserData = async () => {
          const { data, error } = await supabase
            .from('user')  // Asegúrate de que el nombre de la tabla es correcto
            .select() // Seleccionamos ambas columnas
            .eq('id', userID)
            .maybeSingle(); // Evita errores si no hay datos
    
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
    
        if(userID) {
          fetchUserData();
        }
        
      }, [userID]);


  return (
    <View style={styles.container}>

    </View>
  );
};

const styles = StyleSheet.create({
});

export default GameSettingsScreen;