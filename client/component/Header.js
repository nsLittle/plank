import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PlankApp</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#9B111E",
    height: 200,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 5,
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: 70,
  },
  headerText: {
    textAlign: "center",
    flex: 1,
    fontSize: 30,
    color: "white",
  },
});
