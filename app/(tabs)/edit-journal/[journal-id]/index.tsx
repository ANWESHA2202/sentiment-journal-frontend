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

  const handleSave = async () => {
    const payload = {
      journalId: journalId as string,
      title,
      content: JSON.stringify(content),
      textContent: content?.map((item) => item?.text).join(". "),
      callback: () => {
        Alert.alert("Journal updated");
        router.push("/");
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
