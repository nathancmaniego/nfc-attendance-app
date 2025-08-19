import { Tabs } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AttendanceProvider } from "./context/AttendanceContext";

export default function RootLayout() {
  return (
    <AttendanceProvider>
      <PaperProvider>
        <Tabs
          screenOptions={({ route }) => ({
            headerShown: true,
            tabBarIcon: ({ color, size }) => {
              const iconByRoute: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
                index: "view-dashboard-outline",
                scan: "nfc-variant",
                manage: "account-child-outline",
              };
              const fallbackIcon: keyof typeof MaterialCommunityIcons.glyphMap = "circle-outline";
              const iconName = iconByRoute[route.name] ?? fallbackIcon;
              return (
                <MaterialCommunityIcons name={iconName} color={color} size={size} />
              );
            },
          })}
        >
          <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
          <Tabs.Screen name="scan" options={{ title: "Scan" }} />
          <Tabs.Screen name="manage" options={{ title: "Manage" }} />
        </Tabs>
      </PaperProvider>
    </AttendanceProvider>
  );
}
