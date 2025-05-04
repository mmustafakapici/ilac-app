import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Medicine } from "@/models/medicine";
import { Reminder, ReminderStatus } from "@/models/reminder";
import { REMINDER_STATUS_COLORS } from "@/constants/reminder";
import { Check, X } from "lucide-react-native";
import { styles } from "@/constants/theme";

interface DailyMedicationCardProps {
  reminder: Reminder;
  onStatusChange?: (reminder: Reminder, newStatus: boolean) => void;
}

export default function DailyMedicationCard({
  reminder,
  onStatusChange,
}: DailyMedicationCardProps) {
  // Return null if reminder or medicine is completely missing
  if (!reminder || !reminder.medicine) {
    return null;
  }

  const status = reminder.isTaken
    ? ReminderStatus.TAKEN
    : ReminderStatus.PENDING;
  const statusColor = REMINDER_STATUS_COLORS[status];

  const handleStatusToggle = () => {
    if (onStatusChange) {
      onStatusChange(reminder, !reminder.isTaken);
    }
  };

  return (
    <View
      style={[
        localStyles.scheduleItem,
        {
          borderRadius: styles.borderRadius.md,
          marginBottom: styles.spacing.md,
          borderLeftWidth: 4,
          borderLeftColor: statusColor,
          backgroundColor: styles.colors.card,
        },
      ]}
    >
      <View style={localStyles.timeContainer}>
        <Text style={[styles.typography.h2, { color: styles.colors.text }]}>
          {reminder.displayTime || reminder.scheduledTime}
        </Text>
      </View>

      <View style={localStyles.medicationDetails}>
        <Text
          style={[
            styles.typography.body,
            { color: styles.colors.text, fontWeight: "500" },
          ]}
        >
          {reminder.medicine.name}
        </Text>
        {reminder.medicine.dosage && (
          <Text style={[styles.typography.body, { color: styles.colors.text }]}>
            {`${reminder.medicine.dosage.amount}${reminder.medicine.dosage.unit}`}
          </Text>
        )}
        <Text
          style={[
            styles.typography.body,
            { marginTop: styles.spacing.xs, color: statusColor },
          ]}
        >
          {reminder.isTaken ? "Alındı" : "Alınmadı"}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleStatusToggle}
        style={[
          localStyles.statusButton,
          {
            backgroundColor: reminder.isTaken
              ? styles.colors.success
              : styles.colors.card,
            borderColor: reminder.isTaken
              ? styles.colors.success
              : styles.colors.border,
          },
        ]}
      >
        {reminder.isTaken ? (
          <Check size={20} color="white" />
        ) : (
          <X size={20} color={styles.colors.text} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const localStyles = StyleSheet.create({
  scheduleItem: {
    flexDirection: "row",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeContainer: {
    marginRight: 16,
    justifyContent: "center",
  },
  medicationDetails: {
    flex: 1,
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
