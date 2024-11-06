import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define the parameter list for your navigation stack
type RootStackParamList = {
  PuzzleSolving: { level: string; imageUri: string };
  // ... other routes
};

// Define the navigation and route props
type LevelSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'PuzzleSolving'>;
type LevelSelectionRouteProp = RouteProp<RootStackParamList, 'PuzzleSolving'>;

const LevelSelection = () => {
  const navigation = useNavigation<LevelSelectionNavigationProp>();
  const route = useRoute<LevelSelectionRouteProp>();
  const { imageUri } = route.params;

  const handleLevelSelection = (selectedLevel: string) => {
    navigation.navigate('PuzzleSolving', { level: selectedLevel, imageUri: imageUri });
  };

  return (
    <ImageBackground
      source={require('../assets/images/MainBackgroundBlur.png')} // Replace with your actual background image URL
      style={styles.background}
      imageStyle={{ opacity: 0.5 }} // Set the background image opacity
    >
      <View style={styles.container}>
        <View style={styles.levelContainerLeftAligned}>
          <Text style={styles.levelTitle}>Easy</Text>
          <Text style={styles.description}>Perfect for beginners. Fewer pieces to solve, ideal to get started.</Text>
          <TouchableOpacity style={styles.startButton} onPress={() => handleLevelSelection('easy')}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>

        <View style={styles.levelContainerLeftAligned}>
          <Text style={styles.levelTitle}>Medium</Text>
          <Text style={styles.description}>A bit of a challenge. More pieces for a balanced experience.</Text>
          <TouchableOpacity style={styles.startButton} onPress={() => handleLevelSelection('medium')}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>

        <View style={styles.levelContainerLeftAligned}>
          <Text style={styles.levelTitle}>Hard</Text>
          <Text style={styles.description}>For puzzle masters. Lots of pieces to keep you engaged!</Text>
          <TouchableOpacity style={styles.startButton} onPress={() => handleLevelSelection('hard')}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 90,
  },
  levelContainerLeftAligned: {
    marginBottom: 20,
    width: 300,
    alignItems: 'flex-start',
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glass effect for level container
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    fontFamily: 'serif',
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    color: '#ffffff',
    fontFamily: 'serif',
  },
  startButton: {
    backgroundColor: '#CE662A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 20,
  },
});

export default LevelSelection;
