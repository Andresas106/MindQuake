import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image} from 'react-native';
import SoundButton from '../SoundButton';
import useUserId from '../hooks/useUserId';
import { supabase } from '../db/supabase';
import User from '../model/User';
import { AntDesign } from '@expo/vector-icons';

const LeaderboardScreen = ({ navigation }) => {
  const userId = useUserId();
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);

  const fetchLeaderboardData = async () => {
    if (!userId) {
      console.warn("userId aún no está disponible.");
      return;
    }

    const { data, error } = await supabase
      .from('user')
      .select('id, full_name, level, email, profile_picture, created_at')
      .order('xp', { ascending: false });

    if (error) {
      console.error('Error al obtener el leaderboard:', error);
      return;
    }

    if (data) {
      const enrichedUsers = data.map((userData, index) => {
        const user = new User(userData);
        return {
          ...user,
          position: index + 1,
          isCurrentUser: user.id === userId,
        };
      });

      const currentUser = enrichedUsers.find(u => u.isCurrentUser);
      const topTen = enrichedUsers.slice(0, 10);

      setLeaderboard(topTen);
      setCurrentUserData(currentUser);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [userId]);

  const renderUser = ({ item }) => (
    <View
      style={[
        styles.userContainer,
        item.isCurrentUser && styles.highlightedUser,
      ]}
    >
      {item.profile_picture ? (
        <Image source={{ uri: item.profile_picture }} style={styles.avatar} />
      ) : null}
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.full_name}</Text>
        <Text style={styles.level}>Level {item.level}</Text>
      </View>
      <Text style={styles.rank}>#{item.position}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
        <SoundButton style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={35} color="black" />
        </SoundButton>
        <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        ListHeaderComponent={
          <>
            {currentUserData && (
              <View style={[
                styles.userContainer,
                styles.highlightedUser,
              ]}>
                {currentUserData.profile_picture ? (
                  <Image source={{ uri: currentUserData.profile_picture }} style={styles.avatar} />
                ) : null}
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{currentUserData.full_name}</Text>
                  <Text style={styles.level}>Level {currentUserData.level}</Text>
                </View>
                <Text style={styles.rank}>#{currentUserData.position}</Text>
              </View>
            )}
            <Text style={styles.podiumTitle}>🏆 Top 10 Players</Text>
          </>
        }
        data={leaderboard}
        keyExtractor={item => item.id}
        renderItem={renderUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 90,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 27,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10
  },
  backButton: {
    position: 'absolute',
    zIndex: 100,
    top: 80,
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f4', // fondo crema claro
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  highlightedUser: {
    borderColor: '#5c9ded',
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 16,
    color: '#333',
  },
  level: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: '#666',
  },
  rank: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 18,
    color: '#e0a200',
  },
  currentUserCard: {
    backgroundColor: '#292929',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#888',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#00bcd4', // azul suave
    marginRight: 12,
  },
  podiumTitle: {
  fontFamily: 'Rubik_700Bold',
  fontSize: 18,
  textAlign: 'center',
  marginVertical: 16,
  color: '#333',
},
});

export default LeaderboardScreen;
