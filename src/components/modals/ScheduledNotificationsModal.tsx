import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { X, Bell } from "lucide-react-native";
import * as Notifications from "expo-notifications";
import { styles } from "@/constants/theme";
import { getAllMedicines } from "@/services/dataService";

interface ScheduledNotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ScheduledNotificationsModal({
  visible,
  onClose,
}: ScheduledNotificationsModalProps) {
  const [scheduledNotifications, setScheduledNotifications] = useState<any[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadScheduledNotifications();
    }
  }, [visible]);

  const loadScheduledNotifications = async () => {
    try {
      console.log("=== PLANLANMIŞ BİLDİRİMLER YÜKLENİYOR ===");
      setIsLoading(true);

      // Tüm ilaçları al
      const medicines = await getAllMedicines();
      console.log("Toplam ilaç sayısı:", medicines.length);

      // Her ilaç için planlanmış bildirimleri kontrol et
      const notifications = [];
      for (const med of medicines) {
        if (!med.schedule?.reminders) continue;

        console.log(`${med.name} için bildirimler kontrol ediliyor...`);
        for (const time of med.schedule.reminders) {
          const [hour, minute] = time.split(":").map(Number);

          notifications.push({
            id: `${med.id}-${time}`,
            medicine: med.name,
            time: time,
            dosage: `${med.dosage?.amount || 0}${med.dosage?.unit || ""}`,
            condition: med.usage?.condition || "Belirtilmemiş",
            scheduledTime: `${hour}:${minute}`,
          });
        }
      }

      console.log("Planlanmış bildirimler:", notifications);
      setScheduledNotifications(notifications);
    } catch (error) {
      console.error("Bildirimler yüklenirken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
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
            Planlanmış Bildirimler
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X color={styles.colors.text} size={24} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={localStyles.loadingContainer}>
            <ActivityIndicator size="large" color={styles.colors.primary} />
            <Text
              style={[
                styles.typography.body,
                { color: styles.colors.text, marginTop: 16 },
              ]}
            >
              Bildirimler yükleniyor...
            </Text>
          </View>
        ) : scheduledNotifications.length === 0 ? (
          <View style={localStyles.emptyContainer}>
            <Bell size={48} color={styles.colors.text} />
            <Text
              style={[
                styles.typography.body,
                { color: styles.colors.text, marginTop: 16 },
              ]}
            >
              Planlanmış bildirim bulunmuyor
            </Text>
          </View>
        ) : (
          <ScrollView style={localStyles.notificationsContainer}>
            {scheduledNotifications.map((notification) => (
              <View
                key={notification.id}
                style={[
                  localStyles.notificationItem,
                  {
                    backgroundColor: styles.colors.card,
                    borderColor: styles.colors.border,
                  },
                ]}
              >
                <View style={localStyles.notificationHeader}>
                  <Text
                    style={[
                      styles.typography.h3,
                      { color: styles.colors.text },
                    ]}
                  >
                    {notification.medicine}
                  </Text>
                  <Text
                    style={[
                      styles.typography.body,
                      { color: styles.colors.text },
                    ]}
                  >
                    {notification.time}
                  </Text>
                </View>
                <View style={localStyles.notificationDetails}>
                  <Text
                    style={[
                      styles.typography.body,
                      { color: styles.colors.text },
                    ]}
                  >
                    Doz: {notification.dosage}
                  </Text>
                  <Text
                    style={[
                      styles.typography.body,
                      { color: styles.colors.text },
                    ]}
                  >
                    Kullanım: {notification.condition}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationsContainer: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationDetails: {
    gap: 4,
  },
});
