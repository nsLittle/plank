import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { sharedStyles } from "../styles/sharedStyles";
import { RootStackParamList } from "../types/navigation";
import { PlankType } from "../types/plank";
import { PlankSessions } from "../models/PlankSessions";

export default function PlankNoAccountScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const [isActive, setIsActive] = useState<boolean>(false);

  const [plankType, setPlankType] = useState<PlankType | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const [time, setTime] = useState<number>(0);
  const [laps, setLaps] = useState<number[]>([]);

  const timerRef = useRef<number | null>(null);
  const sessionRef = useRef<PlankSessions>(new PlankSessions());

  const handleStartStop = () => {
    setIsActive((prev) => !prev);

    if (!plankType) {
      setDialogMessage("Please select a plank type before starting.");
      setShowDialog(true);
      return;
    }

    if (!isActive) {
      timerRef.current = setInterval(() => {
        const newTime = sessionRef.current.incrementTime();
        setTime(newTime);
      }, 1000) as unknown as number;
    } else {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSaveLap = (data) => {
    if (isActive) {
      setDialogMessage(
        "Stop the timer first. You can only save a lap after stopping."
      );
      setShowDialog(true);
      return;
    }

    if (time === 0) {
      setDialogMessage("No time recorded. Start the timer before saving.");
      setShowDialog(true);
      return;
    }

    setLaps([...laps, time]);
    setTime(0);
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.container}>
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
          style={sharedStyles.dialog}>
          <Dialog.Title style={sharedStyles.dialogTitle}>ALERT</Dialog.Title>
          <Dialog.Content>
            <Text style={sharedStyles.dialogText}>{dialogMessage}</Text>
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
          <View style={styles.dropDownWrapper}>
            <TouchableOpacity
              onPress={() => setShowMenu(!showMenu)}
              style={styles.dropDownButton}>
              <Text style={styles.dropDownText}>
                {plankType ? plankType : "Plank Type"}
              </Text>
              <Text style={{ marginLeft: 6 }}>▼</Text>
            </TouchableOpacity>

            {showMenu && (
              <View style={styles.dropDownMenu}>
                {Object.values(PlankType).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setPlankType(type);
                      setShowMenu(false);
                    }}>
                    <Text style={styles.dropDownOption}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.timer}>{time} sec</Text>
          <View style={styles.spacer} />
        </View>

        <View style={sharedStyles.buttonColumn}>
          <TouchableOpacity
            style={sharedStyles.purpleButton}
            onPress={handleStartStop}>
            <Text style={sharedStyles.purpleButtonText}>
              {isActive ? "Stop/Pause" : "Start"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedStyles.greyButton}
            onPress={handleSaveLap}>
            <Text style={sharedStyles.greyButtonText}>Log Lap</Text>
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
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  dropDownWrapper: {
    flex: 1,
  },
  dropDownButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    width: 200,
  },
  dropDownText: {
    fontSize: 16,
  },
  dropDownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  dropDownOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  timer: {
    fontSize: 82,
    alignContent: "center",
    color: "darkgray",
  },
  spacer: { flex: 1 },
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
