import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { PermissionProvider } from "@/context/PermissionContext";
import TabNavigator from "@/navigation/TabNavigator";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditProfileModal from "@/components/modals/EditProfileModal";
import { getUser } from "@/services/dataService";
import { User } from "@/models/user";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { styles } from "@/constants/theme";

export default function App() {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const isFirstTime = await AsyncStorage.getItem("profileCompleted");
        if (!isFirstTime) {
          const userData = await getUser();
          setUser(userData);
          setIsProfileModalVisible(true);
        }
      } catch (error) {
        console.error("Profil kontrolü sırasında hata:", error);
      }
    };

    checkFirstTime();
  }, []);

  const handleProfileModalClose = async () => {
    try {
      await AsyncStorage.setItem("profileCompleted", "true");
      setIsProfileModalVisible(false);
    } catch (error) {
      console.error("Profil kaydı sırasında hata:", error);
    }
  };

  return (
    <SafeAreaProvider>
      <PermissionProvider>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#FBFCFC" }}>
            <TabNavigator />
            <StatusBar style="auto" />
            {user && (
              <EditProfileModal
                visible={isProfileModalVisible}
                onClose={handleProfileModalClose}
                user={user}
              />
            )}
          </SafeAreaView>
        </NavigationContainer>
      </PermissionProvider>
    </SafeAreaProvider>
  );
}
