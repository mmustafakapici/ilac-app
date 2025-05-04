import { StyleSheet, View, ScrollView, Text } from "react-native";
import { Clock } from "lucide-react-native";
import { Reminder } from "@/models/reminder";
import { styles } from "@/constants/theme";

interface UpcomingMedicationsCardProps {
  reminders: Reminder[];
}

export default function UpcomingMedicationsCard({
  reminders,
}: UpcomingMedicationsCardProps) {
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
      <Text style={[styles.typography.h2, { color: styles.colors.text }]}>
        Yaklaşan İlaçlar
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: styles.spacing.md }}
      >
        {reminders.map((reminder) => (
          <View
            key={reminder.id}
            style={[
              localStyles.reminderCard,
              {
                backgroundColor: styles.colors.background,
                marginRight: styles.spacing.md,
              },
            ]}
          >
            <View style={localStyles.timeContainer}>
              <Clock size={16} color={styles.colors.primary} />
              <Text
                style={[
                  styles.typography.body,
                  {
                    marginLeft: 6,
                    color: styles.colors.primary,
                  },
                ]}
              >
                {reminder.scheduledTime}
              </Text>
            </View>

            <Text
              style={[
                styles.typography.body,
                {
                  marginTop: 8,
                  color: styles.colors.text,
                },
              ]}
            >
              {reminder.medicine.name}
            </Text>

            <Text
              style={[
                styles.typography.body,
                {
                  marginTop: 4,
                  fontSize: 13,
                  color: styles.colors.text,
                },
              ]}
            >
              {`${reminder.medicine.dosage.amount}${reminder.medicine.dosage.unit}`}
            </Text>

            <Text
              style={[
                styles.typography.body,
                {
                  marginTop: 8,
                  fontSize: 12,
                  color: styles.colors.text,
                },
              ]}
            >
              {reminder.medicine.usage.condition}
            </Text>
          </View>
        ))}
      </ScrollView>
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
  reminderCard: {
    padding: 12,
    borderRadius: 12,
    width: 160,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
