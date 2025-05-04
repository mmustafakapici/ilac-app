import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Reminder } from "@/models/reminder";
import { getAllReminders } from "@/services/dataService";
import { styles } from "@/constants/theme";
import CalendarComponent from "@/components/CalendarComponent";
import CalendarMedicationCard from "@/components/CalendarMedicationCard";
import { parseTime } from "@/utils/dateUtils";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const loadReminders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllReminders();
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
      console.log("🎯 Takvim ekranı odağa alındı");
      loadReminders();
    }
  }, [isFocused]);

  // Her ilacı bir kez göstermek için benzersiz ilaçları filtrele
  const getUniqueMedicineReminders = (reminders) => {
    const seen = new Set();
    return reminders.filter((r) => {
      const key = r.medicine?.id || r.medicine?.name;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
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

  return (
    <SafeAreaView
      style={[
        localStyles.container,
        { backgroundColor: styles.colors.background },
      ]}
    >
      <Text style={[styles.typography.h1, { color: styles.colors.text }]}>
        Takvim
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
        <CalendarComponent
          reminders={getUniqueMedicineReminders(reminders).map((r) => {
            let hourMinute = r.scheduledTime;
            if (
              typeof r.scheduledTime === "string" &&
              r.scheduledTime.includes("T")
            ) {
              const timePart = r.scheduledTime
                .split("T")[1]
                ?.split("Z")[0]
                ?.slice(0, 5);
              if (timePart) hourMinute = timePart;
            }
            try {
              const { hour, minute } = parseTime(hourMinute);
              hourMinute = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
            } catch {}
            return { ...r, scheduledTime: hourMinute };
          })}
        />

        {getUniqueMedicineReminders(reminders).map((reminder, index) => (
          <CalendarMedicationCard key={index} medicine={reminder.medicine} />
        ))}
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
});
