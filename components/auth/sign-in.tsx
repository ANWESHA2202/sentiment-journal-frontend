import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";
import FormField from "@/components/ui/FormField";
import CustomButton from "@/components/ui/CustomButton";
import { Link, router } from "expo-router";
//   import { getCurrentUser, signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signInUser } from "@/services/authService";
import { ThemedText } from "../ThemedText";

const SignIn = ({
  setIsSignup,
  setOpenAuth,
}: {
  setIsSignup: (value: boolean) => void;
  setOpenAuth: (value: boolean) => void;
}) => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
    }
    setIsSubmitting(true);
    try {
      const result = await signInUser(form);
      console.log(result, "signInUser");
      setIsLoggedIn(true);
      setUser(result);
      setOpenAuth(false);
      router.replace("/home");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Sign In to Yours</Text>
          <FormField
            title="Email"
            value={form.email}
            handleChange={(e: string) => setForm({ ...form, email: e })}
            otherStyles={styles.formField}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChange={(e: string) => setForm({ ...form, password: e })}
            otherStyles={styles.formField}
          />

          <CustomButton
            title="Sign In"
            handlePress={submitHandler}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => setIsSignup(true)}>
              <ThemedText style={styles.signupLink}>Sign Up</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
  },
  wrapper: {
    width: "100%",
    justifyContent: "center",
    minHeight: "82%",
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    color: "white",
    marginTop: 40,
  },
  formField: {
    marginTop: 28,
  },
  button: {
    marginTop: 28,
  },
  signupContainer: {
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  signupText: {
    fontSize: 18,
    color: "#f3f4f6",
  },
  signupLink: {
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
    textDecorationLine: "underline",
    color: "magenta",
  },
});
