import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import HomeScreen from './Pages/Home';
import Settings from './Pages/Settings';
import PuzzleScreen from './Pages/Puzzle';
import Profile from './Pages/Profile';
import PuzzleSolving from './Components/PuzzleSolving';
import LevelSelectionComponent from './Components/LevelSelection';
import NavBar from './Components/Navbar';
import Fav from './Pages/Fav';

export type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    PuzzleSolving: undefined;
    LevelSelection: { imageUri: string };
    Settings: undefined;
    Profile: undefined;
    Puzzle: undefined;
    Home: undefined;
    Fav: undefined;
};

export type RootTabParamList = {
    Home: undefined;
    Puzzle: undefined;
    Favorites: undefined;
    Profile: undefined;
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator<RootTabParamList>();

const HomeTabs = () => {
    return (
        <Tab.Navigator
            tabBar={(props: BottomTabBarProps) => <NavBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Puzzle" component={PuzzleScreen} />
            <Tab.Screen name="Favorites" component={Fav} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Home" component={HomeTabs} />
                <Stack.Screen name="PuzzleSolving" component={PuzzleSolving} />
                <Stack.Screen name="LevelSelection" component={LevelSelectionComponent} />
                <Stack.Screen name="Fav" component={Fav} />
            </Stack.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}