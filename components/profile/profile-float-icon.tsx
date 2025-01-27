import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const ProfileFloatIcon = () => {
  return (
    <View style={styles.floatingIcon}>
      <TouchableOpacity onPress={() => router.push("/profile")}>
        <MaterialCommunityIcons
          name="account-circle"
          size={40}
          color="gray"
          style={{
            textAlign: "center",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileFloatIcon;

const styles = StyleSheet.create({
  floatingIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "transparent",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "gray",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
