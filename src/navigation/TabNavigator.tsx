import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
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
          height: 70,
          paddingBottom: 12,
          paddingTop: 12,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
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
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />,
          headerTitle: "Dashboard",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="medications"
        component={require("@/screens/medications").default}
        options={{
          title: "İlaçlarım",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="pill" size={size} color={color} />,
          headerTitle: "İlaçlarım",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="daily"
        component={require("@/screens/daily").default}
        options={{
          title: "Günlük",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="schedule" size={size} color={color} />,
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
            <MaterialCommunityIcons name="calendar-month" size={size} color={color} />
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
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
          headerTitle: "Profil",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
