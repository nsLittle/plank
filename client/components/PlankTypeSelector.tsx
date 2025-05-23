import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PlankType } from "../types/plank";

interface PlankTypeSelectorProps {
  plankType: PlankType | null;
  showMenu: boolean;
  onToggleMenu: () => void;
  onSelectType: (type: PlankType) => void;
}

export const PlankTypeSelector: React.FC<PlankTypeSelectorProps> = ({
  plankType,
  showMenu,
  onToggleMenu,
  onSelectType,
}) => {
  return (
    <View style={styles.dropDownWrapper}>
      <TouchableOpacity onPress={onToggleMenu} style={styles.dropDownButton}>
        <Text style={styles.dropDownText}>
          {plankType ? plankType : "Plank Type"}
        </Text>
        <Text style={{ marginLeft: 6 }}>▼</Text>
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.dropDownMenu}>
          {Object.values(PlankType).map((type) => (
            <TouchableOpacity key={type} onPress={() => onSelectType(type)}>
              <Text style={styles.dropDownOption}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
