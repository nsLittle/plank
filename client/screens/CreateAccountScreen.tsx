import * as SecureStore from "expo-secure-store";
import { setItemAsync } from "expo-secure-store";
import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { sharedStyles } from "../styles/sharedStyles";
import { RootStackParamList } from "../types/navigation";

export default function CreateAccountScreen() {
  console.log(SecureStore);
  console.log("SecureStore methods:", Object.keys(SecureStore));

  type CreateAccountScreenNavigationProp =
    StackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<CreateAccountScreenNavigationProp>();

  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showIconDialog, setShowIconDialog] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleCreateAccount = async () => {
    if (!email || !password || !confirmPassword) {
      setDialogMessage("All fields are required.");
      setShowDialog(true);
      return;
    }

    if (password !== confirmPassword) {
      setDialogMessage("Passwords do not match.");
      setShowDialog(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Account creation failed");
      }

      console.log("Response:", data);

      if (data.token) {
        await setItemAsync("authToken", data.token);
      } else {
        throw new Error("Token is missing from response");
      }
      if (data) {
        setDialogMessage("Account created successfully!");
        setShowDialog(true);

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
        <Text style={sharedStyles.bodyTitleText}>Create Account</Text>

        <TextInput
          style={sharedStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={sharedStyles.input}>
          <TextInput
            style={[sharedStyles.inputText, { paddingVertical: 0 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            // placeholderTextColor="#606060"
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

        <View style={sharedStyles.input}>
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
        </View>
        <View style={sharedStyles.buttonRow}>
          <TouchableOpacity
            style={sharedStyles.greyButton}
            onPress={() => navigation.navigate("WelcomeScreen")}>
            <Text style={sharedStyles.greyButtonText}>Back ◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedStyles.purpleButton}
            onPress={handleCreateAccount}>
            <Text style={sharedStyles.purpleButtonText}>Save ▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
