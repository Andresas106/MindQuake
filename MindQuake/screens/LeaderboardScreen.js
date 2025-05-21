import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import useUserId from '../hooks/useUserId';
import { supabase } from '../db/supabase';
import User from '../model/User';

const LeaderboardScreen = () => {
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
      <View style={styles.userInfo}>
        <Text style={styles.username}>
          #{item.position} - {item.full_name} (Level {item.level})
        </Text>
        {item.profile_picture ? (
          <Image source={{ uri: item.profile_picture }} style={styles.avatar} />
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        ListHeaderComponent={
          <>
            {currentUserData && (
              <View style={styles.currentUserCard}>
                <Text style={styles.username}>
                  #{currentUserData.position} - {currentUserData.full_name} (Level {currentUserData.level})
                </Text>
                {currentUserData.profile_picture ? (
                  <Image
                    source={{ uri: currentUserData.profile_picture }}
                    style={styles.avatar}
                  />
                ) : null}
              </View>
            )}
            <Text style={styles.podiumTitle}>🏆 Top 10 Players</Text>
          </>
        }
        data={leaderboard}
        keyExtractor={item => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121212',
    
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 100,
  },
  userContainer: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  highlightedUser: {
    borderColor: '#5c9ded',
    borderWidth: 2,
    backgroundColor: '#2e3a59',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  podiumTitle: {
    fontSize: 22,
    color: '#f2f2f2',
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
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
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default LeaderboardScreen;
