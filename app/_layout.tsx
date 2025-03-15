import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { BackHandler, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import "react-native-reanimated";
import { GlobalProvider } from "@/context/GlobalProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigation = useNavigation();

  useEffect(() => {
    SplashScreen.hideAsync();
    return () => {
      SplashScreen.hideAsync();
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      } else {
        // When there's nothing in stack to go back to
        Alert.alert(
          "Exit App",
          "Do you want to exit the app?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "Yes", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: true }
        );
        return true; // Prevents default behavior
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <GlobalProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GlobalProvider>
  );
}
