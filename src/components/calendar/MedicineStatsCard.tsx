import { StyleSheet, View, Text, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/theme";
import { LineChart } from "react-native-chart-kit";

interface MedicineStatsCardProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

export default function MedicineStatsCard({ data }: MedicineStatsCardProps) {
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
        <MaterialIcons
          name="bar-chart"
          size={20}
          color={styles.colors.primary}
        />
        <Text style={[styles.typography.h3, { color: styles.colors.text }]}>
          İlaç Alım İstatistikleri
        </Text>
      </View>

      <LineChart
        data={data}
        width={Dimensions.get("window").width - 64}
        height={220}
        chartConfig={{
          backgroundColor: styles.colors.card,
          backgroundGradientFrom: styles.colors.card,
          backgroundGradientTo: styles.colors.card,
          decimalPlaces: 0,
          color: (opacity = 1) => styles.colors.primary,
          labelColor: (opacity = 1) => styles.colors.text,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: styles.colors.primary,
          },
        }}
        bezier
        style={localStyles.chart}
      />

      <View style={localStyles.legend}>
        <View style={localStyles.legendItem}>
          <View
            style={[
              localStyles.legendColor,
              { backgroundColor: styles.colors.primary },
            ]}
          />
          <Text style={[styles.typography.body, { color: styles.colors.text }]}>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
});
