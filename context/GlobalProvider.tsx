import { ThemedText } from "@/components/ThemedText";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext<any>(null);
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set up persistent auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          try {
            // Fetch user data from Firestore
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              // Combine auth user with Firestore data
              setUser({
                ...currentUser,
                ...userDoc.data(),
              });
            } else {
              // If no document exists yet, just use the auth user
              console.log("No user document found for this user");
              setUser(currentUser);
            }
            setIsLoggedIn(true);
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(currentUser);
            setIsLoggedIn(true);
          }
        } else {
          console.log("No user authenticated");
          setUser(null);
          setIsLoggedIn(false);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}
    >
      {isLoading ? null : children}
    </GlobalContext.Provider>
  );
};
