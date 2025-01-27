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
} from "react-native";
import React, { useEffect, useState } from "react";
import { Journal } from "@/typeDeclarations";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getJournals } from "@/services/journalServices";
import { ThemedText } from "../ThemedText";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";

const JournalItem = ({ journal }: { journal: Journal }) => {
  const shortedContent = JSON.parse(journal?.content)?.[0]?.text;

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
      <TouchableOpacity style={styles.deleteButton}>
        <MaterialIcons name="delete-outline" size={24} color="#FF6B6B" />
      </TouchableOpacity>
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
  }, [user?.uid]);
  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }
  if (journals.length === 0) {
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
    <View>
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
        renderItem={({ item, index, separators }) => (
          <TouchableHighlight
            key={item.id}
            onPress={() => handleUpdateJournal(item)}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}
          >
            <JournalItem journal={item} />
          </TouchableHighlight>
        )}
        onRefresh={fetchJournals}
        refreshing={isLoading}
      />
    </View>
  );
};

export default JournalList;

const styles = StyleSheet.create({
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
  list: {
    width: "98%",
    marginHorizontal: 5,
  },
});
