import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Medicine } from "@/models/medicine";
import {
  MEDICINE_TYPES,
  FREQUENCY_OPTIONS,
  TIME_PRESETS,
  UNIT_OPTIONS,
  CONDITION_OPTIONS,
} from "@/constants/medicine";
import MedicationCard from "@/components/MedicationCard";
import {
  getAllMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from "@/services/dataService";
import MedicineFormModal from "@/components/modals/MedicineFormModal";
import DeleteMedicineModal from "@/components/modals/DeleteMedicineModal";
import { styles } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicationsScreen() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [selectedFrequency, setSelectedFrequency] = useState(
    FREQUENCY_OPTIONS[0]
  );
  const [selectedSubOption, setSelectedSubOption] = useState(
    FREQUENCY_OPTIONS[0].subOptions[0]
  );
  const isFocused = useIsFocused();

  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: "",
    type: "Tablet",
    dosage: { amount: 0, unit: "mg" },
    usage: {
      frequency: "Günde 1 kez",
      time: ["08:00"],
      condition: "Fark etmez",
    },
    schedule: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: null,
      reminders: ["08:00"],
    },
    notes: "",
  });

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const data = await getAllMedicines();
      setMedicines(data);
    } catch (error) {
      console.error("Error loading medicines:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMedicines();
  }, []);

  useEffect(() => {
    if (isFocused) {
      console.log("🎯 İlaçlar ekranı odağa alındı");
      loadMedicines();
    }
  }, [isFocused]);

  const handleMedicinePress = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setFormData(medicine);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleAddPress = () => {
    setIsEditMode(false);
    setSelectedMedicine(null);
    setFormData({
      name: "",
      type: "Tablet",
      dosage: { amount: 0, unit: "mg" },
      usage: {
        frequency: "Günde 1 kez",
        time: ["08:00"],
        condition: "Fark etmez",
      },
      schedule: {
        startDate: new Date().toISOString().split("T")[0],
        endDate: null,
        reminders: ["08:00"],
      },
      notes: "",
    });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (isEditMode && selectedMedicine) {
        await updateMedicine({
          ...formData,
          id: selectedMedicine.id,
        } as Medicine);
      } else {
        await addMedicine({
          ...formData,
          id: Date.now().toString(),
        } as Medicine);
      }
      await loadMedicines();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving medicine:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedMedicine) {
      try {
        await deleteMedicine(selectedMedicine.id);
        await loadMedicines();
        setIsDeleteModalVisible(false);
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error deleting medicine:", error);
      }
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[localStyles.container, localStyles.centerContent]}>
        <ActivityIndicator size="large" color={styles.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        localStyles.container,
        { backgroundColor: styles.colors.background },
      ]}
    >
      <View style={localStyles.header}>
        <Text style={[styles.typography.h1, { color: styles.colors.text }]}>
          İlaçlarım
        </Text>
        <TouchableOpacity
          onPress={handleAddPress}
          style={[
            localStyles.addButton,
            { backgroundColor: styles.colors.primary },
          ]}
        >
          <MaterialIcons name="add" color="white" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={medicines}
        renderItem={({ item }) => (
          <MedicationCard medicine={item} onPress={handleMedicinePress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[styles.colors.primary]}
            tintColor={styles.colors.primary}
          />
        }
        ListEmptyComponent={
          <View
            style={[
              localStyles.emptyContainer,
              {
                backgroundColor: styles.colors.card,
                borderRadius: styles.borderRadius.md,
              },
            ]}
          >
            <Text
              style={[
                styles.typography.body,
                { textAlign: "center", color: styles.colors.text },
              ]}
            >
              Henüz ilaç eklenmemiş.
            </Text>
          </View>
        }
      />

      <MedicineFormModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          loadMedicines();
        }}
        formData={formData}
        setFormData={setFormData}
        isEditMode={isEditMode}
        showTimePicker={showTimePicker}
        setShowTimePicker={setShowTimePicker}
        showStartDatePicker={showStartDatePicker}
        setShowStartDatePicker={setShowStartDatePicker}
        showEndDatePicker={showEndDatePicker}
        setShowEndDatePicker={setShowEndDatePicker}
        currentTimeIndex={currentTimeIndex}
        setCurrentTimeIndex={setCurrentTimeIndex}
        selectedFrequency={selectedFrequency}
        setSelectedFrequency={setSelectedFrequency}
        selectedSubOption={selectedSubOption}
        setSelectedSubOption={setSelectedSubOption}
      />

      <DeleteMedicineModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
