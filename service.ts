// service.ts
import { auth, firestore, storage } from './firebase.config'; // Update this path if necessary
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { db } from './firebase.config'; // Ensure db is exported from your firebase.config

export const signupUser = async (
  email: string,
  password: string,
  name: string,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user information to Firestore with user UID as document ID
    await setDoc(doc(firestore, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      createdAt: new Date(),
    });

    console.log('User document created with ID:', user.uid);

    Alert.alert('Success', 'User account created successfully');
    onSuccess();
  } catch (error: any) {
    const errorMessage = error.message;
    onError(errorMessage);
  }
};

export const loginUser = (
  email: string,
  password: string,
  onSuccess: (isAdmin: boolean) => void,
  onError: (message: string) => void
) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Alert.alert('Success', 'Logged in successfully');
      const isAdmin = email === "admin@gmail.com"; // Replace with your admin email logic
      onSuccess(isAdmin);
    })
    .catch((error) => {
      const errorMessage = error.message;
      onError(errorMessage);
    });
};

export const uploadImageAndSaveData = async (
  imageUri: string,
  name: string
): Promise<void> => {
  try {
    // Save image URI and name directly to Firestore
    await addDoc(collection(firestore, 'puzzle'), {
      name: name,
      imageUri: imageUri,
    });
    console.log('Data saved successfully to Firestore');
  } catch (error) {
    console.error('Error in uploadImageAndSaveData function:', error);
    throw new Error('Failed to save image and data');
  }
};

// Function to fetch user data
export const fetchUserData = async (userId: string) => {
  try {
    const userDoc = doc(firestore, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      return userSnapshot.data(); // Return user data
    } else {
      throw new Error('No such user document!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const addFavoritePuzzle = async (imageUri: string, puzzleName: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');

    // Create a document in the user's collection in Firestore
    const userPuzzleCollectionRef = collection(db, 'users', user.uid, 'favoritePuzzles');
    await addDoc(userPuzzleCollectionRef, {
      name: puzzleName || 'Untitled Puzzle', // Fallback if no name provided
      imageUri: imageUri,
      addedAt: new Date(),
    });

    console.log('Puzzle added to favorites');
  } catch (error: any) {
    console.error('Error adding puzzle to favorites:', error.message);
    throw error;
  }
};

export const saveCompletedPuzzle = async (imageUri: string, puzzleName: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');

    // Create a document in the user's collection in Firestore
    const userPuzzleCollectionRef = collection(db, 'users', user.uid, 'completedPuzzles');
    await addDoc(userPuzzleCollectionRef, {
      name: puzzleName || 'Untitled Puzzle', // Fallback if no name provided
      imageUri: imageUri,
      addedAt: new Date(),
    });

    console.log('Puzzle added to complete Puzzle');
  } catch (error: any) {
    console.error('Error adding puzzle to complete Puzzle:', error.message);
    throw error;
  }
};