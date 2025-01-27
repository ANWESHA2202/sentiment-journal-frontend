import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

interface CustomButtonProps {
  title: string;
  handlePress?: () => void;
  containerStyles?: object;
  textStyles?: object;
  isLoading?: boolean;
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.container,
        isLoading && styles.loadingState,
        containerStyles,
      ]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "purple",
    borderRadius: 12,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingState: {
    opacity: 0.5,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
