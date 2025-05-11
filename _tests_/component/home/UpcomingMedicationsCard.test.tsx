import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import UpcomingMedicationsCard from "../../../src/components/home/UpcomingMedicationsCard";

describe("UpcomingMedicationsCard", () => {
  const mockProps = {
    medications: [
      {
        id: "1",
        name: "Parol",
        dosage: "500mg",
        time: "09:00",
        taken: false,
      },
      {
        id: "2",
        name: "Aspirin",
        dosage: "100mg",
        time: "14:00",
        taken: true,
      },
    ],
    onPress: jest.fn(),
  };

  it("component render edilmeli", () => {
    const { getByTestId } = render(<UpcomingMedicationsCard {...mockProps} />);
    expect(getByTestId("upcoming-medications-card")).toBeTruthy();
  });

  it("yaklaşan ilaçlar doğru gösterilmeli", () => {
    const { getByText } = render(<UpcomingMedicationsCard {...mockProps} />);
    expect(getByText("Parol")).toBeTruthy();
    expect(getByText("500mg")).toBeTruthy();
    expect(getByText("09:00")).toBeTruthy();
    expect(getByText("Aspirin")).toBeTruthy();
    expect(getByText("100mg")).toBeTruthy();
    expect(getByText("14:00")).toBeTruthy();
  });

  it("ilacın alınma durumu doğru gösterilmeli", () => {
    const { getByTestId } = render(<UpcomingMedicationsCard {...mockProps} />);
    expect(getByTestId("medication-status-1")).toHaveTextContent("Alınmadı");
    expect(getByTestId("medication-status-2")).toHaveTextContent("Alındı");
  });

  it("kart tıklandığında onPress çağrılmalı", () => {
    const { getByTestId } = render(<UpcomingMedicationsCard {...mockProps} />);
    fireEvent.press(getByTestId("upcoming-medications-card"));
    expect(mockProps.onPress).toHaveBeenCalled();
  });

  it("ilaç yoksa uygun mesaj gösterilmeli", () => {
    const { getByText } = render(
      <UpcomingMedicationsCard medications={[]} onPress={jest.fn()} />
    );
    expect(getByText("Yaklaşan ilaç bulunmuyor")).toBeTruthy();
  });

  it("ilaçlar zaman sırasına göre sıralanmalı", () => {
    const { getAllByTestId } = render(
      <UpcomingMedicationsCard {...mockProps} />
    );
    const medicationItems = getAllByTestId("medication-item");
    expect(medicationItems[0]).toHaveTextContent("Parol");
    expect(medicationItems[1]).toHaveTextContent("Aspirin");
  });
});
