import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { auth } from '../firebase.config';
import { fetchUserData } from '../service';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid;
        console.log('User is authenticated with UID:', userId);
        try {
          // Fetch user data without retry mechanism
          const userData = await fetchUserData(userId);
          setUserInfo({ name: userData.name, email: userData.email });
          console.log('User data successfully fetched for userId:', userId);
        } catch (error) {
          console.error('Error fetching user data for userId:', userId, error);
          Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
        }
      } else {
        console.error('No authenticated user found');
        Alert.alert('Error', 'No authenticated user found. Please login again.');
        navigation.navigate('Login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

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
        {userInfo ? (
          <>
            <Text style={styles.header}>Profile</Text>
            <Text style={styles.info}>Name: {userInfo.name}</Text>
            <Text style={styles.info}>Email: {userInfo.email}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.error}>User information not found.</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', // Match the background color for consistency
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for glass effect
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff', // Warm beige for text, reflecting ambient lighting
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3, // Reduced shadow for a cleaner look
  },
  info: {
    fontSize: 18,
    color: '#ffffff', // Light beige text color for inputs
    marginBottom: 10,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3, // Reduced shadow for a cleaner look
  },
  button: {
    backgroundColor: '#CE662A', // Warm brown to reflect wood tones
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 5, // Stronger shadow for a cozy depth effect
    elevation: 6,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  error: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
});

export default Profile;
