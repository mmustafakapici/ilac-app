import React from "react";
import { render } from "@testing-library/react-native";
import DailyMedicationCard from "@/components/DailyMedicationCard";

describe("DailyMedicationCard", () => {
  const medicine = { name: "Parol", class: "Ağrı Kesici" };
  it("ilaç adını ve sınıfını doğru gösterir", () => {
    const { getByText } = render(<DailyMedicationCard medicine={medicine} />);
    expect(getByText("Parol")).toBeTruthy();
    expect(getByText("Ağrı Kesici")).toBeTruthy();
  });
});
