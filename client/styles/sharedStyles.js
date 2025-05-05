import { StyleSheet } from "react-native";
import { Platform } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const sharedStyles = StyleSheet.create({
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
    paddingTop: Platform.OS === "web" ? hp("20%") : hp("2%"),
  },
  bodyTitleText: {
    fontSize: 28,
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
    borderColor: "#D3D3D3",
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderRadius: 5,
    width: "85%",
    height: 40,
    color: "#606060",
    marginBottom: 10,
    paddingLeft: 10,
  },
  iconInputContainer: {
    borderColor: "#D3D3D3",
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderRadius: 5,
    width: "85%",
    height: 40,
    color: "#606060",
    marginBottom: 10,
    paddingLeft: 10,
    overflow: "hidden",
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
    boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    borderColor: "#CCC",
  },
  menuItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },

  // ICONS
  iconButton: {
    padding: 10,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    width: 200,
    height: 45,
    justifyContent: "center",
  },
  purpleButton: {
    backgroundColor: "#8A5F9E",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    width: 200,
    height: 45,
    justifyContent: "center",
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
    color: "black",
    fontWeight: "bold",
    fontSize: 24,
  },
  dialogButtonConfirm: {
    color: "purple",
    fontWeight: "bold",
    fontSize: 24,
  },
});
