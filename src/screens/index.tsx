import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import WelcomeCard from "@/components/home/WelcomeCard";
import UpcomingMedicationsCard from "@/components/home/UpcomingMedicationsCard";
import DailyProgressCard from "@/components/home/DailyProgressCard";
import WeeklyStatsCard from "@/components/home/WeeklyStatsCard";
import {
  getAllMedicines,
  getRemindersByDate,
  getUser,
} from "@/services/dataService";
import { Reminder } from "@/models/reminder";
import { User } from "@/models/user";
import { usePermission } from "@/context/PermissionContext";
import { styles } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const {
    notificationPermission,
    isLoading: permissionLoading,
    error: permissionError,
  } = usePermission();
  const [user, setUser] = useState<User | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    taken: 0,
    missed: 0,
    upcoming: 0,
  });

  const [weeklyStats, setWeeklyStats] = useState([
    { day: "Pzt", total: 0, taken: 0 },
    { day: "Sal", total: 0, taken: 0 },
    { day: "Çar", total: 0, taken: 0 },
    { day: "Per", total: 0, taken: 0 },
    { day: "Cum", total: 0, taken: 0 },
    { day: "Cmt", total: 0, taken: 0 },
    { day: "Paz", total: 0, taken: 0 },
  ]);

  const isFocused = useIsFocused();

  const fetchData = useCallback(async () => {
    console.log("🔄 Ana ekran verileri yükleniyor...");
    const startTime = performance.now();

    try {
      setLoading(true);
      setError(null);

      // Fetch user data
      console.log("👤 Kullanıcı bilgileri alınıyor...");
      const userData = await getUser();
      setUser(userData);

      // Get today's date
      const today = new Date().toISOString().split("T")[0];
      console.log(`📅 Bugünün tarihi: ${today}`);

      // Fetch today's reminders
      console.log("⏰ Günlük hatırlatıcılar alınıyor...");
      const todayReminders = await getRemindersByDate(today);
      setReminders(todayReminders);

      // Calculate daily stats
      const now = new Date().toLocaleTimeString().slice(0, 5);
      const dailyStats = {
        total: todayReminders.length,
        taken: todayReminders.filter((r) => r.isTaken).length,
        missed: todayReminders.filter(
          (r) => !r.isTaken && r.scheduledTime < now
        ).length,
        upcoming: todayReminders.filter(
          (r) => !r.isTaken && r.scheduledTime >= now
        ).length,
      };
      setStats(dailyStats);
      console.log("📊 Günlük istatistikler hesaplandı:", dailyStats);

      // Calculate weekly stats
      console.log("📈 Haftalık istatistikler hesaplanıyor...");
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

      const weekStats = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        const dayReminders = await getRemindersByDate(dateStr);
        weekStats.push({
          day: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][i],
          total: dayReminders.length,
          taken: dayReminders.filter((r) => r.isTaken).length,
        });
      }
      setWeeklyStats(weekStats);
      console.log("✅ Haftalık istatistikler hesaplandı");

      const endTime = performance.now();
      console.log(
        `⏱️ Veri yükleme süresi: ${(endTime - startTime).toFixed(2)}ms`
      );
    } catch (err) {
      console.error("❌ Veri yükleme hatası:", err);
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      console.log("🎯 Ana ekran odağa alındı");
      fetchData();
    }
  }, [isFocused, fetchData]);

  if (permissionLoading) {
    return (
      <View style={[localStyles.container, localStyles.centerContent]}>
        <Text style={{ color: styles.colors.text }}>
          İzinler kontrol ediliyor...
        </Text>
      </View>
    );
  }

  if (permissionError) {
    return (
      <View style={[localStyles.container, localStyles.centerContent]}>
        <Text style={{ color: styles.colors.danger }}>{permissionError}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[localStyles.container, localStyles.centerContent]}>
        <ActivityIndicator size="large" color={styles.colors.primary} />
        <Text
          style={{ marginTop: styles.spacing.md, color: styles.colors.text }}
        >
          Yükleniyor...
        </Text>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <WelcomeCard
          userName={user?.firstName || "Misafir"}
          date={new Date().toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        />

        <UpcomingMedicationsCard
          reminders={reminders
            .filter((r) => !r.isTaken)
            .map((r) => {
              let hourMinute = r.scheduledTime;
              // Eğer scheduledTime ISO formatındaysa, saat kısmını ayıkla
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
              // parseTime ile kontrol et, eğer saat:dakika ise HH:mm formatında göster
              try {
                const { hour, minute } =
                  require("@/utils/dateUtils").parseTime(hourMinute);
                hourMinute = `${hour.toString().padStart(2, "0")}:${minute
                  .toString()
                  .padStart(2, "0")}`;
              } catch {}
              return { ...r, scheduledTime: hourMinute };
            })}
        />

        <DailyProgressCard
          total={stats.total}
          taken={stats.taken}
          missed={stats.missed}
          upcoming={stats.upcoming}
        />

        <WeeklyStatsCard stats={weeklyStats} />
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
