import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, TextInput, Alert, Easing, ImageBackground } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { signupUser } from '../service'; // Adjust the import path as necessary

const { width, height } = Dimensions.get('window');

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

const Signup: React.FC = () => {
  const animation = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useFocusEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  });

  const handleSignup = () => {
    signupUser(
      email,
      password,
      name,
      () => {
        navigation.navigate('Home');
      },
      (errorMessage) => {
        Alert.alert('Signup Error', errorMessage);
      }
    );
  };

  const slideToLogin = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Login');
    });
  };

  const signupTransform = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

  return (
    <ImageBackground
    source={require('../assets/images/MainBackground.jpg')} // Replace with your actual background image URL
    style={styles.background}
      imageStyle={{ opacity: 0.5 }} // Set the background image opacity
    >
      <Animated.View style={[styles.container, { transform: [{ translateX: signupTransform }] }]}>
        <View style={styles.glassCardContainer}>
          <View style={styles.glassCard}>
            <View style={styles.blurOverlay} />
            <Text style={styles.header}>Signup</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor='rgba(54, 51, 46, 0.5)'
              value={name}
              onChangeText={setName}
            />
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
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignup}>
              <Text style={styles.buttonPrimaryText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={slideToLogin}>
              <Text style={styles.linkText}>Already have an account? Login</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glass effect with transparency
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden', // To ensure the blur overlay stays within the card
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Light blur overlay
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

export default Signup;
