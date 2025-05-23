import React from "react";
import { Text } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { sharedStyles } from "../styles/sharedStyles";

interface PlankDialogProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

export const PlankDialog: React.FC<PlankDialogProps> = ({
  visible,
  message,
  onDismiss,
}) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={sharedStyles.dialog}>
        <Dialog.Title style={sharedStyles.dialogTitle}>ALERT</Dialog.Title>
        <Dialog.Content>
          <Text style={sharedStyles.dialogText}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} labelStyle={sharedStyles.dialogButton}>
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
