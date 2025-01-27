import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";
import FormField from "@/components/ui/FormField";
import CustomButton from "@/components/ui/CustomButton";
import { Link, router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signInUser, signUp } from "@/services/authService";

const SignUp = ({ setOpenAuth }: { setOpenAuth: (value: boolean) => void }) => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async () => {
    if (!form.email || !form.password || !form.confirmPassword) {
      Alert.alert("Error", "Please fill in all the fields");
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await signUp(form.email, form.password, form.username);
      setUser(result);
      setIsLoggedIn(true);
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
          <Text style={styles.title}>Sign Up to Yours</Text>
          <FormField
            title="Username"
            value={form.username}
            handleChange={(e: string) => setForm({ ...form, username: e })}
            otherStyles={styles.formField}
          />
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
          <FormField
            title="Password"
            label="Confirm Password"
            value={form.confirmPassword}
            handleChange={(e: string) =>
              setForm({ ...form, confirmPassword: e })
            }
            otherStyles={styles.formField}
          />

          <CustomButton
            title="Sign In"
            handlePress={submitHandler}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

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
});
