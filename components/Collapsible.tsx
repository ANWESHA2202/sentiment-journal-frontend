import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export function Collapsible({
  children,
  title,
  open = false,
  otherStyles,
  childrenStyles = {},
}: PropsWithChildren & {
  title: string;
  open?: boolean;
  otherStyles?: object;
  childrenStyles?: object;
}) {
  const [isOpen, setIsOpen] = useState(open);
  const theme = "dark";

  return (
    <ThemedView style={{ ...styles.collapsibleContainer, ...otherStyles }}>
      {!open && (
        <TouchableOpacity
          style={styles.heading}
          onPress={() => setIsOpen((value) => !value)}
          activeOpacity={0.8}
        >
          <IconSymbol
            name="chevron.right"
            size={18}
            weight="medium"
            color={Colors.dark.icon}
            style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
          />

          <ThemedText type="defaultSemiBold">{title}</ThemedText>
        </TouchableOpacity>
      )}
      {isOpen && (
        <ThemedView style={{ ...styles.content, ...childrenStyles }}>
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
    minHeight: 500,
  },
  collapsibleContainer: {
    minHeight: 500,
    position: "absolute",
    left: 0,
    bottom: 0,
  },
});
