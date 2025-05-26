import React from "react";
import { render } from "@testing-library/react-native";
import UpcomingMedicationsCard from "@/components/home/UpcomingMedicationsCard";

describe("UpcomingMedicationsCard", () => {
  it("yaklaşan ilaçları doğru gösterir", () => {
    const medications = [
      { name: "Parol", time: "08:00" },
      { name: "Aferin", time: "14:00" },
    ];
    const { getByText } = render(
      <UpcomingMedicationsCard medications={medications} />
    );
    expect(getByText("Parol")).toBeTruthy();
    expect(getByText("Aferin")).toBeTruthy();
    expect(getByText("08:00")).toBeTruthy();
    expect(getByText("14:00")).toBeTruthy();
  });
});
