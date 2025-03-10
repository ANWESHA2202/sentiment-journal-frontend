import { StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import JournalList from "@/components/journal-editor/JournalList";
import Chart from "@/components/chart/Chart";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Chart />
      <JournalList />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 50,
    marginTop: 75,
  },
});
