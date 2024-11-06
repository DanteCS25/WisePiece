import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase.config'; // Adjust the import path as necessary
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App'; // Ensure this import is correct

type PuzzleScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Puzzle'>;

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
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Puzzles</Text>
      <FlatList
        data={puzzles}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.puzzleItem}
            onPress={() => navigation.navigate('PuzzleSolving', { imageUri: item.imageUri })}
          >
            <Text style={styles.puzzleName}>{item.name}</Text>
            {item.imageUri && (
              <Image
                source={{ uri: item.imageUri }}
                style={styles.puzzleImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  puzzleItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  puzzleName: {
    fontSize: 18,
  },
  puzzleImage: {
    width: '100%',
    height: 200, // Adjust height as needed
    marginTop: 10,
  },
});

export default PuzzleScreen;
