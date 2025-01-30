import { useGlobalContext } from "@/context/GlobalProvider";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { availablePeriods, emotionEmojis } from "@/constants/data";
import { ThemedText } from "../ThemedText";

const Chart = () => {
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [period, setPeriod] = useState<string>("short_term");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://192.168.31.61:5002/api/sentiment/generateGraph",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.uid,
            period: period,
          }),
        }
      );
      const data = await response.json();

      setData(data);
    } catch (error) {
      console.error("Error fetching or analyzing journals:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.uid) {
      fetchData();
    }
    return () => {
      setData([]);
    };
  }, [user, period]);

  // Update the labels and scores preparation
  const chartData = data?.sort((a: any, b: any) => b.avgScore - a.avgScore); // Sort by avgScore
  const labels = chartData?.map((item: any) => item.label) || [];
  const scores = chartData?.map((item: any) => item.avgScore) || [];

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.chartContainer}>
          <View style={styles.optionsContainer}>
            <View style={[styles.skeletonBox, { width: 80, height: 30 }]} />
            <View style={[styles.skeletonBox, { width: 150, height: 30 }]} />
          </View>
          <View
            style={[
              styles.skeletonBox,
              {
                width: Dimensions.get("window").width - 60,
                height: 220,
                marginTop: 20,
              },
            ]}
          />
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <View style={styles.optionsContainer}>
            <View style={styles.periods}>
              {availablePeriods?.map((p, index) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.periodButton,
                    index !== availablePeriods.length - 1 &&
                      styles.periodDivider,
                    p.value === period && styles.activePeriod,
                  ]}
                  onPress={() => setPeriod(p.value)}
                >
                  <ThemedText
                    style={{
                      fontSize: 12,
                      ...(p.value === period && styles.activeText),
                    }}
                  >
                    {p.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={styles.yAxisLabel}>Score →</Text>
          <LineChart
            data={{
              labels: labels?.map(
                (label: string) =>
                  emotionEmojis[label as keyof typeof emotionEmojis]
              ),
              datasets: [
                {
                  data: scores?.length > 0 ? scores : [0],
                },
              ],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            yAxisSuffix=""
            yAxisInterval={0.2} // Changed to show more y-axis lines
            chartConfig={{
              backgroundColor: "#08130d",
              backgroundGradientFrom: "#08130d",
              backgroundGradientTo: "#08130d",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
                padding: 10,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
              formatYLabel: (value) => parseFloat(value)?.toFixed(1),
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text style={styles.xAxisLabel}>Emotions →</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Chart;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  periods: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#fff",
    borderRadius: 5,
    padding: 1,
  },
  periodButton: {
    backgroundColor: "#08130d",
    padding: 1,
    fontSize: 10,
    paddingHorizontal: 8,
  },

  periodDivider: {
    borderRightWidth: 0.5,
    borderRightColor: "#fff",
  },
  activePeriod: {
    backgroundColor: "#1a2f23",
  },
  activeText: {
    color: "#ffa726",
  },
  chartContainer: {
    position: "relative",
    alignItems: "center",
    backgroundColor: "#08130d",
    borderRadius: 16,
    padding: 10,
  },
  yAxisLabel: {
    position: "absolute",
    left: 0,
    top: "40%",
    transform: [{ rotate: "-90deg" }],
    color: "white",
    fontSize: 12,
    zIndex: 100,
  },
  xAxisLabel: {
    color: "white",
    fontSize: 12,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#08130d",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#08130d",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  emotionItem: {
    padding: 10,
    borderBottomWidth: 1,
    width: "100%",
  },
  emotionText: {
    fontSize: 16,
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonBox: {
    backgroundColor: "#1a2f23",
    borderRadius: 8,
    overflow: "hidden",
  },
});
