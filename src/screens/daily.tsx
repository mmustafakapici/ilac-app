import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import DailyMedicationCard from "@/components/DailyMedicationCard";
import { Reminder, ReminderStatus } from "@/models/reminder";
import { useState, useEffect, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { getRemindersByDate, updateReminder } from "@/services/dataService";
import { styles } from "@/constants/theme";
import { groupByDate } from "@/utils/arrayUtils";
import { parseISODate, isSameDay, parseTime } from "@/utils/dateUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function DailyScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const loadReminders = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date().toISOString().split("T")[0];
      const data = await getRemindersByDate(today);

      // Şu anki saati al
      const now = new Date();
      const currentTime = now.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Saati geçen ve alınmamış ilaçları "kaçırıldı" olarak işaretle
      const updatedReminders = await Promise.all(
        data.map(async (reminder) => {
          if (!reminder.isTaken && reminder.status !== ReminderStatus.SKIPPED) {
            const reminderTime = reminder.scheduledTime
              .split("T")[1]
              ?.slice(0, 5);
            if (reminderTime && reminderTime < currentTime) {
              // Kaçırıldı olarak işaretle
              const updatedReminder = {
                ...reminder,
                status: ReminderStatus.MISSED,
                updatedAt: new Date().toISOString(),
              };
              // Veritabanını güncelle
              await updateReminder(updatedReminder);
              return updatedReminder;
            }
          }
          return reminder;
        })
      );

      setReminders(updatedReminders);
    } catch (err) {
      console.error("Error loading reminders:", err);
      setError("Hatırlatıcılar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadReminders();
  }, []);

  useEffect(() => {
    if (isFocused) {
      console.log("🎯 Günlük ekran odağa alındı");
      loadReminders();
    }
  }, [isFocused]);

  const handleStatusChange = async (reminder: Reminder, newStatus: boolean) => {
    try {
      const updatedReminder = {
        ...reminder,
        isTaken: newStatus,
        status: newStatus ? ReminderStatus.TAKEN : ReminderStatus.PENDING,
        updatedAt: new Date().toISOString(),
      };
      await updateReminder(updatedReminder);
      await loadReminders();
    } catch (error) {
      console.error("Error updating reminder status:", error);
      setError("Hatırlatıcı durumu güncellenirken bir hata oluştu.");
    }
  };

  const handleSkipReminder = async (reminder: Reminder) => {
    try {
      const updatedReminder = {
        ...reminder,
        isTaken: false,
        status: ReminderStatus.SKIPPED,
        updatedAt: new Date().toISOString(),
      };
      await updateReminder(updatedReminder);
      await loadReminders();
    } catch (error) {
      console.error("Error skipping reminder:", error);
      setError("Hatırlatıcı atlanırken bir hata oluştu.");
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[localStyles.container, localStyles.centerContent]}>
        <ActivityIndicator size="large" color={styles.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[localStyles.container, localStyles.centerContent]}>
        <Text style={{ color: styles.colors.danger }}>{error}</Text>
      </View>
    );
  }

  const now = new Date().toLocaleTimeString().slice(0, 5);
  const today = parseISODate(new Date().toISOString().split("T")[0]);

  const groupedReminders = groupByDate(reminders);
  const todaysReminders = reminders.filter((r) =>
    isSameDay(parseISODate(r.date), today)
  );

  const categorizeReminders = (reminders: Reminder[]) => ({
    missed: reminders.filter(
      (r) => !r.isTaken && r.status === ReminderStatus.MISSED
    ),
    upcoming: reminders.filter(
      (r) =>
        !r.isTaken &&
        r.status !== ReminderStatus.MISSED &&
        r.scheduledTime >= now
    ),
    taken: reminders.filter((r) => r.isTaken),
  });

  const formatReminder = (reminder: Reminder) => {
    let displayDate = "";
    try {
      const dateObj = parseISODate(reminder.date);
      displayDate = dateObj.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      displayDate = reminder.date;
    }
    let displayTime = reminder.scheduledTime;
    if (
      typeof reminder.scheduledTime === "string" &&
      reminder.scheduledTime.includes("T")
    ) {
      const timePart = reminder.scheduledTime
        .split("T")[1]
        ?.split("Z")[0]
        ?.slice(0, 5);
      if (timePart) displayTime = timePart;
    }
    try {
      const { hour, minute } = parseTime(displayTime);
      displayTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    } catch {}
    return { ...reminder, displayDate, displayTime };
  };

  const ReminderSection = ({
    title,
    reminders,
    color,
  }: {
    title: string | React.ReactNode;
    reminders: Reminder[];
    color: string;
  }) =>
    reminders.length > 0 && (
      <View style={{ marginBottom: styles.spacing.lg }}>
        <View
          style={[
            localStyles.sectionHeader,
            { marginBottom: styles.spacing.sm },
          ]}
        >
          {typeof title === "string" ? (
            <Text style={[styles.typography.h3, { color }]}>{title}</Text>
          ) : (
            title
          )}
          <Text style={{ color }}>{reminders.length} ilaç</Text>
        </View>

        {reminders.map((reminder) => (
          <View key={reminder.id}>
            <DailyMedicationCard
              reminder={formatReminder(reminder)}
              onStatusChange={handleStatusChange}
              onSkip={handleSkipReminder}
            />
          </View>
        ))}
      </View>
    );

  return (
    <SafeAreaView
      style={[
        localStyles.container,
        { backgroundColor: styles.colors.background },
      ]}
    >
      <Text style={[styles.typography.h1, { color: styles.colors.text }]}>
        Bugünkü İlaç Programı
      </Text>

      <Text
        style={[
          styles.typography.h3,
          {
            marginVertical: styles.spacing.md,
            color: styles.colors.text,
          },
        ]}
      >
        {new Date().toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[styles.colors.primary]}
            tintColor={styles.colors.primary}
          />
        }
      >
        {todaysReminders.length === 0 ? (
          <View
            style={[
              localStyles.emptyContainer,
              {
                backgroundColor: styles.colors.card,
                borderRadius: styles.borderRadius.md,
              },
            ]}
          >
            <Text style={{ textAlign: "center", color: styles.colors.text }}>
              Bugün için planlanmış ilaç bulunmamaktadır.
            </Text>
          </View>
        ) : (
          <View style={{ marginBottom: styles.spacing.xl }}>
            <ReminderSection
              title={
                <View style={localStyles.sectionTitleContainer}>
                  <MaterialIcons
                    name="warning"
                    size={24}
                    color={styles.colors.danger}
                  />
                  <Text
                    style={[
                      styles.typography.h3,
                      { color: styles.colors.danger, marginLeft: 8 },
                    ]}
                  >
                    Kaçırılan İlaçlar
                  </Text>
                </View>
              }
              reminders={categorizeReminders(todaysReminders).missed}
              color={styles.colors.danger}
            />

            <ReminderSection
              title="Yaklaşan İlaçlar"
              reminders={categorizeReminders(todaysReminders).upcoming}
              color={styles.colors.primary}
            />

            <ReminderSection
              title="Alınan İlaçlar"
              reminders={categorizeReminders(todaysReminders).taken}
              color={styles.colors.success}
            />
          </View>
        )}
      </ScrollView>
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
});
