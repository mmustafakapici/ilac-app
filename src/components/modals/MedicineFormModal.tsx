import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  Text,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Medicine } from "@/models/medicine";
import {
  MEDICINE_TYPES,
  FREQUENCY_OPTIONS,
  TIME_PRESETS,
  UNIT_OPTIONS,
  CONDITION_OPTIONS,
  MEDICINE_CLASS,
} from "@/constants/medicine";
import TimeSelector from "@/components/TimeSelector";
import { styles } from "@/constants/theme";
import { ImgToMedicineService } from "@/services/ImgToMedicineService";
import DetectedMedicineInfo from "@/components/DetectedMedicineInfo";
import {
  addMedicine,
  addReminder,
  deleteMedicine,
  updateMedicine,
  getAllReminders,
} from "@/services/dataService";
import { generateId } from "@/utils/idUtils";
import {
  getDateRange,
  combineDateAndTimeLocal,
  getDeviceTimezone,
  convertTimeToDeviceTimezone,
} from "@/utils/dateUtils";
import { scheduleRemindersFromDatabase } from "@/services/reminderService";
import * as Notifications from "expo-notifications";
import {
  getNotificationId,
  removeNotificationId,
} from "@/services/notificationStore";
import { SafeAreaView } from "react-native-safe-area-context";

interface MedicineFormModalProps {
  visible: boolean;
  onClose: () => void;
  formData: Partial<Medicine>;
  setFormData: (data: Partial<Medicine>) => void;
  isEditMode: boolean;
  showTimePicker: boolean;
  setShowTimePicker: (show: boolean) => void;
  showStartDatePicker: boolean;
  setShowStartDatePicker: (show: boolean) => void;
  showEndDatePicker: boolean;
  setShowEndDatePicker: (show: boolean) => void;
  currentTimeIndex: number;
  setCurrentTimeIndex: (index: number) => void;
  selectedFrequency: (typeof FREQUENCY_OPTIONS)[0];
  setSelectedFrequency: (frequency: (typeof FREQUENCY_OPTIONS)[0]) => void;
  selectedSubOption: string;
  setSelectedSubOption: (subOption: string) => void;
}

const FormField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <View style={[localStyles.formField, { marginBottom: styles.spacing.md }]}>
      <Text
        style={[
          styles.typography.body,
          { marginBottom: styles.spacing.xs, color: styles.colors.text },
        ]}
      >
        {label}
      </Text>
      {children}
    </View>
  );
};

