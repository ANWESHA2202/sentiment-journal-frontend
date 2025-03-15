import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getJournal, updateJournal } from "@/services/journalServices";
import Editor from "@/components/journal-editor/Editor";
import { TextBlock } from "../../write-journal";
import { Journal } from "@/typeDeclarations";

const EditJournal = () => {
  const { "journal-id": journalId } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [journal, setJournal] = useState<Journal | null>(null);
  const [content, setContent] = useState<TextBlock[]>([
    { text: "", style: {} },
  ]);

  const fetchJournal = async () => {
    const journal = await getJournal(journalId as string);
    if (journal) {
      setJournal(journal);
      setTitle(journal.title);
      setContent(JSON.parse(journal.content));
    }
  };

  const analyzeJournal = async (textContent: string, id?: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SENTIMENT_API_URL}/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: textContent,
          }),
        }
      );
      const data = await response.json();
      if (data?.length && id) {
        updateJournal({
          journalId: id,
          title,
          content: JSON.stringify(content),
          textContent,
          sentiment: JSON.stringify(data),
        });
      }
    } catch (error) {
      console.error("Error analyzing journal:", error);
    }
  };

  const handleSave = async () => {
    const textContent = content?.map((item) => item?.text).join(". ");
    const payload = {
      journalId: journalId as string,
      title,
      content: JSON.stringify(content),
      textContent,
      callback: () => {
        analyzeJournal(textContent, journalId as string);
        Alert.alert("Journal updated");
        router.push("/" as any);
      },
    };
    await updateJournal(payload);
  };

  const isSavingDisabled = useMemo(() => {
    return (
      journal?.title === title && journal?.content === JSON.stringify(content)
    );
  }, [title, content]);

  useEffect(() => {
    fetchJournal();
  }, []);

  return (
    <Editor
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      handleSave={handleSave}
      isSavingDisabled={isSavingDisabled}
    />
  );
};

export default EditJournal;

const styles = StyleSheet.create({});
