import { Alert } from "react-native";
import React, { useState } from "react";
import Editor from "@/components/journal-editor/Editor";
import { addJournal } from "@/services/journalServices";
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

  const handleSave = async () => {
    const payload = {
      userId: user?.uid,
      title,
      textContent: content?.map((item) => item?.text).join(". "),
      content: JSON.stringify(content),
      callback: () => {
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
