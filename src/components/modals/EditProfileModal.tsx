import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";
import { X } from "lucide-react-native";
import { User } from "@/models/user";
import { styles } from "@/constants/theme";
import { useCallback, useMemo, useState } from "react";
import { updateUser } from "@/services/dataService";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
}

export default function EditProfileModal({
  visible,
  onClose,
  user,
}: EditProfileModalProps) {
  if (!user) return null;

  // Form state'ini local olarak tutuyoruz
  const [formData, setFormData] = useState<User>(user);

  // Modal ilk açıldığında log
  useMemo(() => {
    if (visible) {
      console.log("=== KİŞİSEL BİLGİLER DÜZENLEME MODALI AÇILDI ===");
      console.log("Başlangıç Kullanıcı Bilgileri:", user);
      setFormData(user); // Modal açıldığında form verilerini güncelle
    }
  }, [visible, user]);

  const handleFieldChange = useCallback(
    (field: keyof User, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    try {
      console.log("=== KAYDET BUTONUNA TIKLANDI ===");
      console.log("Güncellenecek Kullanıcı Bilgileri:", formData);

      // Tüm değişiklikleri tek seferde kaydet
      await updateUser(formData);
      onClose();
    } catch (error) {
      console.error("Kaydetme hatası:", error);
    }
  }, [formData, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={[
          localStyles.modalContainer,
          { backgroundColor: styles.colors.background },
        ]}
      >
        <View
          style={[
            localStyles.modalHeader,
            { borderBottomColor: styles.colors.border },
          ]}
        >
          <Text style={[styles.typography.h1, { color: styles.colors.text }]}>
            Kişisel Bilgiler
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X color={styles.colors.text} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={localStyles.modalContent}>
          <View style={localStyles.inputGroup}>
            <Text
              style={[styles.typography.body, { color: styles.colors.text }]}
            >
              Ad
            </Text>
            <TextInput
              value={formData.firstName}
              onChangeText={(text) => handleFieldChange("firstName", text)}
              style={[
                localStyles.input,
                {
                  backgroundColor: styles.colors.background,
                  color: styles.colors.text,
                  borderColor: styles.colors.border,
                },
              ]}
              maxLength={50}
            />
          </View>

          <View style={localStyles.inputGroup}>
            <Text
              style={[styles.typography.body, { color: styles.colors.text }]}
            >
              Soyad
            </Text>
            <TextInput
              value={formData.lastName}
              onChangeText={(text) => handleFieldChange("lastName", text)}
              style={[
                localStyles.input,
                {
                  backgroundColor: styles.colors.background,
                  color: styles.colors.text,
                  borderColor: styles.colors.border,
                },
              ]}
              maxLength={50}
            />
          </View>

          <View style={localStyles.inputGroup}>
            <Text
              style={[styles.typography.body, { color: styles.colors.text }]}
            >
              Yaş
            </Text>
            <TextInput
              value={formData.age.toString()}
              onChangeText={(text) => {
                const age = parseInt(text) || 0;
                handleFieldChange("age", age);
              }}
              style={[
                localStyles.input,
                {
                  backgroundColor: styles.colors.background,
                  color: styles.colors.text,
                  borderColor: styles.colors.border,
                },
              ]}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <View style={localStyles.inputGroup}>
            <Text
              style={[styles.typography.body, { color: styles.colors.text }]}
            >
              E-posta
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) => handleFieldChange("email", text)}
              style={[
                localStyles.input,
                {
                  backgroundColor: styles.colors.background,
                  color: styles.colors.text,
                  borderColor: styles.colors.border,
                },
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={100}
            />
          </View>

          <View style={localStyles.inputGroup}>
            <Text
              style={[styles.typography.body, { color: styles.colors.text }]}
            >
              Telefon
            </Text>
            <TextInput
              value={formData.phone}
              onChangeText={(text) => handleFieldChange("phone", text)}
              style={[
                localStyles.input,
                {
                  backgroundColor: styles.colors.background,
                  color: styles.colors.text,
                  borderColor: styles.colors.border,
                },
              ]}
              keyboardType="phone-pad"
              maxLength={20}
            />
          </View>

          <TouchableOpacity
            style={[
              localStyles.saveButton,
              { backgroundColor: styles.colors.primary },
            ]}
            onPress={handleSave}
          >
            <Text style={[styles.typography.body, { color: "white" }]}>
              Kaydet
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  saveButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
});
