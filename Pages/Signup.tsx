import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { signupUser } from '../service'; // Adjust the import path as necessary

const { width } = Dimensions.get('window');

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
      duration: 300,
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
    <Animated.View style={[styles.container, { transform: [{ translateX: signupTransform }] }]}>
      <Text style={styles.header}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={slideToLogin}>
        <Text style={styles.linkText}>Go to Login</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#6200ee',
    marginTop: 15,
    fontSize: 16,
  },
});

export default Signup;
