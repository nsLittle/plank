import Toast, { BaseToast } from "react-native-toast-message";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#a855f7",
        backgroundColor: "#f3e8ff",
        borderRadius: 16,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        minHeight: 80,
        width: "90%",
        maxW: 400,
        paddingVertical: 16,
        marginTop: 100,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "500",
        color: "#6b21a8",
      }}
      text2Style={{
        fontSize: 18,
        color: "#6b21a8",
      }}
    />
  ),
};

export default toastConfig;
