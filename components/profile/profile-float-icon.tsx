import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
const ProfileFloatIcon = () => {
  const [showPopover, setShowPopover] = useState(false);
  const { user } = useGlobalContext();
  console.log("user", user?.providerData);
  return (
    <View>
      <View style={styles.floatingIcon}>
        <TouchableOpacity onPress={() => setShowPopover(!showPopover)}>
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

      {showPopover && (
        <View style={styles.popover}>
          <TouchableOpacity
            style={styles.popoverItem}
            onPress={() => {
              router.push("/(tabs)/profile" as any);
              setShowPopover(false);
            }}
          >
            <MaterialCommunityIcons name="account" size={24} color="gray" />
            <Text style={styles.popoverText}>Profile</Text>
          </TouchableOpacity>

          {user?.spotifyAccessToken && (
            <TouchableOpacity
              style={styles.popoverItem}
              onPress={() => {
                router.push("/music-recommendation" as any);
                setShowPopover(false);
              }}
            >
              <MaterialCommunityIcons name="music" size={24} color="gray" />
              <Text style={styles.popoverText}>Music recommendations</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.popoverItem}
            onPress={() => {
              signOut(auth);
              setShowPopover(false);
              router.replace("/" as any);
            }}
          >
            <MaterialCommunityIcons name="music" size={24} color="gray" />
            <Text style={styles.popoverText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
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
    borderColor: "#ffffff",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popover: {
    position: "absolute",
    top: 90,
    right: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 8,
  },
  popoverText: {
    fontSize: 16,
    color: "#ffffff",
  },
});
