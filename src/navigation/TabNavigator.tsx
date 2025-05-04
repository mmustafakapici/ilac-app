import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  House as Home,
  Pill,
  Calendar,
  Clock,
  User,
} from "lucide-react-native";
import { styles } from "@/constants/theme";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: styles.colors.tabBarActive,
        tabBarInactiveTintColor: styles.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: styles.colors.card,
          borderTopColor: "transparent",
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: styles.colors.card,
        },
        headerTintColor: styles.colors.text,
        headerTitleStyle: {
          fontFamily: "Inter-Medium",
        },
      }}
    >
      <Tab.Screen
        name="index"
        component={require("@/screens/index").default}
        options={{
          title: "Genel",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: "Dashboard",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="medications"
        component={require("@/screens/medications").default}
        options={{
          title: "İlaçlarım",
          tabBarIcon: ({ color, size }) => <Pill size={size} color={color} />,
          headerTitle: "İlaçlarım",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="daily"
        component={require("@/screens/daily").default}
        options={{
          title: "Günlük",
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
          headerTitle: "Günlük Programım",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="calendar"
        component={require("@/screens/calendar").default}
        options={{
          title: "Takvim",
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
          headerTitle: "İlaç Takvimi",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="profile"
        component={require("@/screens/profile").default}
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: "Profil",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
