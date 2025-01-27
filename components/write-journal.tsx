import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const WriteJournal = () => {
  return (
    <View style={styles.floatingIcon}>
      <TouchableOpacity onPress={() => router.push("/write-journal")}>
        <MaterialCommunityIcons
          name="notebook-edit-outline"
          size={24}
          color="magenta"
          style={{
            textAlign: "center",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default WriteJournal;

const styles = StyleSheet.create({
  floatingIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "whitesmoke",
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "purple",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
