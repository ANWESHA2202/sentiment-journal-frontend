import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, Redirect } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons, images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { Collapsible } from "@/components/Collapsible";
import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";

const Index = () => {
  const { isLoggedIn, isLoading } = useGlobalContext();

  const animatedValue = useRef(new Animated.Value(0)).current;

  const [openAuth, setOpenAuth] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const animationRef = useRef<any>(null);

  const handlePress = () => setOpenAuth(!openAuth);

  useEffect(() => {
    if (!isLoading) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );

      animationRef.current = animation;
      animation.start();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [isLoading, animatedValue]);

  const interpolatedRotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  if (!isLoading && isLoggedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Redirect href="/home" />
      </View>
    );
  }

  if (isLoading || !isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.viewContainer}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <View style={styles.imageContainer}>
              <Image
                source={images.featureImage1}
                style={{ height: 200, width: 200 }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                ...styles.imageContainer,
                marginLeft: -100,
                marginTop: 100,
              }}
            >
              <Image
                source={images.featureImage2}
                style={{ height: 200, width: 200 }}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to your personal space...</Text>
            <Text style={styles.subtitle}>
              Share your thoughts, ideas, and reveal your true self.
            </Text>

            <TouchableOpacity onPress={handlePress}>
              <View style={styles.buttonContainer}>
                <Animated.View
                  style={[
                    styles.gradientBorder,
                    { transform: [{ rotate: interpolatedRotate }] },
                  ]}
                >
                  <LinearGradient
                    colors={["#C71585", "#9400D3", "#191970"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
                <LinearGradient
                  colors={["#4B0082", "#9400D3", "#000080"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {openAuth && (
          <Collapsible
            open={openAuth}
            title="Auth"
            otherStyles={{ width: "100%" }}
          >
            <TouchableOpacity
              onPress={() => {
                setOpenAuth(false);
              }}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                padding: 10,
                zIndex: 1000,
              }}
              activeOpacity={0.7}
            >
              <Image
                source={icons.plus}
                style={{
                  height: 20,
                  width: 20,
                  transform: [{ rotate: "45deg" }],
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {isSignup ? (
              <SignUp setOpenAuth={setOpenAuth} />
            ) : (
              <SignIn setIsSignup={setIsSignup} setOpenAuth={setOpenAuth} />
            )}
          </Collapsible>
        )}
      </SafeAreaView>
    );
  }

  return null;
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  viewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: "white",
    height: 208,
    width: 208,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    color: "lightgray",
  },
  buttonContainer: {
    marginTop: 20,
    position: "relative",
    padding: 2,
    borderRadius: 7,
    overflow: "hidden",
    width: 200,
    alignSelf: "center",
  },
  gradientBorder: {
    position: "absolute",
    top: -150,
    left: -150,
    right: -150,
    bottom: -150,
    borderRadius: 999,
    opacity: 0.7,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
