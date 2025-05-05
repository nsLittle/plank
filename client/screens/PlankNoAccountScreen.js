import React, { useRef, useState } from "react";
import {
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
import { sharedStyles } from "../styles/sharedStyles";

export default function PlankNoAccountScreen() {
  const navigation = useNavigation();

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

  const handleSaveLap = (data) => {
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
    setDialogMessage`Your plank time has been logged.`;
    setShowDialog(true);

    setTime(0);
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.container}>
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
          style={sharedStyles.dialog}>
          <Dialog.Title style={sharedStyles.dialogTitle}>
            Lap Logged
          </Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowDialog(false)}
              labelStyle={sharedStyles.dialogButton}>
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={sharedStyles.body}>
        <Text style={sharedStyles.bodyTitleText}>Plank Timer</Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{time} sec</Text>
        </View>

        <View style={sharedStyles.buttonColumn}>
          <TouchableOpacity
            style={sharedStyles.purpleButton}
            onPress={handleStartStop}>
            <Text style={sharedStyles.purpleButtonText}>
              {isActive ? "Stop" : "Start"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedStyles.greyButton}
            onPress={handleSaveLap}>
            <Text style={styles.greyButtonText}>Log Lap</Text>
          </TouchableOpacity>
        </View>

        {laps.length > 0 && <Text style={styles.lapsTitle}>Today's Laps</Text>}

        {laps.map((lap, index) => (
          <Text key={index} style={styles.lapText}>
            Lap {index + 1}: {lap} seconds
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 52,
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
});
