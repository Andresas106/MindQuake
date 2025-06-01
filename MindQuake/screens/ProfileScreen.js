import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, ActivityIndicator } from 'react-native';
import SoundButton from '../SoundButton';
import useUserId from '../hooks/useUserId';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../db/supabase'
import User from '../model/User';
import * as Progress from 'react-native-progress';
import Achievement from '../model/Achievement';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null); 
  const userID = useUserId();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('user')  
        .select()
        .eq('id', userID)
        .single(); 

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
          return 99; 
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
          .map(entry => entry.achievement); 

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
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.container}>
      <SoundButton style={styles.backButton} onPress={() => navigation.navigate('Main')}>
        <AntDesign name="arrowleft" size={35} color="black" />
      </SoundButton>
      {user && (
        <View style={styles.imageContainer}>
          <SoundButton onPress={() => navigation.navigate('EditProfile')}>
            <Image
              source={{ uri: user.profile_picture }} 
              style={styles.image}
            />
          </SoundButton>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{user.level}</Text>
          </View>
          <View style={styles.editBadge}>
            <AntDesign name="edit" size={20} color="white" />
          </View>
          <Text style={styles.nameText}>{user.full_name}</Text>
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
      {/* Usuario */}
      {user && (
        <View style={styles.textContainer}>
          
          <SoundButton
            style={[styles.button, styles.buttonBlue]}
            onPress={() => navigation.navigate('AchievementsOverview', { achievements })}
          >
            <Text style={styles.buttonText}>Achievements</Text>
          </SoundButton>
          <SoundButton
            style={[styles.button, styles.buttonYellow]}
            onPress={() => navigation.navigate('Leaderboard') 
            }>
            <Text style={styles.buttonText}>Leaderboard</Text>
          </SoundButton>

          <SoundButton
            style={[styles.button, styles.buttonRed]}
            onPress={async () => {
              const { error } = await supabase.auth.signOut();
              if (!error) navigation.navigate('Home');
            }}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </SoundButton>

        </View>
        

      )}
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // ====================
  // Main Container
  // ====================
  container: {
    flex: 1,
    backgroundColor: '#F2F1EB',
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
  // Profile Header
  // ====================
  imageContainer: {
    alignItems: 'center',
    marginTop: 120,
    //marginBottom: 10,
  },
  image: {
    marginTop: 30,
    marginBottom: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#95E752',
  },
  levelBadge: {
    //position: 'absolute',
    bottom: -20,
    left: 40,
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
    fontFamily: 'Rubik_700Bold',
    fontSize: 14,
    color: '#fff',
  },
  editBadge: {
    //position: 'absolute',
    bottom: 100,
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
    fontFamily: 'Rubik_700Bold',
    fontSize: 16,
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
    minWidth: 30,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Rubik_700Bold',
  },

  // ====================
  // User Info
  // ====================
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  nameText: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 34,
    color: '#2d3748',
    marginBottom: 5,
    
  },
  usernameText: {
    color: '#718096',
    marginBottom: 30,
  },

  // ====================
  // Achievements Section
  // ====================
  achievementsText: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 20,
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
    fontFamily: 'Rubik_700Bold',
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
    width: '50%',
    paddingVertical: 15,
    borderRadius: 60,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F1EB',
    borderWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonBlue: {
    borderColor: '#63B9E7',
  },
  buttonYellow: {
    borderColor: '#95E752',
  },
  buttonRed: {
    borderColor: '#fc8181',
  },
  buttonText: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 20,
    color: '#2d3748',
  },
});

export default ProfileScreen;