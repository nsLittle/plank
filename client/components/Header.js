import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });

  const currentRoute = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  const toggleMenu = () => {
    setMenuVisible(true);
  };

  const closeMenus = () => {
    setTimeout(() => {
      setMenuVisible(false);
    }, 2000);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        {currentRoute !== "WelcomeScreen" &&
          currentRoute !== "LogoutScreen" && (
            <TouchableOpacity
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                setMenuPosition({ left: x, top: y });
              }}
              onPress={toggleMenu}>
              <Ionicons
                name="menu"
                size={32}
                style={[styles.menuIcon]}></Ionicons>
            </TouchableOpacity>
          )}

        <Text style={styles.headerText}>PlankApp</Text>
      </View>

      {menuVisible && (
        <View
          style={[styles.menuList, { left: 25, top: menuPosition.top + 10 }]}>
          {currentRoute !== "WelcomeScreen" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("WelcomeScreen", {})}>
              <Text style={styles.menuItem}>Welcome Screen</Text>
            </TouchableOpacity>
          )}
          {currentRoute !== "PlankTypeScreen" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("PlankTypeScreen", {})}>
              <Text style={styles.menuItem}>Plank Types</Text>
            </TouchableOpacity>
          )}
          {currentRoute !== "PlankScreen" &&
            currentRoute !== "PlankNoAccountScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("PlankScreen", {})}>
                <Text style={styles.menuItem}>Start Planks</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "DataScreen" &&
            currentRoute !== "PlankNoAccountScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("DataScreen", {})}>
                <Text style={styles.menuItem}>Rank your Planks</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "LogoutScreen" &&
            currentRoute !== "PlankNoAccountScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("LogoutScreen", {})}>
                <Text style={styles.menuItem}>Logout Screen</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "EndingCreditsScreen" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("EndingCreditsScreen", {})}>
              <Text style={styles.menuItem}>Ending Credits Screen</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#bc4598",
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
  menuIcon: {
    color: "#000",
    zIndex: 20,
    position: "relative",
  },
  headerText: {
    textAlign: "center",
    flex: 1,
    fontSize: 30,
    color: "white",
  },
  menuList: {
    zIndex: 9999,
    elevation: 10,
    backgroundColor: "#FFF",
    position: "absolute",
    top: 100,
    left: 20,
    padding: 10,
    width: "80%",
    maxWidth: 250,
    borderRadius: 5,
    boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    borderColor: "#CCC",
  },
  menuItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
});
