import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import useUserId from '../hooks/useUserId';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../db/supabase'
import User from '../model/User';
import * as Progress from 'react-native-progress';
import Achievement from '../model/Achievement';


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
        .select(`achievement_id, unlocked_at, achievements (icon, name)`)
        .eq('user_id', userID);

      if (error) {

        console.error("Error al obtener los datos del usuario:", error);
      } else if (data) {
        const tierOrder = {
          Platinum: 0,
          Silver: 1,
          Bronze: 2,
      };

      const getTierOrder = (name) => {
          if (name.includes("Platinum")) return tierOrder.Platinum;
          if (name.includes("Silver")) return tierOrder.Silver;
          if (name.includes("Bronze")) return tierOrder.Bronze;
          return 99; // Por si no coincide
      };

      const formattedAchievements = data
          .map(item => ({
              achievement: new Achievement({
                  id: item.achievement_id,
                  name: item.achievements.name,
                  icon: item.achievements.icon,
                  unlockedAt: item.unlocked_at,
              }),
              tierOrder: getTierOrder(item.achievements.name),
          }))
          .sort((a, b) => a.tierOrder - b.tierOrder)
          .map(entry => entry.achievement); // aquí eliminamos el tier, no se guarda

      setAchievements(formattedAchievements);
      }
    }

    if (userID) {
      fetchUserData();
      fetchAchievementsUserData();
    }
  }, [userID]);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
            <AntDesign name="edit" size={20} color="white" />
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
              height={8}
              borderRadius={10}
              color={'#FF7C7C'}
            />
            <Text style={styles.text}>{user.level + 1}</Text>
          </View>
        </View>
      )}
      {/* Nombre usuario */}
      {user && (
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{user.full_name}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AchievementsOverview', { achievements })}
          >
            <Text style={styles.buttonText}>Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonYellow]}
            onPress={() => navigation.navigate('Leaderboard') 
            }>
            <Text style={styles.buttonText}>Leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonRed]}
            onPress={async () => {
              const { error } = await supabase.auth.signOut();
              if (!error) navigation.navigate('Home');
            }}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>

        </View>

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ====================
  // Main Container
  // ====================
  container: {
    flex: 1,
    backgroundColor: '#F2F1EB',
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },

  // ====================
  // Loading Indicator
  // ====================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },

  // ====================
  // Navigation Elements
  // ====================
  backButton: {
    position: 'absolute',
    top: 60,
    //left: 20,
    zIndex: 10,
  },

  // ====================
  // Profile Header
  // ====================
  imageContainer: {
    alignItems: 'center',
    marginTop: 80,
    //marginBottom: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#95E752',
  },
  levelBadge: {
    //position: 'absolute',
    bottom: 30,
    left: 30,
    backgroundColor: '#E76E63',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  editBadge: {
    //position: 'absolute',
    bottom: 145,
    left: 45,
    backgroundColor: '#E76E63',
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ====================
  // XP Progress Bar
  // ====================
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF7C7C',
    marginBottom: 8,

  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
  },
  progressLevelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF7C7C',
    minWidth: 30,
    textAlign: 'center',
  },
  text: {
    fontWeight: 'bold',
  },

  // ====================
  // User Info
  // ====================
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5,
  },
  usernameText: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 30,
  },

  // ====================
  // Achievements Section
  // ====================
  achievementsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 30,
    marginBottom: 15,
  },
  achievementsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  achievementImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#76c7c0',
  },
  noAchievementsContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#edf2f7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAchievementsText: {
    fontSize: 16,
    color: '#718096',
  },

  // ====================
  // Action Buttons
  // ====================
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    minWidth: '50px',
    width: '35%',
    paddingVertical: 15,
    borderRadius: 60,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: '#fff',
    borderWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonYellow: {
    borderColor: '#95E752',
  },
  buttonRed: {
    borderColor: '#fc8181',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
});

export default ProfileScreen;