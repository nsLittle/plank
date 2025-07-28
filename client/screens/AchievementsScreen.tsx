import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";

export default function AchievementsScreen() {
  type NavigationProp = StackNavigationProp<
    RootStackParamList,
    "AchievementsScreen"
  >;
  const navigation = useNavigation<NavigationProp>();

  const [achievements, setAchievements] = useState<null | {
    firstPlankDate: string | null;
    longestPlankTime: number;
    streaksCompleted: number[];
    dailyTotalsMet: { date: string; minutes: number }[];
    allTypesCompleted: string[];
  }>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      const base = "192.168.1.174";

      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const token = parsedUser?.token;

      if (!token) {
        console.error("No token found in AsyncStorage");
        return;
      }

      try {
        const response = await fetch(
          `http://${base}:8000/laps/getAchievements`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Achievements fetched:", data);
        setAchievements(data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, { marginTop: 250 }]}>
      <Text style={styles.header}>Achievements</Text>

      {/* Replace the below with real achievements later */}
      <View style={styles.card}>
        <Text style={styles.cardSubtitle}>1 mi</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💪 Most Time</Text>
        <Text style={styles.cardSubtitle}>2h</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 7-Day Streak</Text>
        <Text style={styles.cardSubtitle}>Complete</Text>
      </View>

      <TouchableOpacity
        style={styles.backToProgressButton}
        onPress={() => navigation.navigate("ProgressScreen")}>
        <Text style={styles.backButtonText}>Back to Progress</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backToPlankButton}
        onPress={() => navigation.navigate("PlankScreen")}>
        <Text style={styles.backButtonText}>Back to Plank</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF7E9",
    minHeight: "100%",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  backToProgressButton: {
    marginTop: 32,
    backgroundColor: "#A020F0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  backToPlankButton: {
    marginTop: 32,
    backgroundColor: "pink",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
