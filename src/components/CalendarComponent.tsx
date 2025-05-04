import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { Reminder } from "@/models/reminder";
import { styles } from "@/constants/theme";
const themeColors = styles.colors;
import { parseISODate, isSameDay } from "@/utils/dateUtils";

interface CalendarComponentProps {
  reminders: Reminder[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ reminders }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    reminders.forEach((reminder) => {
      const date = reminder.date;
      if (!marked[date]) {
        marked[date] = {
          dots: [],
          marked: true,
        };
      }

      if (reminder.isTaken) {
        marked[date].dots.push({
          key: "taken",
          color: themeColors.success,
        });
      } else {
        marked[date].dots.push({
          key: "pending",
          color: themeColors.primary,
        });
      }
    });

    // Seçili tarihi işaretle
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: themeColors.primary,
      };
    }

    return marked;
  };

  const getDateReminders = (date: string) => {
    return reminders.filter((reminder) => reminder.date === date);
  };

  const selectedDateReminders = getDateReminders(selectedDate);

  return (
    <View style={localStyles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={getMarkedDates()}
        markingType="multi-dot"
        theme={{
          calendarBackground: themeColors.background,
          textSectionTitleColor: themeColors.text,
          selectedDayBackgroundColor: themeColors.primary,
          selectedDayTextColor: themeColors.white,
          todayTextColor: themeColors.primary,
          dayTextColor: themeColors.text,
          textDisabledColor: themeColors.textSecondary,
          dotColor: themeColors.primary,
          selectedDotColor: themeColors.white,
          arrowColor: themeColors.primary,
          monthTextColor: themeColors.text,
          indicatorColor: themeColors.primary,
        }}
      />

      <View style={localStyles.remindersContainer}>
        <Text style={[styles.typography.h2, { color: themeColors.text }]}>
          {new Date(selectedDate).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </Text>

        {selectedDateReminders.length === 0 ? (
          <Text style={[styles.typography.body, { color: themeColors.text }]}>
            Bu tarih için planlanmış ilaç bulunmamaktadır.
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  remindersContainer: {
    marginTop: 24,
    padding: 16,
  },
  reminderCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default CalendarComponent;
