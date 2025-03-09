import * as SplashScreen from "expo-splash-screen";
import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./context/UserContext";
import { PaperProvider } from "react-native-paper";
import WelcomeScreen from "./screens/WelcomeScreen";
import PlankTypeScreen from "./screens/PlankTypeScreen";
import LoginScreen from "./screens/LoginScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import PlankScreen from "./screens/PlankScreen";
import PlankNoAccountScreen from "./screens/PlankNoAccountScreen";
import DataScreen from "./screens/DataScreen";
import LogoutScreen from "./screens/LogoutScreen";
import DefaultScreen from "./screens/DefaultScreen";
import EndingCreditsScreen from "./screens/EndingCreditsScreen";

import Header from "./component/Header";

const Stack = createStackNavigator();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
        onLayout={onLayoutRootView}>
        <Text style={styles.tagline}>
          Build Better Habits, One Step at a Time
        </Text>
        <Image
          source={require("./assets/favicon.png")}
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
    <PaperProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="WelcomeScreen"
            screenOptions={{
              header: (props) => <Header {...props} />,
            }}>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="PlankTypeScreen" component={PlankTypeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen
              name="CreateAccountScreen"
              component={CreateAccountScreen}
            />
            <Stack.Screen name="PlankScreen" component={PlankScreen} />
            <Stack.Screen
              name="PlankNoAccountScreen"
              component={PlankNoAccountScreen}
            />
            <Stack.Screen name="DataScreen" component={DataScreen} />
            <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
            <Stack.Screen
              name="EndingCreditsScreen"
              component={EndingCreditsScreen}
            />
            <Stack.Screen name="DefaultScreen" component={DefaultScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  tagline: {
    marginTop: 20,
    fontSize: 16,
    color: "#0A2540",
  },
});
