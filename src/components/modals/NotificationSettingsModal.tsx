import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { User } from "@/models/user";
import { DEFAULT_REMINDER_TIMES } from "@/constants/user";
import { styles } from "@/constants/theme";
import { updateUser } from "@/services/dataService";
import { useState, useCallback } from "react";
import {
  cancelAllSchedules,
  scheduleRemindersFromDatabase,
} from "@/services/reminderService";
import { clearNotificationStore } from "@/services/notificationStore";

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
}

export default function NotificationSettingsModal({
  visible,
  onClose,
  user,
}: NotificationSettingsModalProps) {
  if (!user) return null;

  const [formData, setFormData] = useState(user);

  const handlePreferenceChange = useCallback(
    async (
      field: keyof User["notificationPreferences"],
      value: boolean | number
    ) => {
      try {
        const updatedUser = {
          ...formData,
          notificationPreferences: {
            ...formData.notificationPreferences,
            [field]: value,
          },
        };
        setFormData(updatedUser);

        // Yeni offset kaydı
        await updateUser(updatedUser);

        // Eski bildirimleri sil
        await cancelAllSchedules();

        // NotificationStore sıfırla
        await clearNotificationStore();

        // Yeni offset ile reminder'ları planla
        await scheduleRemindersFromDatabase();
      } catch (error) {
        console.error("Bildirim tercihi güncellenirken hata:", error);
      }
    },
    [formData]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={[
            localStyles.modalContainer,
            { backgroundColor: styles.colors.background },
          ]}
        >
          <View
            style={[
              localStyles.modalHeader,
              { borderBottomColor: styles.colors.border },
            ]}
          >
            <Text style={[styles.typography.h1, { color: styles.colors.text }]}>
              Bildirim Ayarları
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons
                name="close"
                color={styles.colors.text}
                size={24}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={localStyles.modalContent}>
            <View style={localStyles.notificationSection}>
              <Text
                style={[
                  styles.typography.h2,
                  { marginBottom: 16, color: styles.colors.text },
                ]}
              >
                Bildirim Türleri
              </Text>

              <View style={localStyles.notificationOption}>
                <Text
                  style={[
                    styles.typography.body,
                    { color: styles.colors.text },
                  ]}
                >
                  Sesli Bildirim
                </Text>
                <Switch
                  value={formData.notificationPreferences.sound}
                  onValueChange={(value) =>
                    handlePreferenceChange("sound", value)
                  }
                  trackColor={{ false: "#767577", true: styles.colors.primary }}
                />
              </View>

              <View style={localStyles.notificationOption}>
                <Text
                  style={[
                    styles.typography.body,
                    { color: styles.colors.text },
                  ]}
                >
                  Titreşim
                </Text>
                <Switch
                  value={formData.notificationPreferences.vibration}
                  onValueChange={(value) =>
                    handlePreferenceChange("vibration", value)
                  }
                  trackColor={{ false: "#767577", true: styles.colors.primary }}
                />
              </View>
            </View>

            <View style={localStyles.notificationSection}>
              <Text
                style={[
                  styles.typography.h2,
                  { marginBottom: 16, color: styles.colors.text },
                ]}
              >
                Hatırlatma Zamanı
              </Text>

              <View style={localStyles.timeOptions}>
                {DEFAULT_REMINDER_TIMES.map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      localStyles.timeOption,
                      {
                        backgroundColor:
                          formData.notificationPreferences.reminderTime ===
                          minutes
                            ? styles.colors.primary
                            : styles.colors.background,
                        borderColor: styles.colors.border,
                      },
                    ]}
                    onPress={() =>
                      handlePreferenceChange("reminderTime", minutes)
                    }
                  >
                    <Text
                      style={[
                        styles.typography.body,
                        {
                          color:
                            formData.notificationPreferences.reminderTime ===
                            minutes
                              ? "white"
                              : styles.colors.text,
                        },
                      ]}
                    >
                      {minutes} dk önce
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[
                localStyles.saveButton,
                { backgroundColor: styles.colors.primary },
              ]}
              onPress={onClose}
            >
              <Text style={[styles.typography.body, { color: "white" }]}>
                Kaydet
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  notificationSection: {
    marginBottom: 24,
  },
  notificationOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  timeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  saveButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
});
