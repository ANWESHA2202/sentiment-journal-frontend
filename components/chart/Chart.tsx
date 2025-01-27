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
  const [period, setPeriod] = useState<string>("weekly");
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState("neutral");

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
            emotion: selectedEmotion,
          }),
        }
      );
      const data = await response.json();
      console.log(data, "dataset");
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
  }, [user, period, selectedEmotion]);

  const formatLabel = (date: string, period: string) => {
    if (!date) return "";

    switch (period) {
      case "weekly":
        // Assuming the date represents the start of the week
        // @ts-ignore
        const weekNum = new Date(date).getWeek();
        return `Week ${weekNum}`;

      case "monthly":
        const monthDate = new Date(date);
        return monthDate.toLocaleString("default", { month: "short" });

      case "daily":
      default:
        // Keep the original date format or format as needed
        return date;
    }
  };

  // Add this helper function for getting week number
  // @ts-ignore
  Date.prototype.getWeek = function () {
    const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (this.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const labels =
    data?.map((item: any) => formatLabel(item?.date, period)) || [];
  const scores =
    data?.map((item: any) => {
      const score = parseFloat(item?.avgScore);
      return isNaN(score) ? 0 : score;
    }) || [];
  console.log("showing charts");
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
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowEmotionPicker(true)}
              >
                <View style={styles.dropdownContent}>
                  <ThemedText style={{ fontSize: 14 }}>
                    {
                      emotionEmojis[
                        selectedEmotion as keyof typeof emotionEmojis
                      ]
                    }
                  </ThemedText>
                  <ThemedText style={{ fontSize: 12, marginLeft: 4 }}>
                    ▼
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </View>

            <Modal
              visible={showEmotionPicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowEmotionPicker(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowEmotionPicker(false)}
              >
                <View style={styles.modalContent}>
                  {Object.entries(emotionEmojis).map(([emotion, emoji]) => (
                    <TouchableOpacity
                      key={emotion}
                      style={styles.emotionItem}
                      onPress={() => {
                        setSelectedEmotion(emotion);
                        setShowEmotionPicker(false);
                      }}
                    >
                      <ThemedText style={styles.emotionText}>
                        {emoji} {emotion}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            <View style={styles.periods}>
              {availablePeriods.map((p, index) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.periodButton,
                    index !== availablePeriods.length - 1 &&
                      styles.periodDivider,
                    p === period && styles.activePeriod,
                  ]}
                  onPress={() => setPeriod(p)}
                >
                  <ThemedText
                    style={{
                      fontSize: 12,
                      ...(p === period && styles.activeText),
                    }}
                  >
                    {p}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={styles.yAxisLabel}>Emotion Quotient →</Text>
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: scores.length > 0 ? scores : [0],
                },
              ],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1}
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
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text style={styles.xAxisLabel}>Time Period →</Text>
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
    left: -50,
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
