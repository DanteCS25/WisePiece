import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { auth } from '../firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase.config';


const Fav: React.FC = () => {
  const [completedPuzzles, setCompletedPuzzles] = useState<any[]>([]);
  const [favoritePuzzles, setFavoritePuzzles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPuzzles = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Fetch completed puzzles
          const completedPuzzleCollectionRef = collection(firestore, 'users', user.uid, 'completedPuzzles');
          const completedPuzzleSnapshot = await getDocs(completedPuzzleCollectionRef);
          const completedPuzzleList = completedPuzzleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCompletedPuzzles(completedPuzzleList);

          // Fetch favorite puzzles
          const favoritePuzzleCollectionRef = collection(firestore, 'users', user.uid, 'favoritePuzzles');
          const favoritePuzzleSnapshot = await getDocs(favoritePuzzleCollectionRef);
          const favoritePuzzleList = favoritePuzzleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFavoritePuzzles(favoritePuzzleList);
        } catch (error) {
          console.error('Error fetching puzzles:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPuzzles();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6d4c41" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/images/MainBackgroundBlur.png')} // Replace with your actual background image URL
      style={styles.background}
      imageStyle={{ opacity: 0.5 }} // Set the background image opacity
    >
      <View style={styles.container}>
        <Text style={styles.header}>Completed Puzzles</Text>
        <FlatList
          data={completedPuzzles}
          keyExtractor={(item) => item.id}
          numColumns={2} // Display two items per row
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.puzzleItem}>
              <View style={styles.glassCardContainer}>
                <View style={styles.glassCard}>
                  <View style={styles.blurOverlay} />
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
        
        <Text style={styles.header}>Favorite Puzzles</Text>
        <FlatList
          data={favoritePuzzles}
          keyExtractor={(item) => item.id}
          numColumns={2} // Display two items per row
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.puzzleItem}>
              <View style={styles.glassCardContainer}>
                <View style={styles.glassCard}>
                  <View style={styles.blurOverlay} />
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
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for glass effect
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3, // Reduced shadow for a cleaner look
  },
  puzzleItem: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  glassCardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  glassCard: {
    width: 140, // Consistent width for all cards
    height: 140, // Consistent height for all cards
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Black with transparency
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden', // To ensure the blur overlay stays within the card
    justifyContent: 'center',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Light blur overlay
    opacity: 0.5, // Reduce opacity to create a blur effect without external libraries
  },
  puzzleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10, // Rounded corners to match the puzzle item style
    shadowColor: '#000',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.5,
    shadowRadius: 4, // Inner shadow to create a carved effect
  },
});

export default Fav;
