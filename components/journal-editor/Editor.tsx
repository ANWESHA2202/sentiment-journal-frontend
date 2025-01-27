import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useMemo, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import FormField from "@/components/ui/FormField";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  heading?: boolean;
}

interface TextBlock {
  text: string;
  style: TextStyle;
}

interface EditorProps {
  title: string;
  setTitle: (title: string) => void;
  content: TextBlock[];
  setContent: (content: TextBlock[]) => void;
  handleSave: () => void;
  isSavingDisabled?: boolean;
}

const Editor = ({
  title,
  setTitle,
  content,
  setContent,
  handleSave,
  isSavingDisabled = false,
}: EditorProps) => {
  const [currentStyles, setCurrentStyles] = useState<TextStyle>({});
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const toggleStyle = (style: keyof TextStyle) => {
    setCurrentStyles((prev) => ({
      ...prev,
      [style]: !prev[style],
    }));
  };

  const handleContentChange = (text: string, index: number) => {
    const newContent = [...content];
    newContent[index] = {
      text,
      style: { ...currentStyles },
    };
    setContent(newContent);
  };

  const addNewBlock = () => {
    setContent([...content, { text: "", style: {} }]);
    setActiveBlockIndex(content.length);
  };

  const saveJournal = async () => {
    setIsSaving(true);
    await handleSave();
    setIsSaving(false);
  };

  const isDisabled = useMemo(
    () =>
      isSaving ||
      title?.length === 0 ||
      content?.length === 0 ||
      isSavingDisabled,
    [isSaving, title, content, isSavingDisabled]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText>What's on your mind?</ThemedText>
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
          disabled={isDisabled}
          onPress={() => {
            saveJournal();
          }}
        >
          <FontAwesome6
            name="check-double"
            size={12}
            color={isDisabled ? "#666" : "white"}
          />
          <ThemedText style={{ color: isDisabled ? "#666" : "white" }}>
            {isSaving ? "Saving..." : "Save"}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <FormField
        title=""
        value={title}
        handleChange={(text) => setTitle(text)}
        placeholder="Journal Title"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.editorContainer}
      >
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              currentStyles.bold && styles.activeButton,
            ]}
            onPress={() => toggleStyle("bold")}
          >
            <ThemedText style={styles.toolbarButtonText}>B</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              currentStyles.italic && styles.activeButton,
            ]}
            onPress={() => toggleStyle("italic")}
          >
            <ThemedText style={styles.toolbarButtonText}>I</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toolbarButton,
              currentStyles.heading && styles.activeButton,
            ]}
            onPress={() => toggleStyle("heading")}
          >
            <ThemedText style={styles.toolbarButtonText}>H</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.editor}>
          {content.map((block, index) => (
            <TextInput
              key={index}
              multiline
              value={block.text}
              onChangeText={(text) => handleContentChange(text, index)}
              onFocus={() => setActiveBlockIndex(index)}
              style={[
                styles.input,
                block.style.bold && styles.boldText,
                block.style.italic && styles.italicText,
                block.style.heading && styles.headingText,
              ]}
              placeholder={index === 0 ? "Start writing here..." : ""}
              placeholderTextColor="#666"
              selectionColor="#666"
            />
          ))}
          <TouchableOpacity onPress={addNewBlock} style={styles.addButton}>
            <ThemedText>+ Add new paragraph</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Editor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    marginTop: 80,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editorContainer: {
    flex: 1,
    marginTop: 20,
  },
  editor: {
    flex: 1,
    padding: 10,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "#1a1a1a",
  },
  toolbar: {
    flexDirection: "row",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    padding: 5,
  },
  toolbarButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  toolbarButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  activeButton: {
    backgroundColor: "#333",
  },
  input: {
    minHeight: 40,
    padding: 5,
    marginVertical: 2,
    color: "#fff",
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
  italicText: {
    fontStyle: "italic",
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
