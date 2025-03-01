import React from "react";
import { View, Modal, Pressable, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "../ThemedText";

interface MenuItem {
  title: string;
  onPress: () => void;
}

interface MenuProps {
  visible: boolean;
  onDismiss: () => void;
  items: MenuItem[];
  position: { x: number; y: number };
}

export const Menu = ({ visible, onDismiss, items, position }: MenuProps) => {
  const windowWidth = Dimensions.get("window").width;

  // Calculate menu position
  const menuStyle = {
    position: "absolute" as const,
    right: windowWidth - position.x,
    top: position.y,
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <View style={[styles.menu, menuStyle]}>
          {items.map((item, index) => (
            <Pressable
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <ThemedText>{item.title}</ThemedText>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menu: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    padding: 16,
  },
});
