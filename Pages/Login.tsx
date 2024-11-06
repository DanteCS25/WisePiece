import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity, TextInput, Alert, ImageBackground } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { loginUser } from '../service'; // Adjust the import path as necessary

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login: React.FC = () => {
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useFocusEffect(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  });

  const handleLogin = async () => {
    try {
      await loginUser(
        email,
        password,
        async (isAdmin) => {
          if (isAdmin && password === 'AdminPassword123!') {
            navigation.navigate('Settings');
          } else if (isAdmin) {
            Alert.alert('Access Denied', 'Incorrect admin password.');
          } else {
            navigation.navigate('Home');
          }
        },
        (errorMessage) => {
          Alert.alert('Login Error', errorMessage);
        }
      );
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const slideToSignup = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Signup');
    });
  };

  const loginTransform = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  return (
    <ImageBackground
      source={require('../assets/images/MainBackground.jpg')} // Replace with your actual background image URL
      style={styles.background}
      imageStyle={{ opacity: 0.5 }} // Set the background image opacity
    >
      <Animated.View style={[styles.container, { transform: [{ translateX: loginTransform }] }]}>
        <View style={styles.glassCardContainer}>
          <View style={styles.glassCard}>
            <View style={styles.blurOverlay} />
            <Text style={styles.header}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor='rgba(54, 51, 46, 0.5)'
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor='rgba(54, 51, 46, 0.5)'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
              <Text style={styles.buttonPrimaryText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={slideToSignup}>
              <Text style={styles.linkText}>Don't have an account? Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
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
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.6, // To vertically center within the screen
    width: '100%',
  },
  glassCard: {
    width: '85%',
    padding: 25,
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Input background to enhance the glass effect
    color: '#F3EBD8',
  },
  buttonPrimary: {
    backgroundColor: '#CE662A',
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#ffffff',
    marginTop: 15,
    fontSize: 16,
  },
});

export default Login;
