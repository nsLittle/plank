import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

export default function LoginScreen() {
  const navigation = useNavigation();

  const { userContext, setUserContext } = useContext(UserContext) || {};

  useEffect(() => {
    if (userContext) {
      console.log("User Context: ", userContext);
      console.log("User Id: ", userContext.userId);
      console.log("User Email: ", userContext.email);
    }
  }, [userContext]);

  const [dialogMessage, setDialogMessage] = useState("");
  const [showDialog, setShowDialog] = useState("");

  const [lapData, setLapData] = useState(null);
  // render date | lap # | time

  const handleFetchLaps = async () => {
    console.log("I'm here to fetch lap data...");

    try {
      const response = await fetch("http://192.168.1.174:8000/laps/getLaps", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Lap data retrieved:", data);

      setLapData(Array.isArray(data.getLaps) ? data.getLaps : []);
      console.log("Reformatted Lap Data: ", lapData);

      setDialogMessage("Laps successfully retrieved.");
      setShowDialog(true);
    } catch (error) {
      console.error("Failed to save lap data:", error);
      setDialogMessage("Laps failed to load.");
      setShowDialog(true);
      setLapData([]);
    }
  };

  useEffect(() => {
    handleFetchLaps();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <Text style={styles.bodyTitleText}>Rank the Plank</Text>

        <Text style={styles.bodyIntroText}>You're crushing it!</Text>
        {Array.isArray(lapData) && lapData.length > 0 ? (
          <View style={styles.lapContainer}>
            {lapData.map((lap, index) => (
              <Text key={lap._id} style={styles.lapText}>
                {new Date(lap.entryDate).toLocaleDateString()} | Lap #{lap.lap}{" "}
                | {lap.time}
              </Text>
            ))}
          </View>
        ) : (
          <Text>No lap data available.</Text>
        )}

        {showDialog && (
          <Text style={styles.dialogMessage}>{dialogMessage}</Text>
        )}
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
});
