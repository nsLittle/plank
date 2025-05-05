import * as SecureStore from "expo-secure-store";
import { useEffect, useState, useContext } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import { UserContextValue } from "../types/user";
import { sharedStyles } from "../styles/sharedStyles";

export default function LoginScreen() {
  const navigation = useNavigation();

  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "UserContext not found. Ensure you're wrapped in UserProvider."
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

  const handleLogin = async () => {
    console.log("I'm here to handle login...");
    console.log("Email: ", email, "Password: ", password);

    if (!email || !password || !confirmPassword) {
      setDialogMessage("All fields are required.");
      setShowDialog(true);
      return;
    }

    console.log("Password & Password: ", password, confirmPassword);

    if (password !== confirmPassword) {
      setDialogMessage("Passwords do not match.");
      setShowDialog(true);
      return;
    }

    try {
      console.log("Now I'm really ready to handle login...");
      const response = await fetch("http://localhost:8000/auth/login", {
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

      console.log("Response:", data);

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

      if (data.token) {
        await saveToken(data.token);
      }

      if (response) {
        setDialogMessage("Account created successfully!");
        setShowDialog(true);

        console.log("userId: ", data.userId, "email: ", data.email);
        setUserContext({
          userId: data.userId,
          email: data.email,
          userName: null,
          habitId: null,
          habitinput: null,
          descriptioninput: null,
          teamMemberId: null,
          teammemberFirstName: null,
          teammemberProfilePic: null,
          firstName: null,
          lastName: null,
          profilePic: null,
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
      <View style={sharedStyles.body}>
        <Text style={sharedStyles.bodyTitleText}>Login</Text>

        <TextInput
          style={sharedStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={sharedStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={sharedStyles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={sharedStyles.buttonColumn}>
          <TouchableOpacity
            style={sharedStyles.purpleButton}
            onPress={async () => {
              console.log("Login button pressed");
              const saved = await handleLogin();
              if (saved) {
                navigation.navigate("PlankScreen");
              }
            }}>
            <Text style={sharedStyles.purpleButtonText}>Login ▶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedStyles.greyButton}
            onPress={() => navigation.navigate("CreateAccountScreen")}>
            <Text style={sharedStyles.greyButtonText}>Create Account ▶</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={sharedStyles.greyButton}
            onPress={() => navigation.navigate("WelcomeScreen")}>
            <Text style={sharedStyles.greyButtonText}>◀ Welcome Screen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
