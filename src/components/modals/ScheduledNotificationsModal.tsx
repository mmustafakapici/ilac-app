import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as Notifications from "expo-notifications";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/theme";

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

  useEffect(() => {
    if (visible) {
      const fetchNotifications = async () => {
        const notifications =
          await Notifications.getAllScheduledNotificationsAsync();
        setScheduledNotifications(notifications);
      };
      fetchNotifications();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={stylesModal.overlay}>
        <View style={stylesModal.modalContainer}>
          <View style={stylesModal.header}>
            <Text style={stylesModal.title}>Planlanmış Bildirimler</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 400 }}>
            {scheduledNotifications.length === 0 ? (
              <Text style={stylesModal.emptyText}>
                Planlanmış bildirim yok.
              </Text>
            ) : (
              scheduledNotifications.map((notif: any, index: number) => {
                const { title, body } = notif.content || {};
                let triggerText = "";
                if (notif.trigger?.date) {
                  triggerText = new Date(notif.trigger.date).toLocaleString(
                    "tr-TR"
                  );
                } else if (
                  notif.trigger?.hour !== undefined &&
                  notif.trigger?.minute !== undefined
                ) {
                  triggerText = `${notif.trigger.hour
                    .toString()
                    .padStart(2, "0")}:${notif.trigger.minute
                    .toString()
                    .padStart(2, "0")}`;
                  if (notif.trigger.repeats) triggerText += " (Tekrarlı)";
                }
                return (
                  <View key={index} style={stylesModal.notificationItem}>
                    <Text style={stylesModal.notificationContent}>
                      {title || "Başlıksız Bildirim"}
                    </Text>
                    {body ? (
                      <Text style={stylesModal.notificationTime}>{body}</Text>
                    ) : null}
                    <Text style={stylesModal.notificationTime}>
                      {triggerText}
                    </Text>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const stylesModal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  notificationContent: {
    color: "#222",
    fontSize: 15,
  },
  notificationTime: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },
});
