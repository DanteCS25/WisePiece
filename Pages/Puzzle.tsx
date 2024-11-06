import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { firestore } from '../firebase.config'; // Adjust the import path as necessary
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App'; // Ensure this import is correct
import NavBar from '../Components/Navbar';

type PuzzleScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Puzzle'>; // Check RootStackParamList definition

const PuzzleScreen: React.FC = () => {
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<PuzzleScreenNavigationProp>();

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const puzzlesCollection = collection(firestore, 'puzzle');
        const puzzleSnapshot = await getDocs(puzzlesCollection);
        const puzzleList = puzzleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPuzzles(puzzleList);
      } catch (error) {
        console.error('Error fetching puzzles:', error);
      } finally {
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
        <Text style={styles.header}>Puzzles</Text>
        <FlatList
          data={puzzles}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.puzzleItem}
              onPress={() => navigation.navigate('LevelSelection', { imageUri: item.imageUri })}
            >
              <View style={styles.glassCardContainer}>
                <View style={styles.glassCard}>
                  <Text style={styles.puzzleNameAbove}>{item.name}</Text>
                  <View style={styles.blurOverlay} />
                  {item.imageUri && (
                    <Image
                      source={{ uri: item.imageUri }}
                      style={styles.puzzleImage}
                      resizeMode="contain"
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <NavBar />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', // Dark charcoal tone for background
  },
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 60,
    padding: 20,
    paddingBottom: 80,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', // Match the background color for consistency
  },
  header: {
    paddingLeft: 10,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ffffff', // Warm beige for text, reflecting ambient lighting
  },
  puzzleItem: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  puzzleNameAbove: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Bright yellow color to make the text stand out
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4, // Shadow to make the text stand out more
    marginBottom: 10, // Add margin to separate the text from the image below
    paddingLeft: 10,
  },
  glassCardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
  },
  glassCard: {
    width: '100%',
    padding: 20,
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
    height: 200, // Adjust height as needed
    borderRadius: 20, // Rounded corners to match the puzzle item style
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.6,
    shadowRadius: 6, // Inner shadow to create a carved effect
  },
});

export default PuzzleScreen;
