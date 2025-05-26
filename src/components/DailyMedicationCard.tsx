import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Medicine } from "@/models/medicine";
import { Reminder, ReminderStatus } from "@/models/reminder";
import { REMINDER_STATUS_COLORS } from "@/constants/reminder";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/theme";

interface DailyMedicationCardProps {
  reminder: Reminder;
  onStatusChange?: (reminder: Reminder, newStatus: boolean) => void;
  onSkip?: (reminder: Reminder) => void;
}

export default function DailyMedicationCard({
  reminder,
  onStatusChange,
  onSkip,
}: DailyMedicationCardProps) {
  if (!reminder || !reminder.medicine) {
    return null;
  }

  const status = reminder.isTaken
    ? ReminderStatus.TAKEN
    : reminder.status === ReminderStatus.SKIPPED
    ? ReminderStatus.SKIPPED
    : reminder.status === ReminderStatus.MISSED
    ? ReminderStatus.MISSED
    : ReminderStatus.PENDING;

  const statusColor =
    reminder.status === ReminderStatus.MISSED
      ? styles.colors.danger
      : REMINDER_STATUS_COLORS[status];

  const handleStatusToggle = () => {
    if (onStatusChange) {
      onStatusChange(reminder, !reminder.isTaken);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip(reminder);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case ReminderStatus.TAKEN:
        return "check-circle";
      case ReminderStatus.SKIPPED:
        return "skip-next";
      case ReminderStatus.MISSED:
        return "error";
      default:
        return "schedule";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ReminderStatus.TAKEN:
        return "Alındı";
      case ReminderStatus.SKIPPED:
        return "Atlandı";
      case ReminderStatus.MISSED:
        return "Kaçırıldı";
      default:
        return "Bekliyor";
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
        <MaterialIcons
          name="schedule"
          size={20}
          color={styles.colors.primary}
          style={localStyles.timeIcon}
        />
        <Text style={[styles.typography.h2, { color: styles.colors.text }]}>
          {reminder.displayTime || reminder.scheduledTime}
        </Text>
      </View>

      <View style={localStyles.medicationDetails}>
        <View style={localStyles.medicationHeader}>
          <Text
            style={[
              styles.typography.h3,
              { color: styles.colors.text, marginBottom: 4 },
            ]}
          >
            {reminder.medicine.name}
          </Text>
          <View style={localStyles.statusContainer}>
            <MaterialIcons
              name={getStatusIcon()}
              size={16}
              color={statusColor}
              style={localStyles.statusIcon}
            />
            <Text
              style={[
                styles.typography.body,
                { color: statusColor, fontSize: 12 },
              ]}
            >
              {getStatusText()}
            </Text>
          </View>
        </View>

        <View style={localStyles.detailsContainer}>
          {reminder.medicine.dosage && (
            <View style={localStyles.detailItem}>
              <MaterialIcons
                name="medication"
                size={16}
                color={styles.colors.textSecondary}
              />
              <Text
                style={[
                  styles.typography.body,
                  { color: styles.colors.text, marginLeft: 4 },
                ]}
              >
                {`${reminder.medicine.dosage.amount}${reminder.medicine.dosage.unit}`}
              </Text>
            </View>
          )}

          {reminder.medicine.usage?.condition && (
            <View style={localStyles.detailItem}>
              <MaterialIcons
                name="info"
                size={16}
                color={styles.colors.textSecondary}
              />
              <Text
                style={[
                  styles.typography.body,
                  { color: styles.colors.text, marginLeft: 4 },
                ]}
              >
                {reminder.medicine.usage.condition}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={localStyles.buttonContainer}>
        {!reminder.isTaken && reminder.status !== ReminderStatus.SKIPPED && (
          <TouchableOpacity
            onPress={handleSkip}
            style={[
              localStyles.actionButton,
              {
                backgroundColor: styles.colors.card,
                borderColor: styles.colors.border,
              },
            ]}
          >
            <MaterialIcons
              name="skip-next"
              size={20}
              color={styles.colors.text}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleStatusToggle}
          style={[
            localStyles.actionButton,
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
            <MaterialIcons name="check" size={20} color="white" />
          ) : (
            <MaterialIcons name="close" size={20} color={styles.colors.text} />
          )}
        </TouchableOpacity>
      </View>
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
    alignItems: "center",
  },
  timeIcon: {
    marginBottom: 4,
  },
  medicationDetails: {
    flex: 1,
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: styles.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: styles.borderRadius.sm,
  },
  statusIcon: {
    marginRight: 4,
  },
  detailsContainer: {
    gap: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
