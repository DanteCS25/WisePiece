import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import HomeScreen from './Pages/Home';
import Settings from './Pages/Settings';
import PuzzleScreen from './Pages/Puzzle';
import Profile from './Pages/Profile';
import PuzzleSolving from './Components/PuzzleSolving';
import LevelSelectionComponent from './Components/LevelSelection';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Profile: undefined;
  Settings: undefined;
  Home: undefined;
  PuzzleSolving: { imageUri: string };
  LevelSelection: { imageUri: string };
  Favorites: undefined;
  Puzzle: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Puzzle" component={PuzzleScreen} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="PuzzleSolving" component={PuzzleSolving} options={{ headerShown: false }} />
        <Stack.Screen name="LevelSelection" component={LevelSelectionComponent} options={{ headerShown: false }} />
        <Stack.Screen name="Puzzle" component={PuzzleScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
