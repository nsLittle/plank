import * as SecureStore from "expo-secure-store";
import {
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { sharedStyles } from "../styles/sharedStyles";
import { RootStackParamList } from "../types/navigation";

export default function LogoutScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        sessionStorage.removeItem("authToken");
      } else {
        await SecureStore.deleteItemAsync("authToken");
      }

      navigation.navigate("WelcomeScreen");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.container}>
      <View style={sharedStyles.body}>
        <Text style={sharedStyles.bodyTitleText}>Logout</Text>

        <Text style={sharedStyles.bodyIntroText}>
          Are you sure you don't have time for another plank?
        </Text>

        <View style={sharedStyles.buttonRow}>
          <TouchableOpacity
            style={sharedStyles.purpleButton}
            onPress={() => navigation.navigate("PlankScreen")}>
            <Text style={sharedStyles.purpleButtonText}>One more rep!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedStyles.greyButton}
            onPress={() => {
              handleLogout;
              navigation.navigate("EndingCreditsScreen");
            }}>
            <Text style={sharedStyles.greyButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
