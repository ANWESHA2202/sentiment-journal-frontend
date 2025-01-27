import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { SignInForm, UserData } from "@/typeDeclarations";
// import * as Google from "expo-auth-session/providers/google";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { getReactNativePersistence } from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// const auth2 = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

// Sign Up
export const signUp = async (
  email: string,
  password: string,
  username: string
): Promise<UserData | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userData: UserData = {
      uid: user.uid,
      username,
      email: user.email!,
      createdAt: new Date(),
    };

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), userData);
    return userData;
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    return null;
  }
};

// Sign In
export const signInUser = async (
  form: SignInForm
): Promise<UserData | null> => {
  const { email, password } = form;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user as UserData;
  } catch (error: any) {
    console.error("Error signing in:", error.message);
    return null;
  }
};

export const getCurrentUser = async (): Promise<UserData | null> => {
  const user = auth?.currentUser || null;

  if (!user || !user.uid) {
    return null;
  }

  try {
    const userDocRef = doc(db, "users", user.uid); // Create a reference to the user's document
    const userDoc = await getDoc(userDocRef); // Fetch the document

    if (userDoc.exists()) {
      return userDoc.data() as UserData; // Cast the document data to your UserData type
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
