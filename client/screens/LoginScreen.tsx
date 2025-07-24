import * as SecureStore from "expo-secure-store";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState, useContext } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserContext } from "../context/UserContext";
import { sharedStyles } from "../styles/sharedStyles";
import { RootStackParamList } from "../types/navigation";
import { UserContextValue } from "../types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const context = useContext(UserContext);

  if (!context) {
    console.warn("⚠️ UserContext is undefined. Rendering fallback UI.");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>User context not found. Please reload the app.</Text>
      </View>
    );
  }

  const { userContext, setUserContext } = context;

  useEffect(() => {
    if (userContext) {
      console.log("User Context: ", userContext);
    }
  }, [userContext]);

  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async () => {
    console.log("Email: ", email, "Password: ", password);

    if (!email || !password) {
      setDialogMessage("All fields are required.");
      setShowDialog(true);
      return;
    }

    try {
      const apiUrl =
        Platform.OS === "web"
          ? "http://localhost:8000"
          : "http://192.168.1.174:8000";

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();
      console.log("Data: ", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const saveToken = async (token: string) => {
        if (Platform.OS === "web") {
          sessionStorage.setItem("authToken", token);
        } else {
          try {
            await SecureStore.setItemAsync("authToken", token);
          } catch (error) {
            console.error("Error saving token:", error);
          }
        }
      };

      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          email: data.email,
          token: data.token,
        })
      );

      if (response) {
        setUserContext({
          email: data.email,
          token: data.token,
        });
        navigation.navigate("PlankScreen");
      }
    } catch (error) {
      console.log("Error: ", error);
      setDialogMessage("Signup Failed");
      setShowDialog(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.container}>
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
          style={sharedStyles.dialog}>
          <Dialog.Title style={sharedStyles.dialogTitle}>Alert</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowDialog(false)}
              labelStyle={sharedStyles.dialogButton}>
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={sharedStyles.body}>
        <Text style={sharedStyles.bodyTitleText}>Login</Text>

        <View style={sharedStyles.input}>
          <TextInput
            style={sharedStyles.inputText}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={sharedStyles.input}>
          <TextInput
            style={[sharedStyles.inputText]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={sharedStyles.iconButton}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* <View style={sharedStyles.input}>
          <TextInput
            style={[sharedStyles.inputText, { paddingVertical: 0 }]}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={sharedStyles.iconButton}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View> */}

        <View style={sharedStyles.buttonRow}>
          <TouchableOpacity
            style={sharedStyles.purpleButton}
            onPress={handleLogin}>
            <Text style={sharedStyles.purpleButtonText}>Login ▶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedStyles.greyButton}
            onPress={() => navigation.navigate("CreateAccountScreen")}>
            <Text style={sharedStyles.greyButtonText}>Create Account ▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
