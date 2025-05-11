import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CalendarMedicationCard from "../../src/components/CalendarMedicationCard";

describe("CalendarMedicationCard", () => {
  const mockProps = {
    medication: {
      id: "1",
      name: "Parol",
      dosage: "500mg",
      time: "09:00",
      days: ["Pazartesi", "Çarşamba", "Cuma"],
      notes: "Yemeklerden sonra alınmalı",
    },
    onPress: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
  };

  it("component render edilmeli", () => {
    const { getByText } = render(<CalendarMedicationCard {...mockProps} />);
    expect(getByText("Parol")).toBeTruthy();
    expect(getByText("500mg")).toBeTruthy();
    expect(getByText("09:00")).toBeTruthy();
  });

  it("ilacın günleri doğru gösterilmeli", () => {
    const { getByText } = render(<CalendarMedicationCard {...mockProps} />);
    expect(getByText("Pazartesi")).toBeTruthy();
    expect(getByText("Çarşamba")).toBeTruthy();
    expect(getByText("Cuma")).toBeTruthy();
  });

  it("notlar varsa gösterilmeli", () => {
    const { getByText } = render(<CalendarMedicationCard {...mockProps} />);
    expect(getByText("Yemeklerden sonra alınmalı")).toBeTruthy();
  });

  it("onPress callback'i çalışmalı", () => {
    const { getByTestId } = render(<CalendarMedicationCard {...mockProps} />);
    fireEvent.press(getByTestId("calendar-medication-card"));
    expect(mockProps.onPress).toHaveBeenCalledWith(mockProps.medication);
  });

  it("onDelete callback'i çalışmalı", () => {
    const { getByTestId } = render(<CalendarMedicationCard {...mockProps} />);
    fireEvent.press(getByTestId("delete-button"));
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.medication.id);
  });

  it("onEdit callback'i çalışmalı", () => {
    const { getByTestId } = render(<CalendarMedicationCard {...mockProps} />);
    fireEvent.press(getByTestId("edit-button"));
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockProps.medication);
  });
});
