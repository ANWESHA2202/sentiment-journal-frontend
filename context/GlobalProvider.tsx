import { ThemedText } from "@/components/ThemedText";
import { getCurrentUser } from "@/services/authService";
import { createContext, useContext, useEffect, useState } from "react";
import { Text } from "react-native";

const dummyUser = {
  uid: "123",
  email: "test@test.com",
  displayName: "Test User",
};

const GlobalContext = createContext<any>(null);
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUser = async () => {
    try {
      const user = await getCurrentUser();
      setUser((prev: any) => {
        return user ? user : dummyUser;
      });
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      console.log(user, "user");
    } catch (err) {
      console.log(err);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log("getUser12");
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}
    >
      {isLoading ? null : children}
    </GlobalContext.Provider>
  );
};
