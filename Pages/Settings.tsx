import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
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
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  imagePicker: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#888',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
});

export default Settings;