const SelectButton = ({
  value,
  options,
  onSelect,
}: {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
    >
      <View style={localStyles.selectContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            style={[
              localStyles.selectButton,
              {
                backgroundColor:
                  value === option ? styles.colors.primary : styles.colors.card,
                borderColor: styles.colors.border,
                borderRadius: styles.borderRadius.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.typography.body,
                {
                  color: value === option ? "white" : styles.colors.text,
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default function MedicineFormModal({
  visible,
  onClose,
  formData,
  setFormData,
  isEditMode,
  showTimePicker,
  setShowTimePicker,
  showStartDatePicker,
  setShowStartDatePicker,
  showEndDatePicker,
  setShowEndDatePicker,
  currentTimeIndex,
  setCurrentTimeIndex,
  selectedFrequency,
  setSelectedFrequency,
  selectedSubOption,
  setSelectedSubOption,
}: MedicineFormModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedMedicine, setDetectedMedicine] =
    useState<Partial<Medicine> | null>(null);
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);
  const [pickerTarget, setPickerTarget] = useState<
    "start" | "end" | "time" | null
  >(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const pickImage = async (useCamera: boolean) => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Galeriye erişim izni gerekli!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Görüntü seçilirken hata:", error);
      alert("Görüntü seçilirken bir hata oluştu!");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Kamera erişim izni gerekli!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Fotoğraf çekilirken hata:", error);
      alert("Fotoğraf çekilirken bir hata oluştu!");
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      setIsProcessing(true);
      const medicine = await ImgToMedicineService.processImageToMedicine(
        imageUri
      );
      setDetectedMedicine(medicine);
    } catch (error) {
      console.error("Görüntü işlenirken hata:", error);
      alert("Görüntü işlenirken bir hata oluştu!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseDetected = () => {
    if (!detectedMedicine) return;
    setFormData({
      ...formData,
      name: detectedMedicine.name,
      type: detectedMedicine.type,
      class: detectedMedicine.class,
      dosage: detectedMedicine.dosage,
      usage: detectedMedicine.usage,
      schedule: detectedMedicine.schedule,
      notes: detectedMedicine.notes,
    });
    const frequency = FREQUENCY_OPTIONS.find(
      (f) => f.label === detectedMedicine.usage?.frequency
    );
    if (frequency) {
      setSelectedFrequency(frequency);
      if (frequency.subOptions) {
        setSelectedSubOption(frequency.subOptions[0]);
      }
    }
    setDetectedMedicine(null);
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }

    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: getDeviceTimezone(),
      });

      const newTimes = [...(formData.usage?.time || [])];
      newTimes[currentTimeIndex] = timeString;

      setFormData({
        ...formData,
        usage: {
          ...formData.usage!,
          time: newTimes,
        },
      });
    }
  };

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    isStartDate: boolean
  ) => {
    if (Platform.OS === "android") {
      setShowStartDatePicker(false);
      setShowEndDatePicker(false);
    }

    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Saat bilgisini sıfırla

      if (isStartDate) {
        const selectedDateWithoutTime = new Date(selectedDate);
        selectedDateWithoutTime.setHours(0, 0, 0, 0);

        if (selectedDateWithoutTime < today) {
          alert(
            "Dikkat! İlacınızın başlangıç tarihi geçmiş olabilir. Bugünün tarihi otomatik olarak ayarlandı."
          );
          selectedDate = today;
        }
      }

      const dateString = selectedDate.toISOString().split("T")[0];
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          [isStartDate ? "startDate" : "endDate"]: dateString,
          ...(isStartDate ? { endDate: "" } : {}), // Başlangıç tarihi değiştiğinde bitiş tarihini sıfırla
        },
      });
    }
  };

  const handleFrequencyChange = (frequency: (typeof FREQUENCY_OPTIONS)[0]) => {
    setSelectedFrequency(frequency);
    if (frequency.subOptions) {
      setSelectedSubOption(frequency.subOptions[0]);
      if (TIME_PRESETS[frequency.subOptions[0] as keyof typeof TIME_PRESETS]) {
        setFormData({
          ...formData,
          usage: {
            ...formData.usage!,
            frequency: frequency.label,
            time: TIME_PRESETS[
              frequency.subOptions[0] as keyof typeof TIME_PRESETS
            ],
          },
        });
      }
    }
  };

  const handleSubOptionChange = (subOption: string) => {
    setSelectedSubOption(subOption);
    if (TIME_PRESETS[subOption as keyof typeof TIME_PRESETS]) {
      setFormData({
        ...formData,
        usage: {
          ...formData.usage!,
          frequency: `${selectedFrequency.label} - ${subOption}`,
          time: TIME_PRESETS[subOption as keyof typeof TIME_PRESETS],
        },
      });
    }
  };

  const handleSave = async () => {
    try {
      console.log("=== İLAÇ KAYIT İŞLEMİ BAŞLADI ===");
      console.log("Form Verisi:", formData);

      // İlaç adı kontrolü
      if (!formData.name || formData.name.trim() === "") {
        console.log("HATA: İlaç adı boş olamaz!");
        alert("İlaç adı zorunludur!");
        return;
      }

      // Tarih kontrolü
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = formData.schedule?.startDate
        ? new Date(formData.schedule.startDate)
        : null;
      startDate?.setHours(0, 0, 0, 0);

      if (startDate && startDate < today) {
        console.log("UYARI: Başlangıç tarihi geçmiş bir tarih!");
        alert(
          "Dikkat! İlacınızın başlangıç tarihi geçmiş olabilir. Bugünün tarihi otomatik olarak ayarlandı."
        );
        const todayString = today.toISOString().split("T")[0];
        setFormData({
          ...formData,
          schedule: {
            ...formData.schedule,
            startDate: todayString,
            endDate: "", // Bitiş tarihini sıfırla
          },
        });
        return;
      }

      // İlaç kaydetme/güncelleme
      const medicineToSave = {
        ...formData,
        id: formData.id || generateId(),
        name: formData.name.trim(), // name'i temizleyip kaydediyoruz
      };

      // İlaç zamanlarını timezone'a göre dönüştür
      const timezoneAdjustedTimes =
        medicineToSave.usage?.time?.map((time) =>
          convertTimeToDeviceTimezone(time)
        ) || [];
      console.log(
        "Timezone'a göre düzenlenmiş saatler:",
        timezoneAdjustedTimes
      );

      const medicineToSaveWithTimezone = {
        ...medicineToSave,
        usage: {
          ...medicineToSave.usage!,
          time: timezoneAdjustedTimes,
        },
        schedule: {
          ...medicineToSave.schedule!,
          reminders: timezoneAdjustedTimes,
        },
      };

      if (isEditMode) {
        console.log("İlaç güncelleniyor...");
        await updateMedicine(medicineToSaveWithTimezone);
        console.log("İlaç başarıyla güncellendi:", medicineToSaveWithTimezone);
      } else {
        console.log("Yeni ilaç kaydediliyor...");
        await addMedicine(medicineToSaveWithTimezone);
        console.log("İlaç başarıyla kaydedildi:", medicineToSaveWithTimezone);
      }

      // Reminder ekleme
      const start = medicineToSaveWithTimezone.schedule?.startDate;
      const end = medicineToSaveWithTimezone.schedule?.endDate || start;
      const times = medicineToSaveWithTimezone.usage?.time || [];

      console.log("Reminder oluşturma parametreleri:", {
        startDate: start,
        endDate: end,
        times: times,
      });

      if (start && times.length > 0) {
        console.log("Reminder'lar oluşturuluyor...");
        const days = getDateRange(start, end);
        console.log("Oluşturulacak günler:", days);

        for (const day of days) {
          for (const time of times) {
            console.log(`${day} için ${time} saati reminder oluşturuluyor...`);
            const reminder = {
              id: generateId(),
              medicineId: medicineToSaveWithTimezone.id,
              medicine: medicineToSaveWithTimezone,
              date: day,
              time: time,
              title: medicineToSaveWithTimezone.name,
              description: `${
                medicineToSaveWithTimezone.dosage?.amount || ""
              } ${medicineToSaveWithTimezone.dosage?.unit || ""} ${
                medicineToSaveWithTimezone.usage?.condition || ""
              }`,
              isTaken: false,
              scheduledTime: `${day}T${time}:00.000Z`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await addReminder(reminder);
            console.log("Reminder tipinde veri kaydedildi:", reminder);
          }
        }
        console.log("Tüm reminder'lar (veritabanında) başarıyla oluşturuldu");
      } else {
        console.log("Reminder oluşturma için gerekli parametreler eksik");
      }

      // Bildirimleri yeniden planla
      await scheduleRemindersFromDatabase();
      console.log("Bildirimler yeniden planlandı");

      console.log("=== İLAÇ KAYIT İŞLEMİ TAMAMLANDI ===");
      onClose();
    } catch (error) {
      console.error("İlaç kaydetme hatası:", error);
      alert("İlaç kaydedilirken bir hata oluştu: " + (error as Error).message);
    }
  };

  const handleDelete = async () => {
    try {
      // İlacın tüm reminder'larını bul ve bildirimlerini iptal et
      const reminders = await getAllReminders();
      const medicineReminders = reminders.filter(
        (r) => r.medicineId === formData.id
      );

      for (const reminder of medicineReminders) {
        const notifId = await getNotificationId(reminder.id);
        if (notifId) {
          await Notifications.cancelScheduledNotificationAsync(notifId);
          await removeNotificationId(reminder.id);
        }
      }

      // İlacı ve ilgili reminder'ları sil
      await deleteMedicine(formData.id || "");

      // Kalan bildirimleri yeniden planla
      await scheduleRemindersFromDatabase();

      onClose();
    } catch (error) {
      console.error("Error deleting medicine and its reminders:", error);
      alert("İlaç ve ilgili reminder'lar silinirken bir hata oluştu!");
    }
  };

  const openTimePicker = (index: number) => {
    setCurrentTimeIndex(index);
    setPickerMode("time");
    setPickerTarget("time");
    setTempDate(new Date());
  };

  const openStartDatePicker = () => {
    setPickerMode("date");
    setPickerTarget("start");
    setTempDate(new Date(formData.schedule?.startDate || new Date()));
  };

  const openEndDatePicker = () => {
    setPickerMode("date");
    setPickerTarget("end");
    setTempDate(new Date(formData.schedule?.endDate || new Date()));
  };

  const handlePickerConfirm = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    if (pickerTarget === "time") {
      const timeString = date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: getDeviceTimezone(),
      });
      const newTimes = [...(formData.usage?.time || [])];
      newTimes[currentTimeIndex] = timeString;
      setFormData({
        ...formData,
        usage: {
          ...formData.usage!,
          time: newTimes,
        },
      });
    } else if (pickerTarget === "start") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      let finalDate = selectedDate;
      if (selectedDate < today) finalDate = today;
      const dateString = `${finalDate.getFullYear()}-${pad(
        finalDate.getMonth() + 1
      )}-${pad(finalDate.getDate())}`;
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          startDate: dateString,
          endDate: "",
        },
      });
    } else if (pickerTarget === "end") {
      const pad = (n: number) => n.toString().padStart(2, "0");
      const finalDate = new Date(date);
      finalDate.setHours(0, 0, 0, 0);
      const dateString = `${finalDate.getFullYear()}-${pad(
        finalDate.getMonth() + 1
      )}-${pad(finalDate.getDate())}`;
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          endDate: dateString,
        },
      });
    }
    setPickerMode(null);
    setPickerTarget(null);
  };

  const handlePickerCancel = () => {
    setPickerMode(null);
    setPickerTarget(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }}>
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
              {isEditMode ? "İlaç Düzenle" : "Yeni İlaç Ekle"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons
                name="close"
                color={styles.colors.text}
                size={24}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={localStyles.modalContent}>
            {detectedMedicine && (
              <DetectedMedicineInfo
                medicine={detectedMedicine}
                onUse={handleUseDetected}
              />
            )}

            <View style={localStyles.imagePickerContainer}>
              <TouchableOpacity
                style={[
                  localStyles.imagePickerButton,
                  { backgroundColor: styles.colors.primary },
                ]}
                onPress={() => pickImage(false)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <MaterialIcons name="image" size={24} color="white" />
                    <Text
                      style={[
                        styles.typography.body,
                        { color: "white", marginLeft: 8 },
                      ]}
                    >
                      Galeriden Seç
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  localStyles.imagePickerButton,
                  { backgroundColor: styles.colors.primary },
                ]}
                onPress={takePhoto}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <MaterialIcons
                      name="photo-camera"
                      size={24}
                      color="white"
                    />
                    <Text
                      style={[
                        styles.typography.body,
                        { color: "white", marginLeft: 8 },
                      ]}
                    >
                      Fotoğraf Çek
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <FormField label="İlaç Adı">
              <TextInput
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                style={[
                  localStyles.input,
                  {
                    backgroundColor: styles.colors.card,
                    borderColor: styles.colors.border,
                    color: styles.colors.text,
                  },
                ]}
                placeholderTextColor={styles.colors.tabBarInactive}
                placeholder="İlaç adını girin"
              />
            </FormField>

            <FormField label="İlaç Türü">
              <SelectButton
                value={formData.type || ""}
                options={MEDICINE_TYPES}
                onSelect={(value) => setFormData({ ...formData, type: value })}
              />
            </FormField>

            <FormField label="İlaç Sınıfı">
              <SelectButton
                value={formData.class || ""}
                options={MEDICINE_CLASS}
                onSelect={(value) => setFormData({ ...formData, class: value })}
              />
            </FormField>

            <FormField label="Doz">
              <View style={localStyles.dosageContainer}>
                <TextInput
                  value={formData.dosage?.amount.toString()}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      dosage: {
                        ...formData.dosage!,
                        amount: parseInt(text) || 0,
                      },
                    })
                  }
                  keyboardType="numeric"
                  style={[
                    localStyles.input,
                    localStyles.dosageInput,
                    {
                      backgroundColor: styles.colors.card,
                      borderColor: styles.colors.border,
                      color: styles.colors.text,
                    },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <SelectButton
                    value={formData.dosage?.unit || ""}
                    options={UNIT_OPTIONS}
                    onSelect={(value) =>
                      setFormData({
                        ...formData,
                        dosage: { ...formData.dosage!, unit: value },
                      })
                    }
                  />
                </View>
              </View>
            </FormField>

            <FormField label="Kullanım Sıklığı">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 12 }}
              >
                <View style={localStyles.selectContainer}>
                  {FREQUENCY_OPTIONS.map((frequency) => (
                    <TouchableOpacity
                      key={frequency.id}
                      onPress={() => handleFrequencyChange(frequency)}
                      style={[
                        localStyles.selectButton,
                        {
                          backgroundColor:
                            selectedFrequency.id === frequency.id
                              ? styles.colors.primary
                              : styles.colors.card,
                          borderColor: styles.colors.border,
                          borderRadius: styles.borderRadius.sm,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.typography.body,
                          {
                            color:
                              selectedFrequency.id === frequency.id
                                ? "white"
                                : styles.colors.text,
                          },
                        ]}
                      >
                        {frequency.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {selectedFrequency.subOptions && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={localStyles.selectContainer}>
                    {selectedFrequency.subOptions.map((subOption) => (
                      <TouchableOpacity
                        key={subOption}
                        onPress={() => handleSubOptionChange(subOption)}
                        style={[
                          localStyles.selectButton,
                          {
                            backgroundColor:
                              selectedSubOption === subOption
                                ? styles.colors.primary
                                : styles.colors.card,
                            borderColor: styles.colors.border,
                            borderRadius: styles.borderRadius.sm,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typography.body,
                            {
                              color:
                                selectedSubOption === subOption
                                  ? "white"
                                  : styles.colors.text,
                            },
                          ]}
                        >
                          {subOption}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </FormField>

            <FormField label="Kullanım Zamanı">
              <TimeSelector
                times={formData.usage?.time || []}
                selectedFrequency={selectedFrequency}
                onTimeSelect={(time, index) => {
                  const newTimes = [...(formData.usage?.time || [])];
                  newTimes[index] = time;
                  setFormData({
                    ...formData,
                    usage: {
                      ...formData.usage!,
                      time: newTimes,
                    },
                  });
                }}
                onTimeAdd={() => {
                  if (formData.usage?.time) {
                    setFormData({
                      ...formData,
                      usage: {
                        ...formData.usage,
                        time: [...formData.usage.time, "12:00"],
                      },
                    });
                  }
                }}
                onTimeRemove={(index) => {
                  const newTimes =
                    formData.usage?.time.filter((_, i) => i !== index) || [];
                  setFormData({
                    ...formData,
                    usage: {
                      ...formData.usage!,
                      time: newTimes,
                    },
                  });
                }}
                onDefaultTimeSelect={(timeOfDay) => {
                  if (formData.usage?.time) {
                    const newTimes = [...formData.usage.time];
                    newTimes[currentTimeIndex] =
                      timeOfDay === "morning"
                        ? "08:00"
                        : timeOfDay === "noon"
                        ? "14:00"
                        : "20:00";
                    setFormData({
                      ...formData,
                      usage: {
                        ...formData.usage,
                        time: newTimes,
                      },
                    });
                  }
                }}
                onShowTimePicker={openTimePicker}
              />
            </FormField>

            <FormField label="Kullanım Şekli">
              <SelectButton
                value={formData.usage?.condition || ""}
                options={CONDITION_OPTIONS}
                onSelect={(value) =>
                  setFormData({
                    ...formData,
                    usage: { ...formData.usage!, condition: value },
                  })
                }
              />
            </FormField>

            <FormField label="Başlangıç Tarihi">
              <TouchableOpacity
                onPress={openStartDatePicker}
                style={[
                  localStyles.dateButton,
                  {
                    backgroundColor: styles.colors.card,
                    borderColor: styles.colors.border,
                  },
                ]}
              >
                <MaterialIcons
                  name="calendar-today"
                  size={16}
                  color={styles.colors.text}
                />
                <Text
                  style={[
                    styles.typography.body,
                    { marginLeft: 8, color: styles.colors.text },
                  ]}
                >
                  {formData.schedule?.startDate ||
                    new Date().toISOString().split("T")[0]}
                </Text>
              </TouchableOpacity>
            </FormField>

            <FormField label="Bitiş Tarihi (Opsiyonel)">
              <TouchableOpacity
                onPress={openEndDatePicker}
                style={[
                  localStyles.dateButton,
                  {
                    backgroundColor: styles.colors.card,
                    borderColor: styles.colors.border,
                  },
                ]}
              >
                <MaterialIcons
                  name="calendar-today"
                  size={16}
                  color={styles.colors.text}
                />
                <Text
                  style={[
                    styles.typography.body,
                    { marginLeft: 8, color: styles.colors.text },
                  ]}
                >
                  {formData.schedule?.endDate || "Seçiniz"}
                </Text>
              </TouchableOpacity>
            </FormField>

            <FormField label="Notlar (Opsiyonel)">
              <TextInput
                value={formData.notes}
                onChangeText={(text) =>
                  setFormData({ ...formData, notes: text })
                }
                multiline
                numberOfLines={4}
                style={[
                  localStyles.input,
                  localStyles.textArea,
                  {
                    backgroundColor: styles.colors.card,
                    borderColor: styles.colors.border,
                    color: styles.colors.text,
                  },
                ]}
                placeholderTextColor={styles.colors.tabBarInactive}
                placeholder="İlaç ile ilgili notlarınızı buraya yazabilirsiniz"
              />
            </FormField>

            <View style={localStyles.buttonContainer}>
              <TouchableOpacity
                style={[
                  localStyles.submitButton,
                  { backgroundColor: styles.colors.primary },
                ]}
                onPress={handleSave}
              >
                <Text style={[styles.typography.body, { color: "white" }]}>
                  {isEditMode ? "Güncelle" : "Kaydet"}
                </Text>
              </TouchableOpacity>

              {isEditMode && (
                <TouchableOpacity
                  style={[
                    localStyles.deleteButton,
                    { backgroundColor: styles.colors.danger },
                  ]}
                  onPress={handleDelete}
                >
                  <Text style={[styles.typography.body, { color: "white" }]}>
                    İlacı Sil
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          <DateTimePickerModal
            isVisible={!!pickerMode}
            mode={pickerMode || "date"}
            date={tempDate}
            onConfirm={handlePickerConfirm}
            onCancel={handlePickerCancel}
            locale="tr-TR"
            headerTextIOS={pickerTarget === "time" ? "Saat Seç" : "Tarih Seç"}
            cancelTextIOS="İptal"
            confirmTextIOS="Tamam"
            display="spinner"
          />
        </View>
      </SafeAreaView>
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
  formField: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: "Inter-Regular",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    padding: 12,
  },
  selectContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  selectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  dosageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dosageInput: {
    width: 100,
    marginRight: 12,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imagePickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
});
