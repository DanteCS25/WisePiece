import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Define your navigation stack type
type RootTabParamList = {
    Home: undefined;
    Puzzle: undefined;
    Favorites: undefined;
    Profile: undefined;
};

const NavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const [selectedTab, setSelectedTab] = useState<keyof RootTabParamList>('Home');

    const handleTabPress = (tabIndex: number) => {
        const route = state.routes[tabIndex];
        const isFocused = state.index === tabIndex;

        if (!isFocused) {
            setSelectedTab(route.name as keyof RootTabParamList);
            if (route.name === 'Favorites') {
                navigation.navigate('Favorites');
            } else {
                navigation.navigate(route.name);
            }
        }
    };

    return (
        <View style={styles.navContainer}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;

                return (
                    <TouchableOpacity
                        key={route.key}
                        style={styles.navButton}
                        onPress={() => handleTabPress(index)}
                    >
                        <Animated.View
                            style={[
                                styles.iconContainer,
                                isFocused && styles.selectedIconContainer,
                                {
                                    transform: [
                                        { scale: isFocused ? 1.1 : 0.9 },
                                        { translateY: isFocused ? -10 : 0 },
                                    ],
                                },
                            ]}
                        >
                            <Icon
                                name={
                                    route.name === 'Home'
                                        ? 'home-outline'
                                        : route.name === 'Puzzle'
                                        ? 'puzzle-outline'
                                        : route.name === 'Favorites'
                                        ? 'heart-outline'
                                        : 'account-outline'
                                }
                                size={25}
                                color={isFocused ? '#ffffff' : '#d4c09b'}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        height: 80,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 25,
    },
    selectedIconContainer: {
        backgroundColor: '#CE662A',
    },
});

export default NavBar;
