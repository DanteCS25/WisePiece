import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { firestore, auth } from '../firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type FavScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LevelSelection'>;

const Fav: React.FC = () => {
  const [completedPuzzles, setCompletedPuzzles] = useState<any[]>([]);
  const [favoritePuzzles, setFavoritePuzzles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'completed' | 'favorite'>('completed');
  const navigation = useNavigation<FavScreenNavigationProp>();

  const fetchPuzzles = async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error('User is not authenticated');
        return;
      }

      const completedPuzzleCollectionRef = collection(firestore, 'users', userId, 'completedPuzzles');
      const completedPuzzleSnapshot = await getDocs(completedPuzzleCollectionRef);
      const completedPuzzleList = completedPuzzleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompletedPuzzles(completedPuzzleList);

      const favoritePuzzleCollectionRef = collection(firestore, 'users', userId, 'favoritePuzzles');
      const favoritePuzzleSnapshot = await getDocs(favoritePuzzleCollectionRef);
      const favoritePuzzleList = favoritePuzzleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavoritePuzzles(favoritePuzzleList);
    } catch (error) {
      console.error('Error fetching puzzles:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPuzzles();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6d4c41" />
      </View>
    );
  }

  const puzzlesToShow = activeFilter === 'completed' ? completedPuzzles : favoritePuzzles;

  return (
    <View style={styles.backgroundContainer}>
      <ImageBackground
        source={require('../assets/images/MainBackgroundBlur.png')}
        style={styles.background}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={styles.container}>
          <View style={styles.filterButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === 'completed' && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter('completed')}
            >
              <Text style={styles.filterButtonText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === 'favorite' && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter('favorite')}
            >
              <Text style={styles.filterButtonText}>Favorite</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.header}>
            {activeFilter === 'completed' ? 'Completed Puzzles' : 'Favorite Puzzles'}
          </Text>

          <FlatList
            data={puzzlesToShow}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContentContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.puzzleItem}
                onPress={() => navigation.navigate('LevelSelection', { imageUri: item.imageUri })}
              >
                <View style={styles.glassCardContainer}>
                  <View style={styles.glassCard}>
                    {item.imageUri && (
                      <Image
                        source={{ uri: item.imageUri }}
                        style={styles.puzzleImage}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 50,
    backgroundColor: '#2b2b2b',
    borderColor: '#3e3e3e',
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#2b2b2b',
  },
  activeFilterButton: {
    backgroundColor: '#CE662A',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    paddingLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#ffffff',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  puzzleItem: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '50%',
  },
  glassCardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  glassCard: {
    width: 140,
    height: 140,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  puzzleImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  puzzleName: {
    marginTop: 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Fav;
