import React from "react";
import { ScrollView, View } from "react-native";
import { Card, Text, Button, List, Divider } from "react-native-paper";
import { useAttendance } from "./context/AttendanceContext";

function getTodayDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Index() {
  const { children, getPresentIdsForDate } = useAttendance();
  const today = getTodayDateString();
  const presentToday = getPresentIdsForDate(today);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card>
        <Card.Title title="Dashboard" subtitle={`Today: ${today}`} />
        <Card.Content>
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
            <Card style={{ flex: 1 }}>
              <Card.Content>
                <Text variant="titleLarge">{children.length}</Text>
                <Text variant="labelMedium">Children</Text>
              </Card.Content>
            </Card>
            <Card style={{ flex: 1 }}>
              <Card.Content>
                <Text variant="titleLarge">{presentToday.length}</Text>
                <Text variant="labelMedium">Present Today</Text>
              </Card.Content>
            </Card>
          </View>
          <Divider />
          <List.Section>
            <List.Subheader>Recently Marked Present</List.Subheader>
            {presentToday.slice(-5).map((childId) => {
              const child = children.find((c) => c.id === childId);
              if (!child) return null;
              return (
                <List.Item
                  key={child.id}
                  title={child.name}
                  description={`NFC: ${child.nfcId}`}
                  left={(props) => <List.Icon {...props} icon="check-circle" />}
                />
              );
            })}
            {presentToday.length === 0 && (
              <Text variant="bodyMedium">No attendance yet today.</Text>
            )}
          </List.Section>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
