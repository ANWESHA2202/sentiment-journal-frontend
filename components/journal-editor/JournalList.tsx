import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Platform,
  TouchableHighlight,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Journal } from "@/typeDeclarations";
import { useGlobalContext } from "@/context/GlobalProvider";
import { deleteJournal, getJournals } from "@/services/journalServices";
import { ThemedText } from "../ThemedText";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";

const JournalItem = ({
  journal,
  refetch,
}: {
  journal: Journal;
  refetch: () => Promise<void>;
}) => {
  const shortedContent = JSON.parse(journal?.content)?.[0]?.text;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteJournal(journal.id as string);
      if (response) {
        setShowDeleteModal(false);
        refetch();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete journal");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={styles.journalItem}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="book" size={24} color="#666" />
      </View>
      <View style={styles.contentContainer}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {journal.title}
        </ThemedText>
        <ThemedText style={styles.preview}>
          {shortedContent?.slice(0, 100)}
          {shortedContent?.length > 100 && "..."}
        </ThemedText>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setShowDeleteModal(true)}
        disabled={isDeleting}
      >
        <MaterialIcons name="delete-outline" size={24} color="#FF6B6B" />
      </TouchableOpacity>

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
              Delete Journal
            </ThemedText>
            <ThemedText style={styles.modalText}>
              Are you sure you want to delete this journal? This action cannot
              be undone.
            </ThemedText>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                disabled={isDeleting}
                onPress={() => setShowDeleteModal(false)}
              >
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                disabled={isDeleting}
                onPress={() => {
                  handleDelete();
                }}
              >
                <ThemedText
                  style={[styles.buttonText, styles.deleteButtonText]}
                >
                  Delete
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const JournalList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [journals, setJournals] = useState<Journal[]>([]);
  const { user } = useGlobalContext();

  const fetchJournals = async () => {
    setIsLoading(true);
    const journals = await getJournals(user?.uid);

    setJournals(journals);
    setIsLoading(false);
  };

  const handleUpdateJournal = (journal: Journal) => {
    const createdAt =
      journal.createdAt instanceof Timestamp
        ? journal.createdAt.toDate()
        : journal.createdAt;
    const now = new Date();
    const hoursDifference =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDifference <= 12) {
      router.push(`/edit-journal/${journal.id}`);
    } else {
      Alert.alert(
        "Cannot Edit Journal",
        "Journals can only be edited within 12 hours of creation.",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchJournals();
    }
    return () => {
      setJournals([]);
    };
  }, [user?.uid]);
  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }
  if (journals?.length === 0) {
    return (
      <View>
        <ThemedText>No journals found</ThemedText>
        <TouchableOpacity onPress={() => router.push("/write-journal")}>
          <ThemedText>Go head to create your first journal...</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        ItemSeparatorComponent={
          Platform.OS !== "android"
            ? ({ highlighted }) => (
                <View
                  style={[styles.separator, highlighted && { marginLeft: 0 }]}
                />
              )
            : null
        }
        data={journals}
        ListHeaderComponent={
          <ThemedText type="subtitle">Journal List</ThemedText>
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index, separators }) => (
          <TouchableHighlight
            key={item.id}
            onPress={() => handleUpdateJournal(item)}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}
          >
            <JournalItem journal={item} refetch={fetchJournals} />
          </TouchableHighlight>
        )}
        onRefresh={fetchJournals}
        scrollEnabled
        refreshing={isLoading}
      />
    </View>
  );
};

export default JournalList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  journalItem: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  listContent: {
    paddingBottom: 20,
  },
  list: {
    width: "98%",
    marginHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#333",
  },
  deleteConfirmButton: {
    backgroundColor: "#FF6B6B",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
  },
  deleteButtonText: {
    color: "#fff",
  },
});
