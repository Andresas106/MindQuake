import { useState } from 'react';
import { View, Text, FlatList, Modal, Image, Pressable, StyleSheet, Dimensions,} from 'react-native';
import SoundButton from '../SoundButton';
import Achievement from '../model/Achievement';
import { AntDesign } from '@expo/vector-icons';

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / numColumns - 20;

const AchievementsOverviewScreen = ({ route, navigation }) => {
  const rawAchievements = route.params.achievements;
  const achievements = rawAchievements.map((a) => new Achievement(a));

  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const handlePress = (achievement) => {
    setSelectedAchievement(achievement);
  };

  const closeModal = () => {
    setSelectedAchievement(null);
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.achievementContainer} onPress={() => handlePress(item)}>
      <Image
        source={{ uri: item.icon }}
        style={[
          styles.achievementImage,
          { opacity: item.isUnlocked() ? 1 : 0.3 },
        ]}
        resizeMode="contain"
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <SoundButton style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={35} color="black" />
        </SoundButton>
        <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
      />

      <Modal
        visible={!!selectedAchievement}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            {selectedAchievement && (
              <>
                <Image
                  source={{ uri: selectedAchievement.icon }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                <Text style={styles.modalTitle}>{selectedAchievement.name}</Text>
                <Text style={styles.modalDate}>
                  {selectedAchievement.formatUnlockedDate()}
                </Text>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 90,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 27,
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 10,
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
  grid: {
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    marginBottom: 40,
  },
  achievementContainer: {
    width: itemSize,
    height: itemSize,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  achievementImage: {
    width: '80%',
    height: '80%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 8,
  },
  modalDate: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 16,
    color: '#ccc',
  },
});

export default AchievementsOverviewScreen;
