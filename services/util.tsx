export const getUserName = (user: any) => {
  if (user?.displayName) {
    return user.displayName;
  }

  if (user?.email) {
    // Extract name from email (everything before @)
    return user.email.split("@")[0];
  }

  return "Guest";
};

export const profileSettingOptions = [
  {
    headerTitle: "Integrations",
    headerIcon: "integration",
    subOptions: [
      {
        title: "Spotify",
        icon: "spotify",
      },
    ],
  },
];
