import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { sharedStyles } from "../styles/sharedStyles";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={sharedStyles.container}>
      <View style={sharedStyles.body}>
        <Text style={sharedStyles.bodyTitleText}>Welcome</Text>

        <Text style={sharedStyles.bodyIntroText}>
          The proven core formation method
        </Text>

        <View style={sharedStyles.buttonRow}>
          <TouchableOpacity
            style={sharedStyles.greyButton}
            onPress={() => navigation.navigate("PlankNoAccountScreen")}>
            <Text style={sharedStyles.greyButtonText}>
              Plank without Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={sharedStyles.purpleButton}
            onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={sharedStyles.purpleButtonText}>Login ▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
