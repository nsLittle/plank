import { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProgressScreen() {
  const [progressToday, setProgressToday] = useState(null);
  const [todaysSessions, setTodaysSessions] = useState([]);
  const [progressMonth, setProgressMonth] = useState(null);
  const [progressYear, setProgressYear] = useState(null);
  const [progressAll, setProgressAll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Today");

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m > 0 ? `${m}m ` : ""}${s} seconds`;
  };

  const getAverageTime = (summaryProgress) => {
    if (!summaryProgress || summaryProgress.totalReps === 0) return 0;
    return Math.round(summaryProgress.totalTime / summaryProgress.totalReps);
  };

  const routeMap = {
    Today: "getTodaysProgress",
    Month: "getMonthlyProgress",
    Year: "getYearlyProgress",
    All: "getAllProgress",
  };

  const getSummaryProgress = () => {
    switch (activeTab) {
      case "Today":
        return progressToday;
      case "Month":
        return progressMonth;
      case "Year":
        return progressYear;
      case "All":
        return progressAll;
      default:
        return null;
    }
  };

  const plankTypes = [
    "basic plank",
    "elbow plank",
    "raised leg left",
    "raised leg right",
    "left side plank",
    "right side plank",
  ];

  const fetchProgress = async (tab: string) => {
    const base = "192.168.1.174";
    const route = routeMap[tab];
    const url = `http://${base}:8000/laps/${route}`;

    const storedUser = await AsyncStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const token = parsedUser?.token;

    if (!token) {
      console.error("No token found in AsyncStorage");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Fetched Progress:", data);

      switch (tab) {
        case "Today":
          setProgressToday(data);
          break;
        case "Month":
          setProgressMonth(data);
          break;
        case "Year":
          setProgressYear(data);
          break;
        case "All":
          setProgressAll(data);
          break;
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching progress:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load progress",
        text2: "Please check your connection or try again later.",
      });
    }
  };

  const fetchTodaysSessions = async () => {
    const base = "192.168.1.174"; // adjust if needed
    const url = `http://${base}:8000/laps/getTodaysSessions`;

    const storedUser = await AsyncStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const token = parsedUser?.token;

    if (!token) {
      console.error("No token found in AsyncStorage");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Fetched today's sessions:", data);
      setTodaysSessions(data);
    } catch (error) {
      console.error("Error fetching today's sessions:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load sessions",
        text2: "Check your connection or try again.",
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProgress(activeTab);

    if (activeTab === "Today") {
      fetchTodaysSessions();
    } else {
      setTodaysSessions([]);
    }
  }, [activeTab]);

  const summaryProgress = getSummaryProgress();

  return (
    <View
      style={[
        styles.container,
        Platform.OS === "web" && { minHeight: "100vh", overflowY: "auto" },
      ]}>
      {/* Tab Navigation */}
      <View style={styles.tabWrapper}>
        <View style={styles.tabPill}>
          {["Today", "Month", "Year", "All"].map((label) => (
            <TouchableOpacity
              key={label}
              style={[styles.tab, activeTab === label && styles.tabActive]}
              onPress={() => setActiveTab(label)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === label && styles.tabTextActive,
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : summaryProgress ? (
            <>
              {/* Progress Summary */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Progress</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>
                      Total Plank Reps Logged
                    </Text>
                    <Text style={styles.statValue}>
                      {summaryProgress.totalReps || 0}
                    </Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>
                      Total Plank Time Logged
                    </Text>
                    <Text style={styles.statValue}>
                      {formatTime(summaryProgress.totalTime || 0)}
                    </Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Average Plank Rep Time</Text>
                    <Text style={styles.statValue}>
                      {formatTime(getAverageTime(summaryProgress))}
                    </Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Longest Plank Rep Time</Text>
                    <Text style={styles.statValue}>
                      {formatTime(summaryProgress.longestPlank || 0)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Totals by Type */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {activeTab} - Totals by Type
                </Text>
                <View style={styles.typeGrid}>
                  {plankTypes.map((type) => {
                    const stats = summaryProgress?.byType?.[type];
                    const total = stats?.total || 0;

                    return (
                      <View key={type} style={styles.typeCard}>
                        <Text style={styles.statLabel}>
                          {type.replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Text>
                        <Text style={styles.statValue}>
                          {formatTime(total)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>
              No progress found for {activeTab.toLowerCase()}.
            </Text>
          )}

          {/* Today's Sessions */}
          {activeTab === "Today" && todaysSessions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Session Breakdown</Text>
              {todaysSessions.map((session, index) => (
                <View key={index} style={styles.sessionRow}>
                  <Text style={styles.sessionTime}>
                    {new Date(session.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <View>
                    <Text style={styles.sessionLabel}>
                      {session.type.replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Text>
                    <Text style={styles.sessionDuration}>
                      {formatTime(session.duration)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: wp("5%"),
    minHeight: "100%",
  },
  tabWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 225,
    marginBottom: 20,
  },
  tabPill: {
    flexDirection: "row",
    backgroundColor: "#D3A4E0",
    borderRadius: 50,
    padding: 4,
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#8A5F9E",
  },
  tabText: {
    color: "#8A5F9E",
    fontSize: 16,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "white",
    fontWeight: "700",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 80,
  },
  section: {
    width: "100%",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f4f4f4",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  typeCard: {
    width: "48%",
    backgroundColor: "#f4f4f4",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "#666",
  },
  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sessionTime: {
    fontSize: 14,
    color: "#999",
    width: 70,
  },
  sessionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  sessionDuration: {
    fontSize: 14,
    color: "#555",
  },
});
