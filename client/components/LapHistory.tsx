import React from "react";
import { StyleSheet, Text } from "react-native";

interface LapHistoryProps {
  laps: number[];
}

export const LapHistory: React.FC<LapHistoryProps> = ({ laps }) => {
  if (laps.length === 0) return null;

  return (
    <>
      <Text style={styles.lapsTitle}>Today's Laps</Text>
      {laps.map((lap, index) => (
        <Text key={index} style={styles.lapText}>
          Lap {index + 1}: {lap} seconds
        </Text>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  lapsTitle: {
    fontSize: 20,
    marginTop: 20,
  },
  lapText: {
    fontSize: 16,
  },
});
