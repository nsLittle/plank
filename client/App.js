import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./context/UserContext";
import { PaperProvider } from "react-native-paper";
import WelcomeScreen from "./screens/WelcomeScreen";
import PlankVisualScreen from "./screens/PlankVisualScreen";

import Header from "./component/Header";

const Stack = createStackNavigator();

export default function App() {
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
            <Stack.Screen
              name="PlankVisualScreen"
              component={PlankVisualScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </PaperProvider>
  );
}
