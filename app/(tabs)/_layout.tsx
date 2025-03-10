import { Tabs, usePathname } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import WriteJournal from "@/components/write-journal";
import ProfileFloatIcon from "@/components/profile/profile-float-icon";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const showTabs = pathname !== "/" && pathname !== "/write-journal";
  const showProfile =
    pathname !== "/" &&
    pathname !== "/write-journal" &&
    pathname !== "/profile";

  return (
    <>
      {showProfile && <ProfileFloatIcon />}
      {showTabs && <WriteJournal />}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,

          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            display: "none",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
