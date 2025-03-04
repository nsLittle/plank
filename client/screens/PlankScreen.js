import { useState, useRef } from "react";

import {
  Alert,
  Linking,
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
import { useNavigation } from "@react-navigation/native";
import React from "react";

export default function PlankScreen() {
  const navigation = useNavigation();

  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  const [laps, setLaps] = useState([]);

  let timer;

  const handleStartStop = () => {
    setIsActive((prev) => !prev);

    if (!isActive) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSaveLap = () => {
    if (time === 0) {
      Alert.alert("No time recorded", "Start the timer before saving.");
      return;
    }

    setLaps([...laps, time]);
    Alert.alert("Lap Saved", `Plank time: ${time} seconds`);

    setTime(0);
  };

  const handleSaveToAccount = () => {
    Alert.alert("Create an account", "Sign up to save your progress.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <Text style={styles.bodyTitleText}>Let's Plank</Text>

        <View style={styles.timerContainer}></View>
        <Text style={styles.title}>Plank Timer</Text>
        <Text style={styles.timer}>{time} sec</Text>

        <TouchableOpacity style={styles.button} onPress={handleStartStop}>
          <Text style={styles.buttonText}>{isActive ? "Stop" : "Start"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSaveLap} onPress={handleSaveLap}>
          <Text style={styles.buttonText}>Save Lap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.disabledButton}
          onPress={handleSaveToAccount}>
          <Text style={styles.buttonText}>
            Save to Account (Sign up required)
          </Text>
        </TouchableOpacity>

        <Text style={styles.lapsTitle}>Laps</Text>
        {laps.map((lap, index) => (
          <Text key={index} style={styles.lapText}>
            Lap {index + 1}: {lap} sec
          </Text>
        ))}
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("WelcomeScreen")}>
          <Text style={styles.backButtonText}>Back ◀</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("DefaultScreen")}>
          <Text style={styles.loginButtonText}>Next ▶</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingHorizontal: wp("5%"),
  },
  body: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingTop: Platform.OS === "web" ? hp("20%") : hp("2%"),
  },
  bodyTitleText: {
    fontSize: 26,
    textAlign: "center",
    paddingBottom: 30,
    fontWeight: "bold",
  },
  bodyIntroText: {
    textAlign: "center",
    fontSize: 14,
    paddingBottom: 15,
    width: 225,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  timer: {
    fontSize: 40,
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#bc4598",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 200,
  },
  buttonSaveLap: {
    backgroundColor: "#808080",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 200,
  },
  disabledButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  lapsTitle: {
    fontSize: 20,
    marginTop: 20,
  },
  lapText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    gap: 15,
    marginTop: 50,
  },
  loginButton: {
    backgroundColor: "#bc4598",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    width: 150,
    height: 45,
    justifyContent: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#D3D3D3",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    width: 150,
    height: 45,
    justifyContent: "center",
  },
  backButtonText: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
});
