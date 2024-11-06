import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Alert, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { analyzeImage } from '../Services/AI-Service';
import * as FileSystem from 'expo-file-system';
import ViewShot from 'react-native-view-shot';
import axios from 'axios';
import { addFavoritePuzzle, saveCompletedPuzzle } from '../service';
import auth from '@react-native-firebase/auth';

// Grid size will be determined dynamically based on level
let gridSize = 3;

const puzzleBoardSize = 300;
// pieceSize will be recalculated after gridSize is set
const Level = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};
let pieceSize: number;

// Define a type for your route parameters
type PuzzleSolvingRouteParams = {
  PuzzleSolving: {
    imageUri: string;
    level: string;
  };
};

// Define a type for the puzzle pieces
type PuzzlePiece = {
  key: string;
  correctX: number;
  correctY: number;
  isPlaced: boolean;
};

// Define a type for the web entity
type WebEntity = {
  description: string;
  metadata?: {
    summary?: string;
  };
};

// Update the WebDetectionData type to use the new WebEntity type
type WebDetectionData = {
  webEntities: WebEntity[];
  fullMatchingImages: any;
  partialMatchingImages: any;
};

const PuzzleSolving = () => {
  // Use RouteProp with the defined type
  const route = useRoute<RouteProp<PuzzleSolvingRouteParams, 'PuzzleSolving'>>();
  const navigation = useNavigation();
  const { imageUri, level } = route.params;

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<PuzzlePiece | null>(null);
  const [webDetectionData, setWebDetectionData] = useState<WebDetectionData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const viewShotRef = useRef<ViewShot | null>(null);

  // Add a new state variable to track if the puzzle is complete
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);

  useEffect(() => {
    if (level === Level.EASY) {
      gridSize = 3;
    } else if (level === Level.MEDIUM) {
      gridSize = 4;
    } else if (level === Level.HARD) {
      gridSize = 5;
    }
    pieceSize = puzzleBoardSize / gridSize;

    const initPieces = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        initPieces.push({
          key: `${row}-${col}`,
          correctX: col * pieceSize,
          correctY: row * pieceSize,
          isPlaced: false,
        });
      }
    }
    setPieces(shuffleArray(initPieces));
  }, [level]);

  const shuffleArray = (array: PuzzlePiece[]): PuzzlePiece[] => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const selectPiece = (piece: PuzzlePiece) => {
    if (piece.isPlaced) return;
    setSelectedPiece(piece);
  };

  const placePiece = (blockKey: string) => {
    if (!selectedPiece) {
      Alert.alert('Select a piece first');
      return;
    }

    if (selectedPiece.key === blockKey) {
      setPieces((prevPieces) => {
        const updatedPieces = prevPieces.map((piece) =>
          piece.key === selectedPiece.key ? { ...piece, isPlaced: true } : piece
        );

        // Check if all pieces are placed
        const allPlaced = updatedPieces.every(piece => piece.isPlaced);
        if (allPlaced) {
          Alert.alert('Success', 'All pieces placed! You can now save your puzzle.');
          setIsPuzzleComplete(true); // Update the state to indicate the puzzle is complete
        }

        return updatedPieces;
      });
      setSelectedPiece(null);
    } else {
      Alert.alert('Incorrect Placement', 'This piece does not fit here');
    }
  };

  const handleAddFavorite = async () => {
    try {
      await addFavoritePuzzle(imageUri, 'My Puzzle'); // Provide a puzzle name
      Alert.alert('Success', 'Puzzle added to favorites!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to favorites');
    }
  };

  const handleSaveCompletedPuzzle = async () => {
    try {
      await saveCompletedPuzzle(imageUri, 'My Puzzle'); // Provide a puzzle name
      Alert.alert('Success', 'Puzzle added to completed puzzles!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to completed puzzles');
    }
  };

  const handleAnalysePuzzle = async () => {
    if (!viewShotRef.current) {
      Alert.alert('Error', 'Could not capture the puzzle image for analysis');
      return;
    }

    setIsAnalyzing(true);
    try {
      if (viewShotRef.current && typeof viewShotRef.current.capture === 'function') {
        const solvedImageUri = await viewShotRef.current.capture();
        if (solvedImageUri) {
          const base64ImageData = await FileSystem.readAsStringAsync(solvedImageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const result = await analyzeImage(base64ImageData);
          if (result?.webEntities) {
            for (let entity of result.webEntities) {
              if (entity.description) {
                const summary = await fetchWikipediaSummary(entity.description);
                if (summary) {
                  entity.metadata = { summary };
                }
              }
            }
          }
          setWebDetectionData(result);
          console.log(result);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to analyze the image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchWikipediaSummary = async (query: string) => {
    if (!query) {
      return null;
    }
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );
      if (response.data && response.data.extract) {
        return response.data.extract;
      }
    } catch (error: any) { // Type assertion added here
      if (error.response && error.response.status === 404) {
        console.warn(`No Wikipedia page found for: ${query}`);
      } else {
        console.error('Error fetching Wikipedia summary:', error);
      }
    }
    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require('../assets/images/MainBackgroundBlur.png')} // Replace with your actual background image URL
        style={styles.background}
        imageStyle={{ opacity: 0.5 }} // Set the background image opacity
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Start Solving</Text>
          <TouchableOpacity onPress={handleAddFavorite}>
            <Icon name="heart" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Build the Puzzle:</Text>
          <Text style={styles.instructionsText}>1. Select a puzzle piece from the options below.</Text>
          <Text style={styles.instructionsText}>2. Tap on the desired block to place the selected piece.</Text>
          <Text style={styles.instructionsText}>3. Repeat until all pieces are placed in the correct positions.</Text>
        </View>

        <Pressable onPress={handleAnalysePuzzle} style={styles.analyzeButton} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analyze Puzzle</Text>
          )}
        </Pressable>

        {webDetectionData && webDetectionData.webEntities && (
          <View style={styles.webDetectionContainer}>
            <Text style={styles.labelTitle}>Detected Entities:</Text>
            {webDetectionData.webEntities.map((entity: WebEntity, index) => (
              <View key={index} style={styles.entityContainer}>
                <Text style={styles.label}>{entity.description}</Text>
                {entity.metadata && entity.metadata.summary && (
                  <Text style={styles.summary}>{entity.metadata.summary}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
          <View style={[styles.puzzleBoard, { width: puzzleBoardSize, height: puzzleBoardSize }]}>
            {pieces.map((piece) => (
              <TouchableOpacity
                key={piece.key}
                style={[
                  styles.puzzlePiece,
                  {
                    top: piece.correctY,
                    left: piece.correctX,
                    width: pieceSize,
                    height: pieceSize,
                  },
                ]}
                onPress={() => placePiece(piece.key)}
              >
                {piece.isPlaced && (
                  <ImageBackground
                    source={{ uri: imageUri }}
                    style={styles.imageBackground}
                    imageStyle={{
                      width: puzzleBoardSize,
                      height: puzzleBoardSize,
                      top: -piece.correctY,
                      left: -piece.correctX,
                    }}
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ViewShot>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveCompletedPuzzle}
          disabled={!isPuzzleComplete} // Disable the button if the puzzle is not complete
        >
          <Text style={styles.saveButtonText}>Completed Puzzle</Text>
        </TouchableOpacity>

        <View style={styles.pieceContainer}>
          {pieces
            .filter((piece) => !piece.isPlaced)
            .map((piece) => (
              <TouchableOpacity
                key={piece.key}
                style={[
                  styles.puzzlePieceBottom,
                  selectedPiece?.key === piece.key ? styles.selectedPiece : null,
                  {
                    width: pieceSize,
                    height: pieceSize,
                  },
                ]}
                onPress={() => selectPiece(piece)}
              >
                <ImageBackground
                  source={{ uri: imageUri }}
                  style={styles.image}
                  imageStyle={{
                    width: puzzleBoardSize,
                    height: puzzleBoardSize,
                    top: -piece.correctY,
                    left: -piece.correctX,
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', // Dark charcoal tone for background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 70,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'serif',
  },
  instructionsContainer: {
    marginTop: 50,
    marginBottom: 10,
    width: 300,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glass effect for level container
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 10,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    fontFamily: 'serif',
    paddingLeft: 18,
    paddingTop: 10,
    paddingBottom: 10
  },
  instructionsText: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 10,
    paddingLeft: 18,
    paddingRight: 18
  },
  analyzeButton: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#CE662A',
    borderRadius: 5,
  },
  analyzeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  webDetectionContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  labelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    fontFamily: 'serif',
  },
  label: {
    fontSize: 16,
    color: '#CE662A',
  },
  summary: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  entityContainer: {
    marginBottom: 15,
  },
  puzzleBoard: {
    marginTop: 20,
    position: 'relative',
    borderWidth: 5,
    borderColor: '#C0A080',
  },
  puzzlePiece: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#C0A080',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pieceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  puzzlePieceBottom: {
    margin: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  selectedPiece: {
    borderColor: '#FF6347',
    borderWidth: 2,
  },
  imageBackground: {
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    marginTop: 30,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#CE662A',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PuzzleSolving;
