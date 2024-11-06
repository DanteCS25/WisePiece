import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
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
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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

  const filteredPuzzles = puzzles.filter(puzzle =>
    puzzle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6d4c41" />
      </View>
    );
  }

  return (
    <View style={styles.backgroundContainer}>
      <ImageBackground
        source={require('../assets/images/MainBackgroundBlur.png')} // Replace with your actual background image URL
        style={styles.background}
        imageStyle={{ opacity: 0.5 }} // Set the background image opacity
      >
        <View style={styles.container}>
          <Text style={styles.header}>Puzzles</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search Puzzles"
            placeholderTextColor="#a09383"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredPuzzles}
            keyExtractor={(item) => item.id}
            key={(searchQuery.length > 0 ? 'searched' : 'default') + puzzles.length} // Change key to force re-render when number of columns changes
            numColumns={2} // Display puzzles in two columns
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
    backgroundColor: '#1e1e1e', // Dark charcoal tone for background
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
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
    marginBottom: 20,
    color: '#ffffff', // Warm beige for text, reflecting ambient lighting
  },
  searchBar: {
    width: '95%',
    height: 40,
    borderColor: '#3e3e3e', // Darker border to blend with background
    borderWidth: 1,
    borderRadius: 8, // Rounded corners for a rustic feel
    paddingHorizontal: 15,
    marginBottom: 20,
    marginLeft: 8,
    backgroundColor: '#2b2b2b', // Darker background for inputs
    color: '#ffffff', // Light beige text color for inputs
  },
  puzzleItem: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '50%', // Set width to 50% for each item to align in two columns
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
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Light blur overlay
    opacity: 0.5, // Reduce opacity to create a blur effect without external libraries
  },
  puzzleImage: {
    width: 110,
    height: 110, // Ensure images have consistent height and width without stretching
    borderRadius: 10, // Rounded corners to match the puzzle item style
    shadowColor: '#000',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.5,
    shadowRadius: 4, // Inner shadow to create a carved effect
  },
});

export default PuzzleScreen;
