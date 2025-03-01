import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getUserName, profileSettingOptions } from "@/services/util";
import { Collapsible } from "@/components/Collapsible";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { updateUserProfile } from "@/services/authService";

const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = makeRedirectUri();
const SCOPES = [
  "user-read-recently-played",
  "user-top-read",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-playback-position",
  "user-read-private",
].join(" ");

const Profile = () => {
  const { user, setUser } = useGlobalContext();
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const handleSpotifyAuth = async () => {
    try {
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=${encodeURIComponent(SCOPES)}`;

      const response = await WebBrowser.openAuthSessionAsync(
        authUrl,
        REDIRECT_URI
      );
      if (response.type === "success") {
        const { url } = response;
        // Extract authorization code from URL
        const code = url.split("code=")[1].split("&")[0];

        // You'll need to exchange this code for access and refresh tokens
        // This should be done on your backend to keep client_secret secure
        const tokenResponse = await fetch(
          "https://accounts.spotify.com/api/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
              REDIRECT_URI
            )}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
          }
        );

        const tokens = await tokenResponse.json();
        // Now you'll have both access_token and refresh_token
        if (tokens?.access_token) {
          const profileUpdate = await updateUserProfile(user, {
            spotifyAccessToken: tokens.access_token,
            spotifyRefreshToken: tokens.refresh_token,
          });
          if (profileUpdate) {
            setUser((prev: any) => {
              return { ...prev, spotifyAccessToken: tokens.access_token };
            });
          }
        }
      }
    } catch (error) {
      console.error("Spotify authentication failed:", error);
    }
  };

  const handleSpotifyAuthDelete = async () => {
    const profileUpdate = await updateUserProfile(user, {
      spotifyAccessToken: "",
    });
    if (profileUpdate) {
      setUser((prev: any) => {
        return { ...prev, spotifyAccessToken: "" };
      });
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.sectionContainer}>
      <Collapsible
        title={item.headerTitle}
        open={false}
        otherStyles={{ position: "relative", minHeight: 0, width: "100%" }}
        childrenStyles={{ minHeight: 0 }}
      >
        <FlatList
          data={item.subOptions}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item: subItem }) => (
            <View style={styles.subOptionContainer}>
              <TouchableOpacity
                style={styles.subOptionItem}
                onPress={() => {
                  if (user?.spotifyAccessToken?.length > 0) {
                    handleSpotifyAuthDelete();
                  } else {
                    handleSpotifyAuth();
                  }
                }}
              >
                <MaterialCommunityIcons
                  name={subItem.icon}
                  size={20}
                  color={
                    subItem.title === "Spotify" &&
                    user?.spotifyAccessToken?.length
                      ? "green"
                      : "gray"
                  }
                />
                <ThemedText style={styles.subOptionText}>
                  {subItem.title}
                </ThemedText>
              </TouchableOpacity>
              {subItem.title === "Spotify" && (
                <TouchableOpacity
                  style={{
                    ...styles.chipButton,

                    borderColor:
                      user?.spotifyAccessToken?.length > 0 ? "red" : "green",
                  }}
                  onPress={() => {
                    if (user?.spotifyAccessToken?.length > 0) {
                      handleSpotifyAuthDelete();
                    } else {
                      handleSpotifyAuth();
                    }
                  }}
                >
                  <ThemedText
                    style={{
                      ...styles.chipText,
                      color:
                        user?.spotifyAccessToken?.length > 0 ? "red" : "green",
                    }}
                  >
                    {user?.spotifyAccessToken?.length > 0
                      ? "Disable"
                      : "Enable"}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          )}
          scrollEnabled={true}
        />
      </Collapsible>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* header section */}
      <View style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <MaterialCommunityIcons
            name="account-circle"
            size={100}
            color="gray"
            style={{
              textAlign: "center",
            }}
          />
        </View>

        <View style={styles.profileInfoContainer}>
          <ThemedText type="defaultSemiBold">
            Hello, {getUserName(user)}
          </ThemedText>
        </View>
      </View>
      {/* body section */}

      <FlatList
        data={profileSettingOptions}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.settingsContainer}
        showsVerticalScrollIndicator={false}
        style={styles.flatListStyle}
      />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 75,
    width: "100%",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  profileContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfoContainer: {
    marginTop: 20,
  },
  settingsContainer: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
  sectionContainer: {
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 0.3,
    borderColor: "gray",
    overflow: "hidden",
    width: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  headerTitle: {
    flex: 1,
    margin: 20,
    marginLeft: 10,
  },
  subOptionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  subOptionContainer: {
    padding: 15,
    paddingLeft: 20,
    borderTopWidth: 0.3,
    borderTopColor: "gray",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
  },
  subOptionText: {
    marginLeft: 10,
  },
  flatListStyle: {
    width: "100%",
  },
  chipButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 3,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginLeft: 26,
    marginBottom: 10,
  },
  chipText: {
    fontSize: 12,
  },
});
