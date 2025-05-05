import React, { useContext, useEffect, useRef, useState } from "react";
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
import { Button, Dialog, Portal } from "react-native-paper";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import { sharedStyles } from "../styles/sharedStyles";

export default function PlankScreen() {
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

  const handleLogLap = (data) => {
    if (isActive) {
      setDialogMessage(
        "Stop the timer first",
        "You can only save a lap after stopping."
      );
      setShowDialog(true);
      return;
    }

    if (time === 0) {
      setDialogMessage("No time recorded", "Start the timer before saving.");
      setShowDialog(true);
      return;
    }

    setLaps([...laps, time]);
    setDialogMessage("Lap Logged", `Plank time: ${time} seconds`);
    setShowDialog(true);

    setTime(0);
  };

  const handleSaveToAccount = async () => {
    if (!userContext.userId) {
      setDialogMessage("Create an account", "Sign up to save your progress.");
      setShowDialog(true);
    }

    if (laps.length === 0) {
      console.error("No lap data to save.");
      setDialogMessage("No lap data.  Save at least one lap before you save.");
      setShowDialog(true);
      return;
    }

    try {
      const response = await fetch("http://192.168.1.174:8000/laps/saveLaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userContext.email, laps }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Lap data saved:", data);
      setDialogMessage("Laps successfully saved.");
      setShowDialog(true);
      navigation.navigate("DataScreen");
    } catch (error) {
      console.error("Failed to save lap data:", error);
      setDialogMessage("Laps failed to save.");
      setShowDialog(true);
      return;
    }
  };

  const [lapData, setLapData] = useState(null);

  const handleFetchLaps = async () => {
    console.log("I'm here to fetch lap data...");

    try {
      console.log("i'm in here...");

      const response = await fetch("http://192.168.1.174:8000/laps/getLaps", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("can i get out...");

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      console.log("i'm still here...");

      const data = await response.json();
      console.log("Lap data retrieved:", data);

      setLapData(Array.isArray(data.getLaps) ? data.getLaps : []);
      console.log("Reformatted Lap Data: ", lapData);
    } catch (error) {
      console.error("Failed to save lap data:", error);
      setDialogMessage("Laps failed to load.");
      setShowDialog(true);
      setLapData([]);
    }
  };

  useEffect(() => {
    console.log("Updated Lap Data: ", lapData);
  }, [lapData]);

  useEffect(() => {
    console.log("Plank Screen mounted");
    handleFetchLaps();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <Portal>
          <Dialog
            visible={showDialog}
            onDismiss={() => setShowDialog(false)}
            style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>Alert</Dialog.Title>
            <Dialog.Content>
              <Text>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => setShowDialog(false)}
                labelStyle={styles.dialogButton}>
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View style={sharedStyles.body}>
          <Text style={sharedStyles.bodyTitleText}>Let's Plank</Text>

          <View style={styles.timerContainer}></View>
          <Text style={styles.timer}>{time} sec</Text>

          <TouchableOpacity style={styles.button} onPress={handleStartStop}>
            <Text style={styles.buttonText}>{isActive ? "Stop" : "Start"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logLapButton} onPress={handleLogLap}>
            <Text style={styles.buttonText}>Log Lap</Text>
          </TouchableOpacity>

          <Text style={styles.lapsTitle}>Today's Laps</Text>
          {laps.map((lap, index) => (
            <Text key={index} style={styles.lapText}>
              Lap {index + 1}: {lap} seconds
            </Text>
          ))}

          {Array.isArray(lapData) && lapData.length > 0 ? (
            <View style={styles.lapContainer}>
              {lapData.map((lap, index) => (
                <Text key={lap._id} style={styles.lapText}>
                  {new Date(lap.entryDate).toLocaleDateString()} | Lap #{" "}
                  {lap.lap} | {lap.lapType}| {lap.time}
                </Text>
              ))}
            </View>
          ) : (
            <Text></Text>
          )}

          <TouchableOpacity
            style={styles.disabledButton}
            onPress={handleSaveToAccount}>
            <Text style={styles.disabledButtonText}>Save to Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: "white",
  },
  dialogTitle: {
    color: "red",
    fontWeight: "bold",
  },
  dialogButton: {
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingHorizontal: wp("5%"),
  },
  timer: {
    fontSize: 40,
    marginVertical: 20,
  },
  lapsTitle: {
    fontSize: 20,
    marginTop: 20,
  },
  lapText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#bc4598",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 150,
    height: 30,
    textAlign: "center",
    color: "white",
  },
  logLapButton: {
    backgroundColor: "#808080",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 150,
    textAlign: "center",
    color: "white",
  },
  disabledButton: {
    backgroundColor: "#7a5581",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 200,
    textAlign: "center",
    color: "white",
  },
  disabledButtonText: {
    fontSize: 16,
  },
});
