import { StyleSheet, View, Text } from "react-native";
import { styles } from "@/constants/theme";

interface WeeklyStats {
  day: string;
  total: number;
  taken: number;
}

interface WeeklyStatsCardProps {
  stats: WeeklyStats[];
}

export default function WeeklyStatsCard({ stats }: WeeklyStatsCardProps) {
  const maxTotal = Math.max(...stats.map((stat) => stat.total));

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
        Haftalık İstatistikler
      </Text>

      <View style={localStyles.chartContainer}>
        {stats.map((stat, index) => {
          const height = (stat.taken / maxTotal) * 100;
          return (
            <View key={index} style={localStyles.barContainer}>
              <View style={localStyles.barWrapper}>
                <View
                  style={[
                    localStyles.bar,
                    {
                      height: `${height}%`,
                      backgroundColor: styles.colors.primary,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.typography.body,
                  { fontSize: 12, marginTop: 4, color: styles.colors.text },
                ]}
              >
                {stat.day}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={[localStyles.legend, { marginTop: styles.spacing.md }]}>
        <View style={localStyles.legendItem}>
          <View
            style={[
              localStyles.legendDot,
              { backgroundColor: styles.colors.primary },
            ]}
          />
          <Text
            style={[
              styles.typography.body,
              { fontSize: 12, color: styles.colors.text },
            ]}
          >
            Alınan İlaçlar
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
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    marginTop: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    width: 24,
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
});
