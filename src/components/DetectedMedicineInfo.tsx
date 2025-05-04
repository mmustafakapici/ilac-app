import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Medicine } from "@/models/medicine";
import { styles as appStyles } from "@/constants/theme";

interface Props {
  medicine: Partial<Medicine>;
  onUse: () => void;
}

const DetectedMedicineInfo: React.FC<Props> = ({ medicine, onUse }) => {
  if (!medicine || !medicine.name) return null;

  return (
    <View style={local.card}>
      <Text style={local.title}>Tespit Edilen Bilgiler</Text>
      <Text style={local.label}>
        İsim: <Text style={local.value}>{medicine.name}</Text>
      </Text>
      <Text style={local.label}>
        Tür: <Text style={local.value}>{medicine.type}</Text>
      </Text>
      <Text style={local.label}>
        Doz:{" "}
        <Text style={local.value}>
          {medicine.dosage?.amount} {medicine.dosage?.unit}
        </Text>
      </Text>
      <Text style={local.label}>
        Sıklık: <Text style={local.value}>{medicine.usage?.frequency}</Text>
      </Text>
      <Text style={local.label}>
        Zaman:{" "}
        <Text style={local.value}>{medicine.usage?.time?.join(", ")}</Text>
      </Text>
      <Text style={local.label}>
        Kullanım Şekli:{" "}
        <Text style={local.value}>{medicine.usage?.condition}</Text>
      </Text>
      <Text style={local.label}>
        Başlangıç:{" "}
        <Text style={local.value}>{medicine.schedule?.startDate}</Text>
      </Text>
      <Text style={local.label}>
        Bitiş: <Text style={local.value}>{medicine.schedule?.endDate}</Text>
      </Text>
      <Text style={local.label}>
        Not: <Text style={local.value}>{medicine.notes}</Text>
      </Text>
      <TouchableOpacity style={local.button} onPress={onUse}>
        <Text style={local.buttonText}>Bilgileri Kullan</Text>
      </TouchableOpacity>
    </View>
  );
};

const local = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    ...(appStyles.typography?.h2 || {}),
    marginBottom: 8,
    color: appStyles.colors.primary,
  },
  label: {
    ...(appStyles.typography?.body || {}),
    color: appStyles.colors.text,
    marginBottom: 2,
  },
  value: {
    fontWeight: "bold",
    color: appStyles.colors.text,
  },
  button: {
    marginTop: 12,
    backgroundColor: appStyles.colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    ...(appStyles.typography?.body || {}),
    fontWeight: "bold",
  },
});

export default DetectedMedicineInfo;
