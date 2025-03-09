import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <Text style={styles.bodyTitleText}>Welcome</Text>

        <Text style={styles.bodyIntroText}>
          The proven core formation method
        </Text>

        {/* <TouchableOpacity>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("PlankTypeScreen")}>
            Discover
          </Text>
        </TouchableOpacity> */}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.noAccountButton}
            onPress={() => navigation.navigate("PlankNoAccountScreen")}>
            <Text style={styles.noAccountButtonText}>No Account Option ▶</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.noAccountButton}
            onPress={() => navigation.navigate("CreateAccountScreen")}>
            <Text style={styles.noAccountButtonText}>Create Account ▶</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.loginButtonText}>Login ▶</Text>
          </TouchableOpacity>
        </View>
        {/* 
        <TouchableOpacity>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("EndingCreditsScreen")}>
            Ending Credits
          </Text>
        </TouchableOpacity> */}
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
  bodyIntroText: {
    textAlign: "center",
    fontSize: 14,
    paddingBottom: 15,
    width: 225,
  },
  link: {
    fontSize: 12,
    paddingTop: 15,
    color: "#6A8CAF",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
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
  noAccountButton: {
    backgroundColor: "#D3D3D3",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    width: 150,
    height: 45,
    justifyContent: "center",
  },
  noAccountButtonText: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
});
