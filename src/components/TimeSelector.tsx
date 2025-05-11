import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { DEFAULT_TIMES } from "@/constants/medicine";
import { styles } from "@/constants/theme";

interface TimeSelectorProps {
  times: string[];
  selectedFrequency: { id: string; label: string; subOptions?: string[] };
  onTimeSelect: (time: string, index: number) => void;
  onTimeAdd: () => void;
  onTimeRemove: (index: number) => void;
  onDefaultTimeSelect: (timeOfDay: "morning" | "noon" | "evening") => void;
  onShowTimePicker: (index: number) => void;
}

export default function TimeSelector({
  times,
  selectedFrequency,
  onTimeSelect,
  onTimeAdd,
  onTimeRemove,
  onDefaultTimeSelect,
  onShowTimePicker,
}: TimeSelectorProps) {
  return (
    <View>
      <View style={localStyles.defaultTimesContainer}>
        <TouchableOpacity
          onPress={() => onDefaultTimeSelect("morning")}
          style={[
            localStyles.defaultTimeButton,
            {
              backgroundColor: times.includes(DEFAULT_TIMES.morning)
                ? styles.colors.primary
                : styles.colors.card,
              borderColor: styles.colors.border,
            },
          ]}
        >
          <Feather
            name="sun"
            size={16}
            color={
              times.includes(DEFAULT_TIMES.morning)
                ? "white"
                : styles.colors.text
            }
          />
          <Text
            style={[
              styles.typography.body,
              {
                marginLeft: 8,
                color: times.includes(DEFAULT_TIMES.morning)
                  ? "white"
                  : styles.colors.text,
              },
            ]}
          >
            Sabah ({DEFAULT_TIMES.morning})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDefaultTimeSelect("noon")}
          style={[
            localStyles.defaultTimeButton,
            {
              backgroundColor: times.includes(DEFAULT_TIMES.noon)
                ? styles.colors.primary
                : styles.colors.card,
              borderColor: styles.colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="coffee"
            size={16}
            color={
              times.includes(DEFAULT_TIMES.noon) ? "white" : styles.colors.text
            }
          />
          <Text
            style={[
              styles.typography.body,
              {
                marginLeft: 8,
                color: times.includes(DEFAULT_TIMES.noon)
                  ? "white"
                  : styles.colors.text,
              },
            ]}
          >
            Öğle ({DEFAULT_TIMES.noon})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDefaultTimeSelect("evening")}
          style={[
            localStyles.defaultTimeButton,
            {
              backgroundColor: times.includes(DEFAULT_TIMES.evening)
                ? styles.colors.primary
                : styles.colors.card,
              borderColor: styles.colors.border,
            },
          ]}
        >
          <Feather
            name="moon"
            size={16}
            color={
              times.includes(DEFAULT_TIMES.evening)
                ? "white"
                : styles.colors.text
            }
          />
          <Text
            style={[
              styles.typography.body,
              {
                marginLeft: 8,
                color: times.includes(DEFAULT_TIMES.evening)
                  ? "white"
                  : styles.colors.text,
              },
            ]}
          >
            Akşam ({DEFAULT_TIMES.evening})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={localStyles.timeContainer}>
        {times.map((time, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => onShowTimePicker(index)}
              style={[
                localStyles.timeButton,
                {
                  backgroundColor: Object.values(DEFAULT_TIMES).includes(time)
                    ? styles.colors.primary
                    : styles.colors.card,
                  borderColor: styles.colors.border,
                },
              ]}
            >
              <MaterialIcons
                name="schedule"
                size={16}
                color={
                  Object.values(DEFAULT_TIMES).includes(time)
                    ? "white"
                    : styles.colors.text
                }
              />
              <Text
                style={[
                  styles.typography.body,
                  {
                    marginLeft: 8,
                    marginRight: 8,
                    color: Object.values(DEFAULT_TIMES).includes(time)
                      ? "white"
                      : styles.colors.text,
                  },
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>

            {selectedFrequency.id !== "asNeeded" && (
              <TouchableOpacity
                onPress={() => onTimeRemove(index)}
                style={{ padding: 4 }}
              >
                <MaterialIcons
                  name="delete"
                  size={16}
                  color={styles.colors.danger}
                />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {selectedFrequency.id !== "asNeeded" && (
          <TouchableOpacity
            onPress={onTimeAdd}
            style={[
              localStyles.addTimeButton,
              {
                borderColor: styles.colors.primary,
                borderStyle: "dashed",
              },
            ]}
          >
            <MaterialIcons name="add" size={16} color={styles.colors.primary} />
            <Text
              style={[
                styles.typography.body,
                { color: styles.colors.primary, marginLeft: 4 },
              ]}
            >
              Özel Saat Ekle
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  defaultTimesContainer: {
    marginBottom: 16,
  },
  defaultTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  addTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
});
