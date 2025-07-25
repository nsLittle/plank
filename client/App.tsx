import * as SplashScreen from "expo-splash-screen";
import React, { useState, useEffect, useCallback } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./context/UserContext";
import Header from "./components/Header";
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import PlankScreen from "./screens/PlankScreen";
import ProgressScreen from "./screens/ProgressScreen";
import LogoutScreen from "./screens/LogoutScreen";
import EndingCreditsScreen from "./screens/EndingCreditsScreen";

const Stack = createStackNavigator();

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#FF69B4", marginBottom: 40 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "600" }}
      text2Style={{ fontSize: 14 }}
      position="bottom"
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#FF69B4", marginBottom: 40 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "600" }}
      text2Style={{ fontSize: 14 }}
      position="bottom"
    />
  ),
};

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

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    console.log("📦 onLayoutRootView triggered");
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#8A5F9E",
          alignItems: "center",
          justifyContent: "center",
        }}
        onLayout={onLayoutRootView}>
        <Text style={styles.tagline}>Build a Stronger Core,</Text>
        <Text style={styles.tagline}>One Plank at a Time</Text>
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
            screenOptions={{
              header: (props) => <Header {...props} />,
            }}>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen
              name="CreateAccountScreen"
              component={CreateAccountScreen}
            />
            <Stack.Screen name="PlankScreen" component={PlankScreen} />
            <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
            <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
            <Stack.Screen
              name="EndingCreditsScreen"
              component={EndingCreditsScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast config={toastConfig} position="bottom" />
      </UserProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  tagline: {
    fontSize: 20,
    color: "#F3F0EC",
  },
});
