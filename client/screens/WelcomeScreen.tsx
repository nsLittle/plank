import * as SecureStore from "expo-secure-store";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { sharedStyles } from "../styles/sharedStyles";
import { RootStackParamList } from "../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView contentContainerStyle={sharedStyles.container}>
      <View style={sharedStyles.body}>
        <Text style={sharedStyles.bodyTitleText}>Welcome</Text>

        <Text style={sharedStyles.bodyIntroText}>
          The proven core formation method
        </Text>

        <View style={sharedStyles.buttonColumn}>
          <TouchableOpacity
            style={sharedStyles.purpleButtonFullMobile}
            onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={sharedStyles.purpleButtonText}>Login ▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
