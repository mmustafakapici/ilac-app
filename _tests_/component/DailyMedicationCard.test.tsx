import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DailyMedicationCard from "../../src/components/DailyMedicationCard";

describe("DailyMedicationCard", () => {
  const mockProps = {
    medication: {
      id: "1",
      name: "Parol",
      dosage: "500mg",
      time: "09:00",
      taken: false,
      notes: "Yemeklerden sonra alınmalı",
    },
    onPress: jest.fn(),
    onTake: jest.fn(),
    onSkip: jest.fn(),
  };

  it("component render edilmeli", () => {
    const { getByText } = render(<DailyMedicationCard {...mockProps} />);
    expect(getByText("Parol")).toBeTruthy();
    expect(getByText("500mg")).toBeTruthy();
    expect(getByText("09:00")).toBeTruthy();
  });

  it("ilacın alınma durumu doğru gösterilmeli", () => {
    const { getByTestId } = render(<DailyMedicationCard {...mockProps} />);
    expect(getByTestId("medication-status")).toHaveTextContent("Alınmadı");
  });

  it("ilacın alındığı durumda doğru gösterilmeli", () => {
    const { getByTestId } = render(
      <DailyMedicationCard
        {...mockProps}
        medication={{ ...mockProps.medication, taken: true }}
      />
    );
    expect(getByTestId("medication-status")).toHaveTextContent("Alındı");
  });

  it("onPress callback'i çalışmalı", () => {
    const { getByTestId } = render(<DailyMedicationCard {...mockProps} />);
    fireEvent.press(getByTestId("daily-medication-card"));
    expect(mockProps.onPress).toHaveBeenCalledWith(mockProps.medication);
  });

  it("onTake callback'i çalışmalı", () => {
    const { getByTestId } = render(<DailyMedicationCard {...mockProps} />);
    fireEvent.press(getByTestId("take-button"));
    expect(mockProps.onTake).toHaveBeenCalledWith(mockProps.medication.id);
  });

  it("onSkip callback'i çalışmalı", () => {
    const { getByTestId } = render(<DailyMedicationCard {...mockProps} />);
    fireEvent.press(getByTestId("skip-button"));
    expect(mockProps.onSkip).toHaveBeenCalledWith(mockProps.medication.id);
  });

  it("notlar varsa gösterilmeli", () => {
    const { getByText } = render(<DailyMedicationCard {...mockProps} />);
    expect(getByText("Yemeklerden sonra alınmalı")).toBeTruthy();
  });
});
