import React from "react";
import { render } from "@testing-library/react-native";
import DailyScreen from "@/screens/daily";

describe("DailyScreen entegrasyon", () => {
  it("günlük başlığını ve ana UI elementlerini gösterir", () => {
    const { getByText } = render(<DailyScreen />);
    expect(getByText(/Günlük/i)).toBeTruthy();
    expect(getByText(/İlaçlar/)).toBeTruthy();
  });
});
