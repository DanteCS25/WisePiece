import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import HomeScreen from './Pages/Home';
import Settings from './Pages/Settings';
import PuzzleScreen from './Pages/Puzzle';
import Profile from './Pages/Profile';
import PuzzleSolving from './Components/PuzzleSolving';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Settings: undefined;
  Puzzle: undefined;
  Profile: undefined;
  PuzzleSolving: { imageUri: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="Puzzle" component={PuzzleScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true }} />
        <Stack.Screen name="PuzzleSolving" component={PuzzleSolving} options={{ headerShown: true }} />
      </Stack.Navigator>
      {/* Render NavBar only on Home and Settings pages */}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
