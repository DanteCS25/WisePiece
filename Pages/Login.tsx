import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { loginUser, fetchUserData } from '../service'; // Adjust the import path as necessary

const { width } = Dimensions.get('window');

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login: React.FC = () => {
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useFocusEffect(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  });

  const handleLogin = async () => {
    try {
        await loginUser(
            email,
            password,
            async (isAdmin) => {
                if (isAdmin && password === "AdminPassword123!") {
                    navigation.navigate('Settings');
                } else if (isAdmin) {
                    Alert.alert('Access Denied', 'Incorrect admin password.');
                } else {
                    // Directly navigate to Home after successful login
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
    <Animated.View style={[styles.container, { transform: [{ translateX: loginTransform }] }]}>
      <Text style={styles.header}>Login</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={slideToSignup}>
        <Text style={styles.linkText}>Go to Signup</Text>
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

export default Login;
