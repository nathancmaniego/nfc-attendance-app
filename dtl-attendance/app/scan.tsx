import React, { useState } from "react";
import { View } from "react-native";
import { Button, Card, HelperText, Text, TextInput } from "react-native-paper";
import { useAttendance } from "./context/AttendanceContext";

export default function ScanScreen() {
  const { markPresentTodayByNfc } = useAttendance();
  const [nfcInput, setNfcInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function simulateScan() {
    setMessage(null);
    setError(null);
    const value = nfcInput.trim();
    if (!value) {
      setError("Enter an NFC tag ID to simulate a scan.");
      return;
    }
    const { child, alreadyMarked } = markPresentTodayByNfc(value);
    if (!child) {
      setError("No child found with that NFC ID.");
      return;
    }
    setMessage(`${child.name} marked present${alreadyMarked ? " (already marked)" : ""}.`);
    setNfcInput("");
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Card>
        <Card.Title title="Scan NFC (Simulated)" subtitle="Type an NFC ID and press Scan" />
        <Card.Content>
          <TextInput
            label="NFC Tag ID"
            value={nfcInput}
            onChangeText={setNfcInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {!!error && <HelperText type="error">{error}</HelperText>}
          {!!message && <Text style={{ marginTop: 8 }}>{message}</Text>}
          <Button mode="contained" onPress={simulateScan} style={{ marginTop: 12 }}>
            Scan
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}


