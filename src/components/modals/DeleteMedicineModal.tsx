import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Trash2 } from "lucide-react-native";
import { styles } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

interface DeleteMedicineModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  medicineName: string;
}

export default function DeleteMedicineModal({
  visible,
  onClose,
  onDelete,
  medicineName,
}: DeleteMedicineModalProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <SafeAreaView style={{ flex: 1 }}>
        <View style={localStyles.modalContainer}>
          <View
            style={[
              localStyles.modalContent,
              { backgroundColor: styles.colors.card },
            ]}
          >
            <View style={localStyles.iconContainer}>
              <Trash2 size={32} color={styles.colors.danger} />
            </View>

            <Text
              style={[
                styles.typography.h2,
                { color: styles.colors.text, textAlign: "center" },
              ]}
            >
              İlacı Sil
            </Text>

            <Text
              style={[
                styles.typography.body,
                {
                  marginBottom: 24,
                  textAlign: "center",
                  color: styles.colors.text,
                },
              ]}
            >
              {medicineName} ilacını silmek istediğinizden emin misiniz? Bu
              işlem geri alınamaz.
            </Text>

            <View style={localStyles.buttonContainer}>
              <TouchableOpacity
                onPress={onClose}
                style={[localStyles.button, localStyles.cancelButton]}
              >
                <Text
                  style={[
                    styles.typography.body,
                    { color: styles.colors.text },
                  ]}
                >
                  İptal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onDelete}
                style={[localStyles.button, localStyles.deleteButton]}
              >
                <Text style={[styles.typography.body, { color: "white" }]}>
                  Sil
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    width: "80%",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
  },
});
