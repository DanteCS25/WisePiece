import { auth, db } from './firebase.config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Alert } from 'react-native';

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
    console.log('User signed up with UID:', user.uid);

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      createdAt: serverTimestamp(), // Use Firestore's server timestamp
    });
    console.log('User document created successfully for:', user.uid);
    Alert.alert('Success', 'User account created successfully');
    onSuccess();
  } catch (error: any) {
    const errorMessage = error.message;
    console.error('Signup error:', errorMessage);
    onError(errorMessage);
  }
};

export const loginUser = (
  email: string,
  password: string,
  onSuccess: (isAdmin: boolean) => void,
  onError: (message: string) => void
) => {
  // Admin login check
  if (email === 'admin@gmail.com' && password === 'adminPassword') {
    console.log('Admin logged in:', email);
    Alert.alert('Success', 'Admin logged in successfully');
    onSuccess(true);
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Alert.alert('Success', 'Logged in successfully');
      console.log('User logged in successfully:', user.uid);
      const isAdmin = email === 'admin@gmail.com';
      onSuccess(isAdmin);
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error('Login error:', errorMessage);
      onError(errorMessage);
    });
};

export const fetchUserData = async (userId: string) => {
  try {
    console.log('Fetching data for userId:', userId);
    const userDocRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      console.log('User data found for userId:', userId);
      return userSnapshot.data();
    } else {
      console.error('No such user document for userId:', userId);
      throw new Error('No such user document!');
    }
  } catch (error) {
    console.error('Error fetching user data for userId:', userId, error);
    throw error;
  }
};

export const uploadImageAndSaveData = async (
  imageUri: string,
  name: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'puzzles'), {
      name: name,
      imageUri: imageUri,
      createdAt: serverTimestamp(),
    });
    console.log('Data saved successfully to Firestore');
  } catch (error) {
    console.error('Error in uploadImageAndSaveData function:', error);
    throw new Error('Failed to save image and data');
  }
};

export const addFavoritePuzzle = async (imageUri: string, puzzleName: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');

    console.log('Adding favorite puzzle for user:', user.uid);
    const userPuzzleCollectionRef = collection(db, 'users', user.uid, 'favoritePuzzles');
    await addDoc(userPuzzleCollectionRef, {
      name: puzzleName || 'Untitled Puzzle',
      imageUri: imageUri,
      addedAt: serverTimestamp(),
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

    console.log('Saving completed puzzle for user:', user.uid);
    const userPuzzleCollectionRef = collection(db, 'users', user.uid, 'completedPuzzles');
    await addDoc(userPuzzleCollectionRef, {
      name: puzzleName || 'Untitled Puzzle',
      imageUri: imageUri,
      addedAt: serverTimestamp(),
    });

    console.log('Puzzle added to completed puzzles');
  } catch (error: any) {
    console.error('Error adding puzzle to completed puzzles:', error.message);
    throw error;
  }
};

const handleLogout = async (navigation: any) => {
  const user = auth.currentUser; // Check the current user
  if (!user) {
    console.error('No authenticated user found');
    return; // Exit the function if no user is found
  }

  try {
    await auth.signOut();
    console.log('User logged out successfully');
    navigation.navigate('Login');
  } catch (error) {
    console.error('Logout Error:', error);
  }
};