import { StyleSheet, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/theme";

interface DailyProgressCardProps {
  total: number;
  taken: number;
  missed: number;
  upcoming: number;
}

export default function DailyProgressCard({
  total,
  taken,
  missed,
  upcoming,
}: DailyProgressCardProps) {
  const progressPercentage = (taken / total) * 100;

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
        Bugünkü İlerleyiş
      </Text>

      <View
        style={[
          localStyles.progressBar,
          { backgroundColor: styles.colors.background },
        ]}
      >
        <View
          style={[
            localStyles.progressFill,
            {
              backgroundColor: styles.colors.primary,
              width: `${progressPercentage}%`,
            },
          ]}
        />
      </View>

      <View style={localStyles.statsContainer}>
        <View style={localStyles.statItem}>
          <View style={localStyles.statHeader}>
            <MaterialIcons
              name="check-circle"
              size={16}
              color={styles.colors.success}
            />
            <Text
              style={[
                styles.typography.body,
                { marginLeft: 6, color: styles.colors.text },
              ]}
            >
              Alınan
            </Text>
          </View>
          <Text
            style={[
              styles.typography.body,
              { marginTop: 4, color: styles.colors.text },
            ]}
          >
            {taken}
          </Text>
        </View>

        <View style={localStyles.statItem}>
          <View style={localStyles.statHeader}>
            <MaterialIcons
              name="cancel"
              size={16}
              color={styles.colors.danger}
            />
            <Text
              style={[
                styles.typography.body,
                { marginLeft: 6, color: styles.colors.text },
              ]}
            >
              Kaçırılan
            </Text>
          </View>
          <Text
            style={[
              styles.typography.body,
              { marginTop: 4, color: styles.colors.text },
            ]}
          >
            {missed}
          </Text>
        </View>

        <View style={localStyles.statItem}>
          <View style={localStyles.statHeader}>
            <MaterialIcons
              name="schedule"
              size={16}
              color={styles.colors.warning}
            />
            <Text
              style={[
                styles.typography.body,
                { marginLeft: 6, color: styles.colors.text },
              ]}
            >
              Bekleyen
            </Text>
          </View>
          <Text
            style={[
              styles.typography.body,
              { marginTop: 4, color: styles.colors.text },
            ]}
          >
            {upcoming}
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
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
});
