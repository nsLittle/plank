import * as SplashScreen from "expo-splash-screen";
import React, { useState, useEffect, useCallback } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./context/UserContext";
import Header from "./component/Header";
import WelcomeScreen from "./screens/WelcomeScreen";
import PlankTypeScreen from "./screens/PlankTypeScreen";
import LoginScreen from "./screens/LoginScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import PlankScreen from "./screens/PlankScreen";
import PlankNoAccountScreen from "./screens/PlankNoAccountScreen";
import DataScreen from "./screens/DataScreen";
import LogoutScreen from "./screens/LogoutScreen";
import EndingCreditsScreen from "./screens/EndingCreditsScreen";
import { RootStackParamList } from "./types/navigation";

const Stack = createStackNavigator<RootStackParamList>();

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
          backgroundColor: "#8A5F9E",
          alignItems: "center",
          justifyContent: "center",
        }}
        onLayout={onLayoutRootView}>
        <Text style={styles.tagline}>
          Build a Stronger Core, One Plank at a Time
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
          </Stack.Navigator>
        </NavigationContainer>
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
    marginTop: 24,
    fontSize: 20,
    color: "#F3F0EC",
  },
});
