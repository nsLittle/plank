import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { StackHeaderProps } from "@react-navigation/stack";
import { sharedStyles } from "../styles/sharedStyles";
import { RootStackParamList } from "../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";

type RouteName = keyof RootStackParamList;

export default function Header(_props: StackHeaderProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [menuVisible, setMenuVisible] = useState(false);

  const [menuPosition, setMenuPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });

  const currentRoute = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name as RouteName;
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
          {currentRoute !== "WelcomeScreen" &&
            currentRoute !== "PlankTypeScreen" &&
            currentRoute !== "PlankScreen" &&
            currentRoute !== "ProgressScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("WelcomeScreen")}>
                <Text style={sharedStyles.menuItem}>Welcome</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "PlankTypeScreen" &&
            currentRoute !== "LoginScreen" &&
            currentRoute !== "CreateAccountScreen" &&
            currentRoute !== "EndingCreditsScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("PlankTypeScreen")}>
                <Text style={sharedStyles.menuItem}>Plank Types</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "PlankScreen" &&
            currentRoute !== "LoginScreen" &&
            currentRoute !== "CreateAccountScreen" &&
            currentRoute !== "EndingCreditsScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("PlankScreen")}>
                <Text style={sharedStyles.menuItem}>Start Planks</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "ProgressScreen" &&
            currentRoute !== "LoginScreen" &&
            currentRoute !== "CreateAccountScreen" &&
            currentRoute !== "EndingCreditsScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("ProgressScreen")}>
                <Text style={sharedStyles.menuItem}>Progress Screen</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "LogoutScreen" &&
            currentRoute !== "LoginScreen" &&
            currentRoute !== "CreateAccountScreen" &&
            currentRoute !== "EndingCreditsScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("LogoutScreen")}>
                <Text style={sharedStyles.menuItem}>Logout</Text>
              </TouchableOpacity>
            )}
          {currentRoute !== "PlankTypeScreen" &&
            currentRoute !== "PlankScreen" &&
            currentRoute !== "ProgressScreen" &&
            currentRoute !== "EndingCreditsScreen" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("EndingCreditsScreen")}>
                <Text style={sharedStyles.menuItem}>Ending Credits</Text>
              </TouchableOpacity>
            )}
        </View>
      )}
    </View>
  );
}
