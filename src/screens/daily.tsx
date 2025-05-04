import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import DailyMedicationCard from "@/components/DailyMedicationCard";
import { Reminder } from "@/models/reminder";
import { useState, useEffect, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { getRemindersByDate, updateReminder } from "@/services/dataService";
import { styles } from "@/constants/theme";
import { groupByDate } from "@/utils/arrayUtils";
import { parseISODate, isSameDay, parseTime } from "@/utils/dateUtils";
import { SafeAreaView } from "react-native-safe-area-context";

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
      setReminders(data);
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
        updatedAt: new Date().toISOString(),
      };
      await updateReminder(updatedReminder);
      await loadReminders();
    } catch (error) {
      console.error("Error updating reminder status:", error);
      setError("Hatırlatıcı durumu güncellenirken bir hata oluştu.");
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
    upcoming: reminders.filter((r) => !r.isTaken && r.scheduledTime >= now),
    taken: reminders.filter((r) => r.isTaken),
    missed: reminders.filter((r) => !r.isTaken && r.scheduledTime < now),
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
    title: string;
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
          <Text style={[styles.typography.h3, { color }]}>{title}</Text>
          <Text style={{ color }}>{reminders.length} ilaç</Text>
        </View>

        {reminders.map((reminder) => (
          <DailyMedicationCard
            key={reminder.id}
            reminder={formatReminder(reminder)}
            onStatusChange={handleStatusChange}
          />
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
              title="Yaklaşan İlaçlar"
              reminders={categorizeReminders(todaysReminders).upcoming}
              color={styles.colors.primary}
            />

            <ReminderSection
              title="Alınan İlaçlar"
              reminders={categorizeReminders(todaysReminders).taken}
              color={styles.colors.success}
            />

            <ReminderSection
              title="Kaçırılan İlaçlar"
              reminders={categorizeReminders(todaysReminders).missed}
              color={styles.colors.danger}
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
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
});
