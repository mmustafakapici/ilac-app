import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Medicine } from "@/models/medicine";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/theme";
import { memo, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const themeColors = styles.colors;

interface ReminderStatus {
  time: string;
  isTaken: boolean;
}

interface CalendarMedicationCardProps {
  medicine: Medicine;
  reminderStatuses?: ReminderStatus[];
  onPress?: () => void;
}

function CalendarMedicationCard({
  medicine,
  reminderStatuses = [],
  onPress,
}: CalendarMedicationCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (!medicine) {
    return (
      <View style={localStyles.medicationItem}>
        <Text style={localStyles.errorText}>İlaç bilgisi bulunamadı</Text>
      </View>
    );
  }

  const getStatusColor = (isTaken: boolean) => {
    return isTaken ? themeColors.success : themeColors.textSecondary;
  };

  const getStatusIcon = (isTaken: boolean) => {
    return isTaken ? "check-circle" : "schedule";
  };

  const renderTimeChip = (reminder: ReminderStatus, index: number) => {
    const statusColor = getStatusColor(reminder.isTaken);
    const statusIcon = getStatusIcon(reminder.isTaken);

    return (
      <View
        key={index}
        style={[localStyles.timeChip, { borderColor: statusColor }]}
      >
        <MaterialIcons name={statusIcon} size={16} color={statusColor} />
        <Text style={[localStyles.timeText, { color: statusColor }]}>
          {reminder.time}
        </Text>
      </View>
    );
  };

  const CardContent = () => (
    <LinearGradient
      colors={[themeColors.card, themeColors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={localStyles.gradientContainer}
    >
      <View style={localStyles.contentContainer}>
        <View style={localStyles.headerContainer}>
          <View style={localStyles.titleContainer}>
            <View style={localStyles.medicineIconContainer}>
              <MaterialIcons
                name="medication"
                size={24}
                color={themeColors.primary}
              />
            </View>
            <View style={localStyles.titleTextContainer}>
              <Text
                style={[localStyles.medicineName, { color: themeColors.text }]}
              >
                {medicine.name}
              </Text>
              {medicine.dosage && (
                <Text
                  style={[
                    localStyles.dosageText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {`${medicine.dosage.amount}${medicine.dosage.unit}`}
                </Text>
              )}
            </View>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={themeColors.textSecondary}
          />
        </View>

        {((medicine as any).startDate || (medicine as any).endDate) && (
          <View style={localStyles.dateContainer}>
            {(medicine as any).startDate && (
              <View style={localStyles.dateItem}>
                <MaterialIcons
                  name="event"
                  size={16}
                  color={themeColors.primary}
                />
                <Text
                  style={[localStyles.dateText, { color: themeColors.text }]}
                >
                  {new Date((medicine as any).startDate).toLocaleDateString(
                    "tr-TR"
                  )}
                </Text>
              </View>
            )}
            {(medicine as any).endDate && (
              <View style={localStyles.dateItem}>
                <MaterialIcons
                  name="event-busy"
                  size={16}
                  color={themeColors.primary}
                />
                <Text
                  style={[localStyles.dateText, { color: themeColors.text }]}
                >
                  {new Date((medicine as any).endDate).toLocaleDateString(
                    "tr-TR"
                  )}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={localStyles.timeContainer}>
          {(reminderStatuses.length > 0
            ? reminderStatuses
            : medicine.usage && Array.isArray(medicine.usage.time)
            ? medicine.usage.time.map((t) => ({ time: t, isTaken: false }))
            : []
          ).map(renderTimeChip)}
        </View>

        {medicine.usage?.condition && (
          <View style={localStyles.usageContainer}>
            <MaterialIcons name="info" size={16} color={themeColors.primary} />
            <Text style={[localStyles.usageText, { color: themeColors.text }]}>
              {medicine.usage.condition}
            </Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={localStyles.medicationItem}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <CardContent />
      </TouchableOpacity>
    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  medicationItem: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientContainer: {
    borderRadius: 16,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  medicineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themeColors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  titleTextContainer: {
    flex: 1,
  },
  medicineName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  dosageText: {
    fontSize: 15,
  },
  dateContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
    backgroundColor: themeColors.background,
    padding: 12,
    borderRadius: 12,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  usageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: themeColors.background,
    padding: 12,
    borderRadius: 12,
  },
  usageText: {
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
  errorText: {
    color: themeColors.danger,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default memo(CalendarMedicationCard);
