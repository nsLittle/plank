import * as SecureStore from "expo-secure-store";
import { setItemAsync } from "expo-secure-store";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { sharedStyles } from "../styles/sharedStyles";

export default function CreateAccountScreen() {
  console.log(SecureStore);
  console.log("SecureStore methods:", Object.keys(SecureStore));

  const navigation = useNavigation();

  const [dialogMessage, setDialogMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const [showIconDialog, setShowIconDialog] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        // await SecureStore.setItemAsync("authToken", data.token);
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

        <Dialog
          visible={showIconDialog}
          onDismiss={() => setShowIconDialog(false)}
          style={{ backgroundColor: "white" }}>
          <Dialog.Title style={sharedStyles.dialogTitle}>
            Profile Image
          </Dialog.Title>
          <Dialog.Content>
            <Text>Enter an url that points to your profile image.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowPictureDialog(false)}
              labelStyle={sharedStyles.dialogButtonConfirm}>
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
        <View style={sharedStyless.iconInputContainer}>
          <TextInput
            style={sharedStyles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() => setShowIconDialog(true)}
            style={sharedStyles.iconButton}>
            <MaterialIcons name="info-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={sharedStyles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={sharedStyles.buttonRow}>
          <TouchableOpacity
            style={sharedStyles.greyButton}
            onPress={() => navigation.navigate("WelcomeScreen")}>
            <Text style={sharedStyles.greyButtonText}>Back ◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedStyles.purpleButton}
            onPress={async () => {
              const saved = await handleCreateAccount();
              if (saved) {
                navigation.navigate("PlankScreen");
              }
            }}>
            <Text style={sharedStyles.purpleButtonText}>Save ▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
