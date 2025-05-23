import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { sharedStyles } from "../styles/sharedStyles";

interface PlankControlsProps {
  isActive: boolean;
  onStartStop: () => void;
  onSaveLap: () => void;
}

export const PlankControls: React.FC<PlankControlsProps> = ({
  isActive,
  onStartStop,
  onSaveLap,
}) => {
  return (
    <View style={sharedStyles.buttonColumn}>
      <TouchableOpacity style={sharedStyles.purpleButton} onPress={onStartStop}>
        <Text style={sharedStyles.purpleButtonText}>
          {isActive ? "Stop/Pause" : "Start"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={sharedStyles.greyButton} onPress={onSaveLap}>
        <Text style={sharedStyles.greyButtonText}>Log Lap</Text>
      </TouchableOpacity>
    </View>
  );
};
