import { StyleSheet, Platform, TextStyle, ViewStyle } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

type Styles = {
  container: ViewStyle;
  body: ViewStyle;
  bodyTitleText: TextStyle;
  bodyIntroText: TextStyle;
  headerContainer: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  input: ViewStyle & TextStyle;
  inputText: TextStyle;
  iconInputContainer: ViewStyle;
  menuIcon: TextStyle;
  menuList: ViewStyle;
  menuItem: TextStyle;
  iconButton: ViewStyle;
  buttonRow: ViewStyle;
  buttonColumn: ViewStyle;
  greyButtonText: TextStyle;
  purpleButtonText: TextStyle;
  greyButton: ViewStyle;
  purpleButton: ViewStyle;
  dialog: ViewStyle;
  dialogTitle: TextStyle;
  dialogText: TextStyle;
  dialogButton: TextStyle;
  dialogButtonConfirm: TextStyle;
};

export const sharedStyles = StyleSheet.create<Styles>({
  // MAIN BODY
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
    paddingTop: Platform.OS === "web" ? hp("5%") : hp("1%"),
  },
  bodyTitleText: {
    fontSize: 42,
    textAlign: "center",
    paddingBottom: 30,
  },
  bodyIntroText: {
    textAlign: "center",
    fontSize: 14,
    paddingBottom: 15,
    width: 225,
  },

  // HEADER
  headerContainer: {
    backgroundColor: "#8A5F9E",
    height: 200,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 5,
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: 70,
  },
  headerTitle: {
    textAlign: "center",
    flex: 1,
    fontSize: 30,
    color: "#F3F0EC",
  },

  // INPUTS
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#D3D3D3",
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderRadius: 5,
    width: "85%",
    height: 48,
    color: "#606060",
    marginBottom: 15,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 0,
  },
  inputText: {
    height: 48,
    paddingVertical: 0,
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 12,
    textAlignVertical: "center",
    color: "#606060",
    fontSize: 16,
  },
  iconInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#D3D3D3",
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderRadius: 5,
    width: "85%",
    height: 40,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },

  // MENUS
  menuIcon: {
    color: "#000",
    zIndex: 20,
    position: "relative",
  },
  menuList: {
    zIndex: 9999,
    elevation: 10,
    backgroundColor: "#FFF",
    position: "absolute",
    top: 100,
    left: 20,
    padding: 10,
    width: "80%",
    maxWidth: 250,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CCC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  menuItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },

  // ICONS
  iconButton: {
    paddingLeft: 10,
    paddingRight: 0,
    height: "100%",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  // BUTTONS
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    gap: 15,
    marginTop: 50,
  },
  buttonColumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    gap: 15,
    marginTop: 50,
    marginBottom: 50,
  },
  greyButtonText: {
    color: "black",
    fontSize: 14,
    textAlign: "center",
  },
  purpleButtonText: {
    color: "#FFFFF0",
    fontSize: 14,
    textAlign: "center",
  },
  greyButton: {
    backgroundColor: "#D3D3D3",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 45,
    marginBottom: 15,
  },
  purpleButton: {
    backgroundColor: "#8A5F9E",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 45,
    marginBottom: 15,
  },

  // DIALOGS
  dialog: {
    backgroundColor: "white",
  },
  dialogTitle: {
    color: "purple",
    fontWeight: "bold",
    fontSize: 32,
  },
  dialogButton: {
    color: "#ff007f",
    fontWeight: "bold",
    fontSize: 24,
  },
  dialogText: {
    fontSize: 18,
    paddingTop: 10,
  },
  dialogButtonConfirm: {
    color: "purple",
    fontWeight: "bold",
    fontSize: 24,
  },
});
