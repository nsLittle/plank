import React, { useEffect, useRef, useState } from "react";
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
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PlankScreen() {
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

        if (newTime === 5) {
          Toast.show({
            type: "success",
            text1: "💪 Stay strong and keep that core tight!",
          });
        }

        if (newTime === 15) {
          Toast.show({
            type: "success",
            text1: "🔥 Keep going. You got this!",
          });
        }

        if (newTime === 35) {
          Toast.show({
            type: "success",
            text1: "💪 Getting harder and stronger every second!",
          });
        }
      }, 1000) as unknown as number;
    } else {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      Toast.show({
        type: "success",
        text1: "⏸️ Plank Paused",
        text2: `Great work! You've planked ${plankType} for ${time} seconds.`,
      });
    }
  };

  const handleSaveLap = async (data) => {
    console.log("Saving...");

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

    const newLaps = [...laps, time];
    setLaps(newLaps);
    setTime(0);

    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.token) {
        console.error("❌ No user token found");
        return;
      }

      const response = await fetch("http://localhost:8000/laps/saveLaps", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          laps: newLaps,
          plankType: plankType,
        }),
      });

      const result = await response.json();
      console.log("Server response:", result);
    } catch (error) {
      console.error("Save failed: ", error);
    }

    Toast.show({
      type: "success",
      text1: "✅ Plank Logged!",
      text2: `${time} seconds of ${
        plankType ?? "plank"
      } added to your progress!`,
    });
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
        {/* <View style={styles.headerWrapper}> */}
        {/* <View style={styles.titleRow}>
            <View style={styles.dropDownWrapperTwo}></View>
            <Text style={sharedStyles.bodyTitleText}>Start Planks</Text> */}
        <View style={styles.dropDownWrapper}>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.dropDownButton}>
            <View style={styles.dropDownContent}>
              <Text style={styles.dropDownText}>
                {plankType ?? "Plank Type"}
              </Text>
              <MaterialIcons
                name={showMenu ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#888"
                style={styles.dropDownIcon}
              />
            </View>
          </TouchableOpacity>

          {showMenu && (
            <>
              {/* <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={() => setShowMenu(false)}
              /> */}
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
            </>
          )}
        </View>
        {/* </View> */}

        <Text style={styles.timer}>{time} sec</Text>

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
        {/* </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // headerWrapper: {
  //   width: "100%",
  //   alignItems: "center",
  //   marginBottom: 24,
  // },
  // titleRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   gap: 12,
  // },
  dropDownWrapper: {
    marginTop: 24,
    marginLeft: 12,
    position: "relative",
    zIndex: 9999,
    elevation: 9999,
  },
  dropDownWrapperTwo: {
    width: 260,
    marginRight: 12,
    position: "relative",
  },
  dropDownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    height: 50,
    width: 260,
    paddingHorizontal: 16,
    elevation: 2,
  },
  dropDownContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dropDownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  dropDownIcon: {
    marginLeft: 8,
  },
  dropDownMenu: {
    position: "absolute",
    top: "100%",
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 9999,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropDownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  timer: {
    fontSize: 82,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 20,
    color: "darkgray",
  },
});
