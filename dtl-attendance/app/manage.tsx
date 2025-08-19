import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Button, Card, List, TextInput, Text, IconButton } from "react-native-paper";
import { useAttendance } from "./context/AttendanceContext";

export default function ManageScreen() {
  const { children, addChild, removeChild, togglePresentToday } = useAttendance();
  const [name, setName] = useState("");
  const [nfcId, setNfcId] = useState("");

  function onAdd() {
    if (!name.trim()) return;
    addChild(name.trim(), nfcId.trim() || undefined);
    setName("");
    setNfcId("");
  }

  function onDelete(id: string) {
    Alert.alert("Remove Child", "Are you sure you want to remove this child?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeChild(id) },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Card>
        <Card.Title title="Add Child" />
        <Card.Content>
          <TextInput label="Name" value={name} onChangeText={setName} style={{ marginBottom: 8 }} />
          <TextInput
            label="NFC Tag ID (optional)"
            value={nfcId}
            onChangeText={setNfcId}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button mode="contained" onPress={onAdd} style={{ marginTop: 12 }} disabled={!name.trim()}>
            Add Child
          </Button>
        </Card.Content>
      </Card>

      <Card style={{ flex: 1 }}>
        <Card.Title title="Children" subtitle={`${children.length} total`} />
        <Card.Content>
          {children.length === 0 ? (
            <Text>No children yet. Add some above.</Text>
          ) : (
            children.map((c) => (
              <List.Item
                key={c.id}
                title={c.name}
                description={`NFC: ${c.nfcId}`}
                right={() => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconButton icon="check" onPress={() => togglePresentToday(c.id)} accessibilityLabel="Toggle present today" />
                    <IconButton icon="delete" onPress={() => onDelete(c.id)} accessibilityLabel="Delete child" />
                  </View>
                )}
              />
            ))
          )}
        </Card.Content>
      </Card>
    </View>
  );
}


