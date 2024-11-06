import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavBar from '../Components/Navbar';

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Welcome to PieceWise!</Text>
      <Text>This is your puzzle building app.</Text>
      <NavBar/>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
