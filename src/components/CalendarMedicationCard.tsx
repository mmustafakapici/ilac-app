import { StyleSheet, View, Text } from "react-native";
import { Medicine } from "@/models/medicine";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/theme";
const themeColors = styles.colors;

interface ReminderStatus {
  time: string;
  isTaken: boolean;
}

interface CalendarMedicationCardProps {
  medicine: Medicine;
  reminderStatuses?: ReminderStatus[]; // Her saat için alınma durumu
}

export default function CalendarMedicationCard({
  medicine,
  reminderStatuses = [],
}: CalendarMedicationCardProps) {
  if (!medicine) {
    return (
      <View style={localStyles.medicationItem}>
        <Text style={localStyles.errorText}>İlaç bilgisi bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={localStyles.medicationItem}>
      <Text style={[localStyles.medicineName, { color: themeColors.text }]}>
        {medicine.name}
      </Text>
      <Text
        style={[localStyles.dosageText, { color: themeColors.textSecondary }]}
      >
        {medicine.dosage
          ? `${medicine.dosage.amount}${medicine.dosage.unit}`
          : ""}
      </Text>
      {((medicine as any).startDate || (medicine as any).endDate) && (
        <View style={localStyles.dateRow}>
          {(medicine as any).startDate && (
            <Text
              style={[
                localStyles.dateText,
                { color: themeColors.textSecondary },
              ]}
            >
              Başlangıç:{" "}
              {new Date((medicine as any).startDate).toLocaleDateString(
                "tr-TR"
              )}
            </Text>
          )}
          {(medicine as any).endDate && (
            <Text
              style={[
                localStyles.dateText,
                { color: themeColors.textSecondary },
              ]}
            >
              Bitiş:{" "}
              {new Date((medicine as any).endDate).toLocaleDateString("tr-TR")}
            </Text>
          )}
        </View>
      )}
      <View style={localStyles.timeContainer}>
        {(reminderStatuses.length > 0
          ? reminderStatuses
          : medicine.usage && Array.isArray(medicine.usage.time)
          ? medicine.usage.time.map((t) => ({ time: t, isTaken: false }))
          : []
        ).map((reminder, index) => (
          <View key={index} style={localStyles.timeChip}>
            <MaterialIcons
              name="schedule"
              size={16}
              color={themeColors.textSecondary}
            />
            <Text style={[localStyles.timeText, { color: themeColors.text }]}>
              {reminder.time}
            </Text>
            <View
              style={[
                localStyles.statusCircle,
                {
                  backgroundColor: reminder.isTaken
                    ? themeColors.success
                    : themeColors.background,
                  borderColor: reminder.isTaken
                    ? themeColors.success
                    : themeColors.border,
                },
              ]}
            />
          </View>
        ))}
      </View>
      <View
        style={[localStyles.divider, { backgroundColor: themeColors.border }]}
      />
      <Text
        style={[localStyles.usageText, { color: themeColors.textSecondary }]}
      >
        {medicine.usage?.condition}
      </Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  medicationItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medicineName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#222",
    marginBottom: 2,
  },
  dosageText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: "#666",
    marginRight: 16,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  timeText: {
    marginLeft: 4,
    marginRight: 4,
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  statusCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  usageText: {
    fontSize: 14,
    color: "#444",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 15,
    fontWeight: "500",
  },
});
