import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Platform } from "react-native";

// Bildirim ayarlarını yapılandır
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarActiveTintColor: styles.colors.primary,
        tabBarInactiveTintColor: styles.colors.text,
      }}
    >
      {/* ... existing tab screens ... */}
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // Bildirim izinlerini kontrol et ve Push Token'ı al
    const setupNotifications = async () => {
      try {
        // Bildirim izinlerini kontrol et
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          const { status: newStatus } =
            await Notifications.requestPermissionsAsync();
          if (newStatus !== "granted") {
            console.log("Bildirim izni reddedildi!");
            return;
          }
        }

        // Push Token'ı al ve kaydet
        const token = await Notifications.getExpoPushTokenAsync();
        await AsyncStorage.setItem("expoPushToken", token.data);
        console.log("Push Token kaydedildi:", token.data);

        // Bildirim kanalını oluştur (Android için)
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }
      } catch (error) {
        console.error("Bildirim kurulumu sırasında hata:", error);
      }
    };

    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          {/* ... existing stack screens ... */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
