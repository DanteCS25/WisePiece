import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomAlert from '../Components/CustomAlert'; // Import the custom alert

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type RootStackParamList = {
  Home: undefined; // Define other screens as needed
  Puzzle: undefined; // Example for another screen
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleLogin = () => {
    // Simulate login logic
    setAlertTitle('Login Successful');
    setAlertMessage('Welcome back to PieceWise!');
    setAlertVisible(true);
  };

  const handleLogout = () => {
    // Simulate logout logic
    setAlertTitle('Logout Successful');
    setAlertMessage('You have been logged out.');
    setAlertVisible(true);
  };

  return (
    <ImageBackground
      source={require('../assets/images/MainBackgroundBlur.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.5 }}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/images/Logo+Name.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Welcome to PieceWise!</Text>
        <Text style={styles.descriptionText}>Your ultimate puzzle building experience awaits.</Text>
        <Text style={styles.descriptionText}>
          PieceWise is designed not only to entertain but also to educate. Solving puzzles helps improve critical thinking, problem-solving skills, and cognitive abilities. With a variety of difficulty levels, PieceWise offers challenges suitable for all ages, enhancing spatial awareness and patience while having fun.
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Puzzle' as never)}>
          <Text style={styles.startButtonText}>Start the build</Text>
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#1e1e1e',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for glass effect
  },
  logo: {
    width: 150,
    height: 190,
    marginBottom: 20,
    marginTop: 80,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  descriptionText: {
    fontSize: 16,
    width: 300,
    color: '#ffffff',
    marginTop: 20,
    marginLeft: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  startButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#CE662A',
    borderRadius: 5,
    alignItems: 'center',
    width: 250,
    marginRight: 'auto',
    marginLeft: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 5, 
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#CE662A',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
