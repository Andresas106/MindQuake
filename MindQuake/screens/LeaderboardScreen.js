import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import useUserId from '../hooks/useUserId';
import { supabase } from '../db/supabase';



const LeaderboardScreen = () => {
    const userId = useUserId();
    const [leaderboard, setLeaderboard] = useState([]);


    const fetchLeaderboardData = async () => {
         if (!userId) {
            console.warn("userId aún no está disponible.");
            return;
        }

        const { data, error } = await supabase
            .from('user')
            .select('id, full_name, xp')
            .order('xp', { ascending: false });

        if (error) {
            console.error('Error al obtener el leaderboard:', error);
            return;
        }

        if (data) {
            console.log("Usuario uid:" + userId);
            const userIndex = data.findIndex(user => user.id == userId);

            if (userIndex === -1) {
                console.warn('Usuario actual no encontrado.');
                setLeaderboard(data.map((user, index) => ({
                    ...user,
                    position: index + 1,
                    isCurrentUser: false,
                })));
                return;
            }

            const currentUser = {
                ...data[userIndex],
                position: userIndex + 1,
                isCurrentUser: true
            };

            console.log("aqui llego xd");

            const otherUsers = data
                .filter((_, index) => index !== userIndex)
                .map((user, index) => ({
                    ...user,
                    position: index >= userIndex ? index + 2 : index + 1,
                    isCurrentUser: false,
                }));

                console.log("aqui llego x2 xd");

            setLeaderboard([currentUser, ...otherUsers]);
            console.log("leader_" + leaderboard);
        }
    }

    useEffect(() => {
        fetchLeaderboardData();
    }, [userId]);


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {leaderboard.map(user => (
                <View
                    key={user.id}
                    style={[
                        styles.userContainer,
                        user.isCurrentUser && styles.currentUser,
                    ]}
                >
                    <Text style={styles.username}>
                        #{user.position} - {user.full_name}
                    </Text>
                    <Text style={styles.xp}>{user.xp} XP</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 50,
        backgroundColor: '#121212',
    },
    userContainer: {
        backgroundColor: '#1e1e1e',
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    currentUser: {
        backgroundColor: '#2e3a59',
        borderColor: '#5c9ded',
        borderWidth: 2,
    },
    username: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    xp: {
        fontSize: 16,
        color: '#aaa',
    },
});

export default LeaderboardScreen;
