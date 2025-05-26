import React from "react";
import { render } from "@testing-library/react-native";
import CalendarMedicationCard from "@/components/CalendarMedicationCard";

describe("CalendarMedicationCard", () => {
  const medicine = { name: "Parol", class: "Ağrı Kesici" };
  it("ilaç adını ve sınıfını doğru gösterir", () => {
    const { getByText } = render(
      <CalendarMedicationCard medicine={medicine} />
    );
    expect(getByText("Parol")).toBeTruthy();
    expect(getByText("Ağrı Kesici")).toBeTruthy();
  });
});
