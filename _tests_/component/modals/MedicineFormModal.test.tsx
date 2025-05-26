import React from "react";
import { render } from "@testing-library/react-native";
import MedicineFormModal from "@/components/modals/MedicineFormModal";

describe("MedicineFormModal", () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    formData: {},
    setFormData: jest.fn(),
    isEditMode: false,
    showTimePicker: false,
    setShowTimePicker: jest.fn(),
    showStartDatePicker: false,
    setShowStartDatePicker: jest.fn(),
    showEndDatePicker: false,
    setShowEndDatePicker: jest.fn(),
    currentTimeIndex: 0,
    setCurrentTimeIndex: jest.fn(),
    selectedFrequency: { id: "daily", label: "Günlük" },
    setSelectedFrequency: jest.fn(),
    selectedSubOption: "",
    setSelectedSubOption: jest.fn(),
  };
  it("modal başlığını gösterir", () => {
    const { getByText } = render(<MedicineFormModal {...defaultProps} />);
    expect(getByText("Yeni İlaç Ekle")).toBeTruthy();
  });
});
