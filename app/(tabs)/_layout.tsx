import { useTheme } from "@/context/ThemeContext";
import { Tabs } from "expo-router";
import { Bell, Home, PieChart, Settings, Users } from "lucide-react-native";

export default function TabLayout() {
    const { colors } = useTheme();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text,
                tabBarLabelStyle: {
                    fontFamily: "Inter-Medium",
                    fontSize: 12,
                },
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    height: 60,
                    paddingBottom: 10,
                    paddingTop: 8,
                },
                headerShown: true,
                headerTitleStyle: {
                    fontFamily: "Inter-SemiBold",
                    color: colors.text,
                    fontSize: 18,
                },
                headerStyle: {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    backgroundColor: colors.background,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Home size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="groups"
                options={{
                    title: "Groups & Friends",
                    tabBarLabel: "Groups",
                    tabBarIcon: ({ color, size }) => (
                        <Users size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="expenses"
                options={{
                    title: "Expenses",
                    tabBarLabel: "Expenses",
                    tabBarIcon: ({ color, size }) => (
                        <PieChart size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="activity"
                options={{
                    title: "Activity",
                    tabBarLabel: "Activity",
                    tabBarIcon: ({ color, size }) => (
                        <Bell size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <Settings size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
