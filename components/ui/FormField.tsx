import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

interface FormFieldProps {
  title: string;
  value: any;
  handleChange: (e: string) => void;
  otherStyles?: object;
  keyboardType?: string;
  [key: string]: any;
}

const FormField = ({
  title,
  value,
  handleChange,
  otherStyles,
  keyboardType,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={{ ...styles.container, ...otherStyles }}>
      <Text style={styles.title}>{props?.label || title}</Text>
      <View key={title} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={props.placeholder}
          placeholderTextColor={"#7b7b8b"}
          onChangeText={handleChange}
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    color: "#f3f4f6",
    fontFamily: "Poppins-Medium",
  },
  inputContainer: {
    width: "100%",
    marginTop: 8,
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#18181b",
    borderWidth: 2,
    borderColor: "#27272a",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "white",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
