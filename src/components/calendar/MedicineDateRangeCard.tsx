import { StyleSheet, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/theme";
import { Medicine } from "@/models/medicine";
import { Reminder } from "@/models/reminder";

interface MedicineDateRangeCardProps {
  medicine: Medicine;
  reminders: Reminder[];
}

export default function MedicineDateRangeCard({
  medicine,
  reminders,
}: MedicineDateRangeCardProps) {
  if (!medicine.schedule?.startDate && !medicine.schedule?.endDate) {
    return null;
  }

  // Bu ilaca ait hatırlatıcıları filtrele
  const medicineReminders = reminders.filter(
    (r) => r.medicineId === medicine.id
  );

  // İlaç alım istatistiklerini hesapla
  const totalReminders = medicineReminders.length;
  const takenReminders = medicineReminders.filter((r) => r.isTaken).length;
  const successRate =
    totalReminders > 0
      ? Math.round((takenReminders / totalReminders) * 100)
      : 0;

  return (
    <View
      style={[
        localStyles.container,
        {
          backgroundColor: styles.colors.card,
          borderRadius: styles.borderRadius.md,
        },
      ]}
    >
      <View style={localStyles.header}>
        <MaterialIcons name="event" size={20} color={styles.colors.primary} />
        <Text style={[styles.typography.h3, { color: styles.colors.text }]}>
          İlaç Takvimi
        </Text>
      </View>

      <View style={localStyles.dateContainer}>
        {medicine.schedule?.startDate && (
          <View style={localStyles.dateItem}>
            <Text
              style={[
                styles.typography.body,
                { color: styles.colors.textSecondary },
              ]}
            >
              Başlangıç
            </Text>
            <Text
              style={[styles.typography.body, { color: styles.colors.text }]}
            >
              {new Date(medicine.schedule.startDate).toLocaleDateString(
                "tr-TR"
              )}
            </Text>
          </View>
        )}

        {medicine.schedule?.endDate && (
          <View style={localStyles.dateItem}>
            <Text
              style={[
                styles.typography.body,
                { color: styles.colors.textSecondary },
              ]}
            >
              Bitiş
            </Text>
            <Text
              style={[styles.typography.body, { color: styles.colors.text }]}
            >
              {new Date(medicine.schedule.endDate).toLocaleDateString("tr-TR")}
            </Text>
          </View>
        )}
      </View>

      <View style={localStyles.statsContainer}>
        <View style={localStyles.statItem}>
          <Text
            style={[
              styles.typography.body,
              { color: styles.colors.textSecondary },
            ]}
          >
            Toplam Hatırlatıcı
          </Text>
          <Text style={[styles.typography.body, { color: styles.colors.text }]}>
            {totalReminders}
          </Text>
        </View>
        <View style={localStyles.statItem}>
          <Text
            style={[
              styles.typography.body,
              { color: styles.colors.textSecondary },
            ]}
          >
            Alınan
          </Text>
          <Text style={[styles.typography.body, { color: styles.colors.text }]}>
            {takenReminders}
          </Text>
        </View>
        <View style={localStyles.statItem}>
          <Text
            style={[
              styles.typography.body,
              { color: styles.colors.textSecondary },
            ]}
          >
            Başarı Oranı
          </Text>
          <Text
            style={[
              styles.typography.body,
              {
                color:
                  successRate >= 80
                    ? styles.colors.success
                    : successRate >= 50
                    ? styles.colors.warning
                    : styles.colors.danger,
              },
            ]}
          >
            %{successRate}
          </Text>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateItem: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: styles.colors.border,
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
});
