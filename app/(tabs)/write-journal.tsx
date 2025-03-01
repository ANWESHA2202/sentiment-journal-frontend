import { Alert } from "react-native";
import React, { useState } from "react";
import Editor from "@/components/journal-editor/Editor";
import { addJournal, updateJournal } from "@/services/journalServices";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  heading?: boolean;
}

export interface TextBlock {
  text: string;
  style: TextStyle;
}

const WriteJournal = () => {
  const { user } = useGlobalContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<TextBlock[]>([
    { text: "", style: {} },
  ]);

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
      userId: user?.uid,
      title,
      textContent,
      content: JSON.stringify(content),
      callback: (id?: string) => {
        analyzeJournal(textContent, id);
        Alert.alert("Journal saved");
        router.push("/");
      },
    };
    await addJournal(payload);
  };

  return (
    <Editor
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      handleSave={handleSave}
    />
  );
};

export default WriteJournal;
