import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Reminder } from "@/models/reminder";
import { getAllReminders } from "@/services/dataService";
import { styles } from "@/constants/theme";
import CalendarComponent from "@/components/CalendarComponent";
import CalendarMedicationCard from "@/components/CalendarMedicationCard";
import CalendarFilterBar from "@/components/calendar/CalendarFilterBar";
import MedicineDateRangeCard from "@/components/calendar/MedicineDateRangeCard";
import MedicineStatsCard from "@/components/calendar/MedicineStatsCard";
import { parseTime } from "@/utils/dateUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function CalendarScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tümü");
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

  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch = reminder.medicine?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const today = new Date();
    const reminderDate = new Date(reminder.date);

    let matchesFilter = true;
    switch (activeFilter) {
      case "Bugün":
        matchesFilter = reminderDate.toDateString() === today.toDateString();
        break;
      case "Bu Hafta":
        const weekStart = new Date(
          today.setDate(today.getDate() - today.getDay())
        );
        const weekEnd = new Date(
          today.setDate(today.getDate() - today.getDay() + 6)
        );
        matchesFilter = reminderDate >= weekStart && reminderDate <= weekEnd;
        break;
      case "Bu Ay":
        matchesFilter =
          reminderDate.getMonth() === today.getMonth() &&
          reminderDate.getFullYear() === today.getFullYear();
        break;
    }

    return matchesSearch && matchesFilter;
  });

  const calculateWeeklyStats = useCallback((reminders: Reminder[]) => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );

    // Her gün için alınan ve toplam ilaç sayısını hesapla
    const dailyStats = Array(7)
      .fill(0)
      .map((_, index) => {
        const currentDate = new Date(weekStart);
        currentDate.setDate(currentDate.getDate() + index);
        const dateStr = currentDate.toISOString().split("T")[0];

        const dayReminders = reminders.filter((r) => r.date === dateStr);
        const takenCount = dayReminders.filter((r) => r.isTaken).length;
        const totalCount = dayReminders.length;

        return totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;
      });

    return {
      labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
      datasets: [
        {
          data: dailyStats,
        },
      ],
    };
  }, []);

  const chartData = useMemo(() => {
    return calculateWeeklyStats(reminders);
  }, [reminders, calculateWeeklyStats]);

  // Yeni istatistik kartı komponenti
  function MedicationHistoryCard({ reminders }: { reminders: Reminder[] }) {
    const stats = useMemo(() => {
      const total = reminders.length;
      const taken = reminders.filter((r) => r.isTaken).length;
      const skipped = reminders.filter((r) => r.status === "SKIPPED").length;
      const missed = reminders.filter((r) => r.status === "MISSED").length;
      const pending = reminders.filter((r) => r.status === "PENDING").length;

      return {
        total,
        taken,
        skipped,
        missed,
        pending,
        successRate: total > 0 ? Math.round((taken / total) * 100) : 0,
      };
    }, [reminders]);

    return (
      <View style={localStyles.historyCard}>
        <View style={localStyles.historyHeader}>
          <MaterialIcons
            name="history"
            size={24}
            color={styles.colors.primary}
          />
          <Text style={[styles.typography.h3, { color: styles.colors.text }]}>
            İlaç Geçmişi
          </Text>
        </View>

        <View style={localStyles.statsGrid}>
          <View style={localStyles.statItem}>
            <Text
              style={[localStyles.statValue, { color: styles.colors.success }]}
            >
              {stats.taken}
            </Text>
            <Text
              style={[
                localStyles.statLabel,
                { color: styles.colors.textSecondary },
              ]}
            >
              Alınan
            </Text>
          </View>

          <View style={localStyles.statItem}>
            <Text
              style={[localStyles.statValue, { color: styles.colors.warning }]}
            >
              {stats.skipped}
            </Text>
            <Text
              style={[
                localStyles.statLabel,
                { color: styles.colors.textSecondary },
              ]}
            >
              Atlanan
            </Text>
          </View>

          <View style={localStyles.statItem}>
            <Text
              style={[localStyles.statValue, { color: styles.colors.danger }]}
            >
              {stats.missed}
            </Text>
            <Text
              style={[
                localStyles.statLabel,
                { color: styles.colors.textSecondary },
              ]}
            >
              Kaçırılan
            </Text>
          </View>

          <View style={localStyles.statItem}>
            <Text
              style={[
                localStyles.statValue,
                { color: styles.colors.textSecondary },
              ]}
            >
              {stats.pending}
            </Text>
            <Text
              style={[
                localStyles.statLabel,
                { color: styles.colors.textSecondary },
              ]}
            >
              Bekleyen
            </Text>
          </View>
        </View>

        <View style={localStyles.successRateContainer}>
          <Text
            style={[
              localStyles.successRateLabel,
              { color: styles.colors.textSecondary },
            ]}
          >
            Başarı Oranı
          </Text>
          <Text
            style={[
              localStyles.successRateValue,
              { color: styles.colors.success },
            ]}
          >
            %{stats.successRate}
          </Text>
        </View>
      </View>
    );
  }

  // İlaca özel istatistik kartı komponenti
  function MedicineStatsDetailCard({
    medicine,
    reminders,
  }: {
    medicine: Medicine;
    reminders: Reminder[];
  }) {
    const stats = useMemo(() => {
      const medicineReminders = reminders.filter(
        (r) => r.medicine?.id === medicine.id
      );
      const total = medicineReminders.length;
      const taken = medicineReminders.filter((r) => r.isTaken).length;
      const skipped = medicineReminders.filter(
        (r) => r.status === "SKIPPED"
      ).length;
      const missed = medicineReminders.filter(
        (r) => r.status === "MISSED"
      ).length;
      const pending = medicineReminders.filter(
        (r) => r.status === "PENDING"
      ).length;

      // Son 7 günlük istatistikler
      const last7Days = Array(7)
        .fill(0)
        .map((_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - index);
          const dateStr = date.toISOString().split("T")[0];
          const dayReminders = medicineReminders.filter(
            (r) => r.date === dateStr
          );
          return {
            date: dateStr,
            taken: dayReminders.filter((r) => r.isTaken).length,
            total: dayReminders.length,
          };
        });

      return {
        total,
        taken,
        skipped,
        missed,
        pending,
        successRate: total > 0 ? Math.round((taken / total) * 100) : 0,
        last7Days,
      };
    }, [medicine, reminders]);

    return (
      <View style={localStyles.medicineStatsCard}>
        <View style={localStyles.medicineStatsHeader}>
          <MaterialIcons
            name="analytics"
            size={24}
            color={styles.colors.primary}
          />
          <Text style={[styles.typography.h3, { color: styles.colors.text }]}>
            {medicine.name} İstatistikleri
          </Text>
        </View>

        <View style={localStyles.medicineStatsContent}>
          <View style={localStyles.medicineStatsRow}>
            <View style={localStyles.medicineStatItem}>
              <Text
                style={[
                  localStyles.medicineStatValue,
                  { color: styles.colors.success },
                ]}
              >
                {stats.taken}
              </Text>
              <Text
                style={[
                  localStyles.medicineStatLabel,
                  { color: styles.colors.textSecondary },
                ]}
              >
                Alınan
              </Text>
            </View>

            <View style={localStyles.medicineStatItem}>
              <Text
                style={[
                  localStyles.medicineStatValue,
                  { color: styles.colors.warning },
                ]}
              >
                {stats.skipped}
              </Text>
              <Text
                style={[
                  localStyles.medicineStatLabel,
                  { color: styles.colors.textSecondary },
                ]}
              >
                Atlanan
              </Text>
            </View>

            <View style={localStyles.medicineStatItem}>
              <Text
                style={[
                  localStyles.medicineStatValue,
                  { color: styles.colors.danger },
                ]}
              >
                {stats.missed}
              </Text>
              <Text
                style={[
                  localStyles.medicineStatLabel,
                  { color: styles.colors.textSecondary },
                ]}
              >
                Kaçırılan
              </Text>
            </View>
          </View>

          <View style={localStyles.medicineSuccessRate}>
            <Text
              style={[
                localStyles.medicineSuccessRateLabel,
                { color: styles.colors.textSecondary },
              ]}
            >
              Başarı Oranı
            </Text>
            <Text
              style={[
                localStyles.medicineSuccessRateValue,
                { color: styles.colors.success },
              ]}
            >
              %{stats.successRate}
            </Text>
          </View>

          <View style={localStyles.last7DaysContainer}>
            <Text
              style={[
                localStyles.last7DaysTitle,
                { color: styles.colors.textSecondary },
              ]}
            >
              Son 7 Gün
            </Text>
            <View style={localStyles.last7DaysGrid}>
              {stats.last7Days.map((day, index) => (
                <View key={index} style={localStyles.last7DaysItem}>
                  <Text
                    style={[
                      localStyles.last7DaysDate,
                      { color: styles.colors.textSecondary },
                    ]}
                  >
                    {new Date(day.date).toLocaleDateString("tr-TR", {
                      weekday: "short",
                    })}
                  </Text>
                  <Text
                    style={[
                      localStyles.last7DaysValue,
                      {
                        color:
                          day.total > 0
                            ? styles.colors.success
                            : styles.colors.textSecondary,
                      },
                    ]}
                  >
                    {day.total > 0 ? `${day.taken}/${day.total}` : "-"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

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

      <CalendarFilterBar
        onSearch={setSearchQuery}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[styles.colors.primary]}
            tintColor={styles.colors.primary}
          />
        }
      >
        <View style={localStyles.calendarWrapper}>
          <CalendarComponent
            reminders={getUniqueMedicineReminders(filteredReminders).map(
              (r) => {
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
              }
            )}
          />
        </View>

        <View style={localStyles.statsWrapper}>
          <MedicineStatsCard data={chartData} />
        </View>

        <MedicationHistoryCard reminders={reminders} />

        {getUniqueMedicineReminders(filteredReminders).map(
          (reminder, index) => (
            <View key={index}>
              <MedicineDateRangeCard
                medicine={reminder.medicine}
                reminders={reminders}
              />
              <CalendarMedicationCard medicine={reminder.medicine} />
              <MedicineStatsDetailCard
                medicine={reminder.medicine}
                reminders={reminders}
              />
            </View>
          )
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
  scrollContent: {
    paddingBottom: 50, // Alt kısımda daha fazla boşluk
  },
  historyCard: {
    backgroundColor: styles.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    width: "92%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    backgroundColor: styles.colors.background,
    padding: 12,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  successRateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: styles.colors.background,
    padding: 12,
    borderRadius: 12,
  },
  successRateLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  successRateValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  medicineStatsCard: {
    backgroundColor: styles.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    width: "92%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medicineStatsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  medicineStatsContent: {
    gap: 16,
  },
  medicineStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  medicineStatItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: styles.colors.background,
    padding: 12,
    borderRadius: 12,
  },
  medicineStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  medicineStatLabel: {
    fontSize: 12,
  },
  medicineSuccessRate: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: styles.colors.background,
    padding: 12,
    borderRadius: 12,
  },
  medicineSuccessRateLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  medicineSuccessRateValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  last7DaysContainer: {
    backgroundColor: styles.colors.background,
    padding: 12,
    borderRadius: 12,
  },
  last7DaysTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  last7DaysGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  last7DaysItem: {
    alignItems: "center",
    gap: 4,
  },
  last7DaysDate: {
    fontSize: 12,
  },
  last7DaysValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  calendarWrapper: {
    width: "92%",
    alignSelf: "center",
    marginBottom: 16,
  },
  statsWrapper: {
    width: "92%",
    alignSelf: "center",
    marginBottom: 16,
  },
});
