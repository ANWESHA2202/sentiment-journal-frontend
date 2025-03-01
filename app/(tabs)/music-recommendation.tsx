import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { Menu } from "@/components/ui/Menu";
import { ThemedView } from "@/components/ThemedView";

const MusicRecommendation = () => {
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [createPlaylistModal, setCreatePlaylistModal] = useState(false);
  const [openPlaylistModal, setOpenPlaylistModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SENTIMENT_API_URL}/recommendedPlaylist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotifyAccessToken: user?.spotifyAccessToken,
          userId: user?.uid,
          spotifyRefreshToken: user?.spotifyRefreshToken,
        }),
      }
    );
    const data = await response.json();
    setRecommendations(data);

    setLoading(false);
  };

  const fetchPlaylists = async () => {
    setIsUpdating(true);
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SENTIMENT_API_URL}/crudPlaylist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.uid,
          spotifyAccessToken: user?.spotifyAccessToken,
          spotifyRefreshToken: user?.spotifyRefreshToken,
          action: "fetchAllPlaylists",
        }),
      }
    );
    const data = await response.json();
    console.log(data, "data");
    setPlaylists(data?.playlists?.items || []);
    setIsUpdating(false);
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName) {
      setError("Playlist name is required");
      return;
    }
    try {
      setIsUpdating(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SENTIMENT_API_URL}/crudPlaylist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playlistData: {
              name: playlistName || "",
              description: playlistDescription || "",
              public: !isPrivate,
            },
            trackId: selectedTrack?.uri,
            userId: user?.uid,
            spotifyAccessToken: user?.spotifyAccessToken,
            spotifyRefreshToken: user?.spotifyRefreshToken,
            action: "createPlaylist",
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCreatePlaylistModal(false);
        Alert.alert("Playlist created successfully");
      } else {
        setError("Error creating playlist");
      }
    } catch (error) {
      setError("Error creating playlist");
      console.error(error);
    } finally {
      setPlaylistName("");
      setPlaylistDescription("");
      setIsPrivate(true);
      setError("");
      setIsUpdating(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SENTIMENT_API_URL}/crudPlaylist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playlistId,
            trackIds: [selectedTrack?.uri],
            userId: user?.uid,
            spotifyAccessToken: user?.spotifyAccessToken,
            spotifyRefreshToken: user?.spotifyRefreshToken,
            action: "addSongsToPlaylist",
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOpenPlaylistModal(false);
        Alert.alert("Track added to playlist successfully");
      } else {
        setError("Error adding track to playlist");
      }
    } catch (error) {
      setError("Error adding track to playlist");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const thumbnailUrl = item.album?.images?.[2]?.url || "";
    const artistNames = item.artists
      ?.slice(0, 3)
      .map((artist: any) => artist.name)
      .join(", ");

    return (
      <View style={styles.trackItem}>
        <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
        <View style={styles.trackInfo}>
          <ThemedText style={styles.trackName}>{item.name}</ThemedText>
          <ThemedText style={styles.artistNames}>{artistNames}</ThemedText>
        </View>
        <Pressable
          onPress={(event) => {
            const { pageX, pageY } = event.nativeEvent;
            setMenuPosition({ x: pageX, y: pageY });
            setSelectedTrack(item);
            setMenuVisible(true);
          }}
          style={styles.moreButton}
        >
          <MaterialIcons name="more-vert" size={24} color="gray" />
        </Pressable>
      </View>
    );
  };

  const renderPlaylistItem = ({ item }: { item: any }) => {
    const thumbnailUrl = item.images?.[0]?.url || "";

    return (
      <View>
        <Pressable
          style={styles.playlistItem}
          onPress={() => handleAddToPlaylist(item.id)}
        >
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              style={styles.playlistThumbnail}
            />
          ) : (
            <View style={styles.playlistPlaceholder}>
              <MaterialIcons name="queue-music" size={24} color="gray" />
            </View>
          )}
          <View style={styles.playlistInfo}>
            <ThemedText style={styles.playlistName}>{item.name}</ThemedText>
            <ThemedText style={styles.playlistDetails}>
              {item.tracks?.total || 0} tracks •{" "}
              {item.owner?.display_name || "Unknown"}
            </ThemedText>
          </View>
        </Pressable>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);
  console.log(playlists, "playlists");
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Music Recommendation</ThemedText>
      {loading && <ThemedText>Loading...</ThemedText>}
      {recommendations?.length > 0 && (
        <FlatList
          data={recommendations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1DB954"]} // Spotify green color
              tintColor={"#1DB954"}
            />
          }
        />
      )}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        items={[
          {
            title: "Create Playlist",
            onPress: () => {
              setMenuVisible(false);
              setCreatePlaylistModal(true);
            },
          },
          {
            title: "Add to Playlist",
            onPress: () => {
              setMenuVisible(false);
              setOpenPlaylistModal(true);
              fetchPlaylists();
            },
          },
        ]}
        position={menuPosition}
      />

      <Modal
        visible={createPlaylistModal}
        transparent
        animationType="slide"
        onRequestClose={() => setCreatePlaylistModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Create Playlist</ThemedText>

            <TextInput
              style={styles.input}
              placeholder="Playlist Name *"
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholderTextColor="gray"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Playlist Description"
              value={playlistDescription}
              onChangeText={setPlaylistDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="gray"
            />

            <Pressable
              style={styles.checkboxContainer}
              onPress={() => setIsPrivate(!isPrivate)}
            >
              <View style={[styles.checkbox, isPrivate && styles.checked]}>
                {isPrivate && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </View>
              <ThemedText style={styles.checkboxLabel}>
                Keep playlist private
              </ThemedText>
            </Pressable>

            {error && <ThemedText style={styles.error}>{error}</ThemedText>}

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setCreatePlaylistModal(false);
                  setError("");
                }}
              />
              <Button
                title="Create"
                disabled={!playlistName}
                onPress={handleCreatePlaylist}
              />
            </View>
          </ThemedView>
        </View>
      </Modal>

      <Modal
        visible={openPlaylistModal}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenPlaylistModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOpenPlaylistModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e: any) => e.stopPropagation()}
          >
            <ThemedText style={styles.modalTitle}>Select Playlist</ThemedText>
            {isUpdating ? (
              <ThemedText>Loading...</ThemedText>
            ) : (
              <FlatList
                data={playlists}
                renderItem={renderPlaylistItem}
                keyExtractor={(item) => item.id}
                style={styles.playlistList}
                contentContainerStyle={styles.playlistListContent}
              />
            )}
            <Button title="Close" onPress={() => setOpenPlaylistModal(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </ThemedView>
  );
};

export default MusicRecommendation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "500",
  },
  artistNames: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  moreButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    backgroundColor: "#121212",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#666",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#666",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  error: {
    color: "red",
    marginVertical: 5,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  playlistThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  playlistPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "500",
  },
  playlistDetails: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  playlistList: {
    maxHeight: 300,
    marginBottom: 15,
  },
  playlistListContent: {
    flexGrow: 1,
  },
});
