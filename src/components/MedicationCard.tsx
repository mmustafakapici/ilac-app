import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Medicine } from "@/models/medicine";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "@/constants/theme";

interface MedicationCardProps {
  medicine: Medicine;
  onPress: (medicine: Medicine) => void;
}

export default function MedicationCard({
  medicine,
  onPress,
}: MedicationCardProps) {
  // Add null check for medicine
  if (!medicine) {
    return (
      <View
        style={[
          localStyles.medicationItem,
          {
            backgroundColor: styles.colors.card,
            borderRadius: styles.borderRadius.md,
            marginBottom: styles.spacing.sm,
            padding: 16,
            alignItems: "center",
          },
        ]}
      >
        <Text style={[styles.typography.body, { color: styles.colors.danger }]}>
          İlaç bilgisi bulunamadı
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={() => onPress(medicine)}>
      <View
        style={[
          localStyles.medicationItem,
          {
            backgroundColor: styles.colors.card,
            borderRadius: styles.borderRadius.md,
            marginBottom: styles.spacing.sm,
          },
        ]}
      >
        {/* İlaç Başlık Bölümü */}
        <View style={localStyles.medicationHeader}>
          <View style={localStyles.medicationTitleContainer}>
            <MaterialCommunityIcons
              name="pill"
              size={20}
              color={styles.colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.typography.h2, { color: styles.colors.text }]}>
              {medicine.name}
            </Text>
          </View>
          {medicine.class && (
            <View style={localStyles.classContainer}>
              <Text
                style={[
                  styles.typography.caption,
                  { color: styles.colors.primary },
                ]}
              >
                {medicine.class}
              </Text>
            </View>
          )}
        </View>

        <View style={localStyles.detailRow}>
          <View style={[localStyles.detailItem, { flex: 0.4 }]}>
            <View style={localStyles.horizontalDetails}>
              <View style={localStyles.horizontalDetailItem}>
                <Text
                  style={[
                    styles.typography.body,
                    { color: styles.colors.text },
                  ]}
                >
                  Doz
                </Text>
                <Text
                  style={[
                    styles.typography.body,
                    { color: styles.colors.text, fontWeight: "500" },
                  ]}
                >
                  {`${medicine.dosage?.amount}${medicine.dosage?.unit}`}
                </Text>
              </View>

              <View style={localStyles.horizontalDetailItem}>
                <Text
                  style={[
                    styles.typography.body,
                    { color: styles.colors.text },
                  ]}
                >
                  Tür
                </Text>
                <Text
                  style={[
                    styles.typography.body,
                    { color: styles.colors.text, fontWeight: "500" },
                  ]}
                >
                  {medicine.type}
                </Text>
              </View>
            </View>
          </View>

          <View style={[localStyles.detailItem, { flex: 0.6 }]}>
            <View style={localStyles.usageContainer}>
              <View style={localStyles.conditionContainer}>
                <MaterialIcons
                  name="info"
                  size={16}
                  color={styles.colors.text}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.typography.body,
                    { fontSize: 13, color: styles.colors.text },
                  ]}
                >
                  {medicine.usage?.condition}
                </Text>
              </View>
              <View style={localStyles.timeChips}>
                {medicine.usage?.time.map((time, index) => (
                  <View
                    key={index}
                    style={[
                      localStyles.timeChip,
                      {
                        backgroundColor: styles.colors.background,
                        borderColor: styles.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typography.body,
                        { fontSize: 12, color: styles.colors.text },
                      ]}
                    >
                      {time}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {medicine.notes && (
          <View style={[localStyles.conditionContainer, { marginTop: 4 }]}>
            <Text
              style={[
                styles.typography.body,
                { fontSize: 13, color: styles.colors.text },
              ]}
            >
              {medicine.notes}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  medicationItem: {
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  medicationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  classContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  medicationDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  usageSection: {
    marginBottom: 8,
  },
  usageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  timeChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  timeChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  bottomSection: {
    marginTop: 2,
  },
  conditionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  verticalDetails: {
    flexDirection: "column",
  },
  verticalDetailItem: {
    marginBottom: 8,
  },
  horizontalDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  horizontalDetailItem: {
    flex: 1,
  },
  usageContainer: {
    flexDirection: "column",
  },
});
