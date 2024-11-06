import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageAndSaveData } from '../service'; // Adjust the import path as necessary

const Settings: React.FC = () => {
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!imageUri || !name) {
      Alert.alert('Error', 'Please provide both an image and a name');
      return;
    }
    try {
      console.log('Attempting to save data to Firestore:', { imageUri, name });
      await uploadImageAndSaveData(imageUri, name);
      Alert.alert('Success', 'Image URI and name have been saved successfully to the puzzle collection');
      setName('');
      setImageUri(null);
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save image URI and data to Firestore');
    }
  };

  return (
    <ImageBackground
    source={require('../assets/images/MainBackground.jpg')} // Assuming the vintage wood background image is located in assets folder
    style={styles.background}
      imageStyle={{ opacity: 0.4 }} // Set the background image opacity
    >
      <View style={styles.container}>
        <Text style={styles.header}>Add Puzzles</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>Pick an image</Text>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          placeholderTextColor='rgba(54, 51, 46, 0.5)'
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSave}>
          <Text style={styles.buttonPrimaryText}>Upload Puzzle</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', // Dark charcoal tone for background
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  imagePicker: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glass effect for image picker
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  imagePickerText: {
    color: '#F3EBD8',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  input: {
    width: 180,
    height: 45,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Input background to enhance the glass effect
    color: '#F3EBD8',
  },
  buttonPrimary: {
    backgroundColor: '#CE662A',
    paddingVertical: 12,
    borderRadius: 25,
    width: 180,
    alignItems: 'center',
    marginVertical: 30,
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings;
