import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MedicationCard from "../../src/components/MedicationCard";

describe("MedicationCard", () => {
  const mockProps = {
    medicine: {
      id: "1",
      name: "Parol",
      dosage: { amount: 1, unit: "tablet" },
      usage: { frequency: "daily", time: ["08:00"], condition: "after meal" },
      schedule: {
        startDate: "2024-03-20",
        endDate: "2024-03-25",
        reminders: [],
      },
    },
    onPress: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
  };

  it("component render edilmeli", () => {
    const { getByText } = render(<MedicationCard {...mockProps} />);
    expect(getByText("Parol")).toBeTruthy();
    expect(getByText("1 tablet")).toBeTruthy();
  });

  it("onPress çalışmalı", () => {
    const { getByTestId } = render(<MedicationCard {...mockProps} />);
    fireEvent.press(getByTestId("medication-card"));
    expect(mockProps.onPress).toHaveBeenCalled();
  });

  it("onDelete çalışmalı", () => {
    const { getByTestId } = render(<MedicationCard {...mockProps} />);
    fireEvent.press(getByTestId("delete-button"));
    expect(mockProps.onDelete).toHaveBeenCalled();
  });

  it("onEdit çalışmalı", () => {
    const { getByTestId } = render(<MedicationCard {...mockProps} />);
    fireEvent.press(getByTestId("edit-button"));
    expect(mockProps.onEdit).toHaveBeenCalled();
  });
});
