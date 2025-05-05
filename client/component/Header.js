import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { sharedStyles } from "../styles/sharedStyles";

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
    <View style={sharedStyles.headerContainer}>
      <View style={sharedStyles.header}>
        {currentRoute !== "WelcomeScreen" &&
          currentRoute !== "LoginScreen" &&
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
                style={[sharedStyles.menuIcon]}></Ionicons>
            </TouchableOpacity>
          )}

        <Text style={sharedStyles.headerTitle}>Plank Master</Text>
      </View>

      {menuVisible && (
        <View
          style={[
            sharedStyles.menuList,
            { left: 25, top: menuPosition.top + 10 },
          ]}>
          {currentRoute !== "WelcomeScreen" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("WelcomeScreen", {})}>
              <Text style={sharedStyles.menuItem}>Welcome Screen</Text>
            </TouchableOpacity>
          )}
          {currentRoute !== "PlankTypeScreen" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("PlankTypeScreen", {})}>
              <Text style={sharedStyles.menuItem}>Plank Types</Text>
            </TouchableOpacity>
          )}
          {currentRoute !== "PlankScreen" &&
            currentRoute !== "PlankNoAccountScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("PlankScreen", {})}>
                <Text style={sharedStyles.menuItem}>Start Planks</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "DataScreen" &&
            currentRoute !== "PlankNoAccountScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("DataScreen", {})}>
                <Text style={sharedStyles.menuItem}>Rank your Planks</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "LogoutScreen" &&
            currentRoute !== "PlankNoAccountScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("LogoutScreen", {})}>
                <Text style={sharedStyles.menuItem}>Logout Screen</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "EndingCreditsScreen" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("EndingCreditsScreen", {})}>
              <Text style={sharedStyles.menuItem}>Ending Credits Screen</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
