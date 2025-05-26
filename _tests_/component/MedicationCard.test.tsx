import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MedicationCard from "@/components/MedicationCard";

describe("MedicationCard", () => {
  const medicine = { name: "Parol", class: "Ağrı Kesici" };
  const onPress = jest.fn();

  it("ilaç adını ve sınıfını doğru gösterir", () => {
    const { getByText } = render(
      <MedicationCard medicine={medicine} onPress={onPress} />
    );
    expect(getByText("Parol")).toBeTruthy();
    expect(getByText("Ağrı Kesici")).toBeTruthy();
  });

  it("tıklama olayını tetikler", () => {
    const { getByText } = render(
      <MedicationCard medicine={medicine} onPress={onPress} />
    );
    fireEvent.press(getByText("Parol"));
    expect(onPress).toHaveBeenCalledWith(medicine);
  });
});
