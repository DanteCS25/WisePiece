import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

    return (
        <View style={styles.navContainer}>
            <TouchableOpacity style={styles.navButton} onPress={toggleExpand}>
                <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <Icon name="home" size={30} color="#ffffff" />
                </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Puzzle')}>
                <Icon name="build" size={30} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
                <Icon name="favorite" size={30} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
                <Icon name="person" size={30} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#6200ee',
        height: 60,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 10,
    },
    navButton: {
        padding: 10,
    },
});

export default NavBar;