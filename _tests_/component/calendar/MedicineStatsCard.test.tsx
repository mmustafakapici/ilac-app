import React from "react";
import { render } from "@testing-library/react-native";
import MedicineStatsCard from "@/components/calendar/MedicineStatsCard";

describe("MedicineStatsCard", () => {
  it("istatistik değerlerini doğru gösterir", () => {
    const data = {
      labels: ["Pzt", "Sal", "Çar"],
      datasets: [{ data: [10, 7, 2] }],
    };
    const { getByText } = render(<MedicineStatsCard data={data} />);
    expect(getByText("10")).toBeTruthy();
    expect(getByText("7")).toBeTruthy();
    expect(getByText("2")).toBeTruthy();
  });
});
