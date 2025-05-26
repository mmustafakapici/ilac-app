import React from "react";
import { render } from "@testing-library/react-native";
import MedicineDateRangeCard from "@/components/calendar/MedicineDateRangeCard";

describe("MedicineDateRangeCard", () => {
  it("başlangıç ve bitiş tarihini doğru gösterir", () => {
    const { getByText } = render(
      <MedicineDateRangeCard startDate="2024-06-01" endDate="2024-06-10" />
    );
    expect(getByText("2024-06-01")).toBeTruthy();
    expect(getByText("2024-06-10")).toBeTruthy();
  });
});
