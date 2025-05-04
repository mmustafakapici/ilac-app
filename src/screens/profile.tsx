import {
  StyleSheet,
  View,
  Switch,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import * as Notifications from "expo-notifications";
import {
  Moon,
  Sun,
  Bell,
  User as UserIcon,
  CircleHelp as HelpCircle,
  LogOut,
  Play,
  Trash2,
} from "lucide-react-native";
import { useState, useEffect } from "react";
import { User } from "@/models/user";
import { getUser } from "@/services/dataService";
import EditProfileModal from "@/components/modals/EditProfileModal";
import NotificationSettingsModal from "@/components/modals/NotificationSettingsModal";
import { styles } from "@/constants/theme";
import { cancelAllNotifications } from "@/utils/notificationUtils";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] =
    useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleNotificationDemo = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Bildirim Demo",
          body: "Bu bir test bildirimidir!",
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Bildirim gönderilirken hata oluştu:", error);
    }
  };

  const ProfileOption = ({
    icon,
    title,
    rightElement = null,
    onPress,
  }: {
    icon: React.ReactNode;
    title: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
  }) => (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          localStyles.optionItem,
          {
            backgroundColor: styles.colors.card,
            borderRadius: styles.borderRadius.md,
            marginBottom: styles.spacing.md,
          },
        ]}
      >
        <View style={localStyles.optionContent}>
          <View style={localStyles.iconContainer}>{icon}</View>
          <Text
            style={[
              styles.typography.body,
              { flex: 1, color: styles.colors.text },
            ]}
          >
            {title}
          </Text>
          {rightElement}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={[localStyles.container, localStyles.centerContent]}>
        <ActivityIndicator size="large" color={styles.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        localStyles.container,
        { backgroundColor: styles.colors.background },
      ]}
    >
      <View style={localStyles.profileHeader}>
        <View
          style={[
            localStyles.profileImage,
            {
              backgroundColor: styles.colors.primary,
              borderRadius: 50,
            },
          ]}
        >
          <UserIcon size={32} color="white" />
        </View>
        <View style={{ marginLeft: styles.spacing.md }}>
          <Text style={[styles.typography.h1, { color: styles.colors.text }]}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
          <Text style={[styles.typography.body, { color: styles.colors.text }]}>
            {user.email}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: styles.spacing.xl }}>
        <Text
          style={[
            styles.typography.h2,
            { marginBottom: styles.spacing.md, color: styles.colors.text },
          ]}
        >
          Ayarlar
        </Text>

        <ProfileOption
          icon={<Play color={styles.colors.text} />}
          title="Bildirim Demosu"
          onPress={handleNotificationDemo}
        />

        <ProfileOption
          icon={
            isDark ? (
              <Moon color={styles.colors.text} />
            ) : (
              <Sun color={styles.colors.text} />
            )
          }
          title="Koyu Tema"
          rightElement={
            <Switch
              value={isDark}
              onValueChange={setIsDark}
              trackColor={{ false: "#767577", true: styles.colors.primary }}
              thumbColor="#f4f3f4"
            />
          }
        />

        <ProfileOption
          icon={<UserIcon color={styles.colors.text} />}
          title="Kişisel Bilgileri Düzenle"
          onPress={() => setIsEditModalVisible(true)}
        />

        <ProfileOption
          icon={<Bell color={styles.colors.text} />}
          title="Bildirim Tercihleri"
          onPress={() => setIsNotificationModalVisible(true)}
        />

        <ProfileOption
          icon={<Trash2 color={styles.colors.danger} />}
          title="Tüm Bildirimleri Temizle"
          onPress={cancelAllNotifications}
        />

        <ProfileOption
          icon={<HelpCircle color={styles.colors.text} />}
          title="Yardım ve Destek"
        />

        <ProfileOption
          icon={<LogOut color={styles.colors.danger} />}
          title="Çıkış Yap"
        />
      </View>

      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        user={user}
      />

      <NotificationSettingsModal
        visible={isNotificationModalVisible}
        onClose={() => setIsNotificationModalVisible(false)}
        user={user}
      />
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  optionItem: {
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 16,
  },
});
