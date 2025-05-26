import React from "react";
import { render } from "@testing-library/react-native";
import CalendarScreen from "@/screens/calendar";

describe("CalendarScreen entegrasyon", () => {
  it("takvim başlığını ve ana UI elementlerini gösterir", () => {
    const { getByText } = render(<CalendarScreen />);
    expect(getByText(/Takvim/i)).toBeTruthy();
    expect(getByText(/İlaçlar/)).toBeTruthy();
  });
});
