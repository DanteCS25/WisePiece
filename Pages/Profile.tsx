import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebase.config';
import { fetchUserData } from '../service';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const Profile: React.FC = () => {
    const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                try {
                    const userData = await fetchUserData(userId);
                    setUserInfo({ name: userData.name, email: userData.email });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
            setLoading(false);
        };

        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            console.log('User logged out successfully');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Logout Error', 'An error occurred while logging out. Please try again.', [{ text: 'OK' }]);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {userInfo ? (
                <>
                    <Text style={styles.header}>Profile</Text>
                    <Text style={styles.info}>Name: {userInfo.name}</Text>
                    <Text style={styles.info}>Email: {userInfo.email}</Text>
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.error}>User information not found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginVertical: 5,
    },
    error: {
        color: 'red',
        fontSize: 18,
    },
    button: {
        backgroundColor: '#6200ee',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default Profile;
