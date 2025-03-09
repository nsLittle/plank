import * as SecureStore from "expo-secure-store";
import { useEffect, useState, useContext } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

export default function LoginScreen() {
  const navigation = useNavigation();

  const { userContext, setUserContext } = useContext(UserContext) || {};

  useEffect(() => {
    if (userContext) {
      console.log("User Context: ", userContext);
    }
  }, [userContext]);

  const [dialogMessage, setDialogMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

      const saveToken = async (token) => {
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <Text style={styles.bodyTitleText}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={styles.buttonColumn}>
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("WelcomeScreen")}>
            <Text style={styles.backButtonText}>
              Return to Welcome Screen ◀
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={async () => {
              console.log("Login button pressed");
              const saved = await handleLogin();
              if (saved) {
                navigation.navigate("PlankScreen");
              }
            }}>
            <Text style={styles.loginButtonText}>Login ▶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accountLink}
            onPress={() => navigation.navigate("CreateAccountScreen")}>
            <Text style={styles.accountLinkText}>Create Account ▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingHorizontal: wp("5%"),
  },
  body: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingTop: Platform.OS === "web" ? hp("20%") : hp("2%"),
  },
  bodyTitleText: {
    fontSize: 26,
    textAlign: "center",
    paddingBottom: 30,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#D3D3D3",
    borderWidth: 1,
    width: 400,
    height: 30,
    color: "#606060",
    marginBottom: 10,
  },
  buttonColumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    gap: 15,
    marginTop: 50,
  },
  loginButton: {
    backgroundColor: "#bc4598",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    width: 150,
    height: 45,
    justifyContent: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  accountButton: {
    backgroundColor: "#D3D3D3",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    width: 150,
    height: 45,
    justifyContent: "center",
  },
  accountButtonText: {
    color: "#bc4598",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
});
