import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your navigation stack type
type RootStackParamList = {
    Puzzle: undefined; // Define the route and its parameters
    Profile: undefined; // Add Profile route
    // ... other routes
};

const NavBar: React.FC = () => {
    const [expanded, setExpanded] = useState(false);
    const [selectedTab, setSelectedTab] = useState('home');
    const scaleValue = new Animated.Value(1);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const toggleExpand = () => {
        Animated.spring(scaleValue, {
            toValue: expanded ? 1 : 1.5,
            friction: 5,
            useNativeDriver: true,
        }).start();
        setExpanded(!expanded);
    };

    const handleTabPress = (tab: string, route?: keyof RootStackParamList) => {
        console.log(`Navigating to: ${tab}`);
        setSelectedTab(tab);
        if (route) {
            navigation.navigate(tab === 'puzzle' ? 'Puzzle' : route);
        }
    };

    return (
        <View style={styles.navContainer}>
            <TouchableOpacity style={styles.navButton} onPress={() => { toggleExpand(); handleTabPress('home'); }}>
                <Animated.View style={[
                    styles.iconContainer,
                    selectedTab === 'home' && styles.selectedIconContainer,
                    {
                        transform: [
                            { scale: selectedTab === 'home' ? 1.1 : 0.8 },
                            { translateY: selectedTab === 'home' ? -20 : 0 }
                        ]
                    }
                ]}>
                    <Icon name="home-outline" size={30} color={selectedTab === 'home' ? "#ffffff" : "#d4c09b"} />
                </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => handleTabPress('puzzle', 'Puzzle')}>
                <Animated.View style={[
                    styles.iconContainer,
                    selectedTab === 'puzzle' && styles.selectedIconContainer,
                    {
                        transform: [
                            { scale: selectedTab === 'puzzle' ? 1.1 : 0.9 },
                            { translateY: selectedTab === 'puzzle' ? -20 : 0 }
                        ]
                    }
                ]}>
                    <Icon name="toolbox-outline" size={30} color={selectedTab === 'puzzle' ? "#ffffff" : "#d4c09b"} />
                </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => handleTabPress('favorite')}>
                <Animated.View style={[
                    styles.iconContainer,
                    selectedTab === 'favorite' && styles.selectedIconContainer,
                    {
                        transform: [
                            { scale: selectedTab === 'favorite' ? 1.1 : 0.9 },
                            { translateY: selectedTab === 'favorite' ? -20 : 0 }
                        ]
                    }
                ]}>
                    <Icon name="heart-outline" size={30} color={selectedTab === 'favorite' ? "#ffffff" : "#d4c09b"} />
                </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => handleTabPress('profile', 'Profile')}>
                <Animated.View style={[
                    styles.iconContainer,
                    selectedTab === 'profile' && styles.selectedIconContainer,
                    {
                        transform: [
                            { scale: selectedTab === 'profile' ? 1.1 : 0.9 },
                            { translateY: selectedTab === 'profile' ? -20 : 0 }
                        ]
                    }
                ]}>
                    <Icon name="account-outline" size={30} color={selectedTab === 'profile' ? "#ffffff" : "#d4c09b"} />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 30, 30, 0.9)', // Semi-transparent dark background for glass effect
        height: 80,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.9,
        shadowRadius: 5, // Stronger shadow for depth
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25, // Rounded corners for glass effect
        overflow: 'hidden',
    },
    navButton: {
        padding: 10,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glass effect for icons
        borderRadius: 25, // Rounded to create a circular effect
    },
    selectedIconContainer: {
        backgroundColor: '#CE662A', // Warm brown background for selected icon
        borderRadius: 30,
        marginTop: 30
    },
});

export default NavBar;
